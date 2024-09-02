import { Service, Request } from "@sap/cds";
import axios, { AxiosRequestConfig } from "axios";
import {
  BatchContentType,
  BatchInnerRequest,
  BatchMethod,
  BatchRequest,
  BatchResponse,
  DataServiceVersion,
  TestService,
} from "./BatchBuilder.types";
import BatchResponseParser from "./BatchResponseParser";
import {
  formatRequestDataForBatch,
  generateBatchID,
  generateChangesetID,
} from "./utils";

const NEW_LINE = "\r\n";

// TODO: Remove redundant generic types

/**
 * Builder, parser and requester for batch queries.
 * Supports batch queries for OData V2 & V4
 */
export default class BatchQueryBuilder {
  private batchBody: string = "";
  private batchRequests: BatchInnerRequest[] = [];

  private service: Service | TestService;
  private request: Request | undefined;

  private output: BatchResponse[] = [];
  private maxBatchRequests: number = 50;
  private dataServiceVersion = DataServiceVersion.ODataV2;

  constructor(
    request: Request | undefined,
    service: Service | TestService,
    maxBatchRequests: number = 50,
    dataServiceVersion = DataServiceVersion.ODataV2,
  ) {
    this.service = service;
    this.request = request;
    this.maxBatchRequests = maxBatchRequests;
    this.dataServiceVersion = dataServiceVersion;
  }

  /**
   * Checks and enriches batch request ie. format should be applied based on request contentT
   * @param request Batch Request
   */
  private updateRequest(request: BatchRequest) {
    //Check 01: if the format has been applied to the path
    if (request.method == BatchMethod.GET) {
      let format2Check = "$format=";
      switch (request.contentType) {
        case BatchContentType.JSON:
          format2Check += "json";
          break;
        case BatchContentType.XML:
          format2Check += "xml";
          break;
      }
      if (request.path.indexOf(format2Check) === -1) {
        //we apply it
        request.path +=
          request.path.indexOf("?") > -1
            ? `&${format2Check}`
            : `?${format2Check}`;
      }
    }

    //Check 02: if path does not have / as first character make sure it has
    request.path =
      request.path && request.path[0] !== "/"
        ? `/${request.path}`
        : request.path;
  }

  /**
   * Adds a request to the batch.
   *
   * @public
   * @param {Request} request
   * @param {string} [transferEncoding="binary"]
   * @param {string} [httpVersion="HTTP/1.1"]
   */
  public addRequest(
    request: BatchRequest,
    transferEncoding: string = "binary",
    httpVersion: string = "HTTP/1.1",
  ): this {
    if (!request) return this;

    //BUGFIX 31.01.24 Content Format was not applied automatically
    this.updateRequest(request);

    this.batchRequests.push({
      transferEncoding: transferEncoding,
      httpVersion: httpVersion,
      outputOrder: this.batchRequests.length, //Store the output order
      ...request,
    });

    return this;
  }

  /**
   * Returns the current batch request as a string
   *
   * @public
   * @returns {string} batch request as string
   */
  public toString(): string {
    return this.batchBody;
  }

  /**
   * Returns the batch requests in the builder
   *
   * @public
   * @returns {BatchRequest[]} requests stored in builder
   */
  public getBatchRequests(): BatchRequest[] {
    return this.batchRequests;
  }

  /**
   * Returns the output from the batch request as an unknown array of results
   *
   * @public
   * @returns {BatchResponse<unknown>[]} Responses from batch requests
   */
  public result(): BatchResponse[] {
    return this.output;
  }

  /**
   * Returns the configured max batch limit for the builder
   *
   * @public
   * @returns {number} Max batch limit
   */
  public getMaxBatchLimit(): number {
    return this.maxBatchRequests;
  }

  /**
   * Fires the requests stored in the builder as batches
   *
   * @public
   * @returns {Promise<BatchResponse<T>|undefined>} Batch response
   */
  public async fire<T>(): Promise<BatchResponse[] | undefined> {
    if (this.batchRequests.length === 0) {
      throw new Error("No Batch Requests to fire");
    }

    try {
      //First we need to sort the requests based on GET or Not
      this.batchRequests = this.batchRequests.sort((req1, req2) => {
        if (req1.method === BatchMethod.GET) {
          return -1;
        } else if (req2.method === BatchMethod.GET) {
          return 1;
        }
        return 0;
      });

      void (await this._fireBatch<T>(0));
      return this.output ? (this.output as BatchResponse[]) : undefined;
    } catch (e) {
      throw new Error(`Failed to fire batch request due to request error`);
    }
  }

  /**
   * Function that adds a Non-Get request to the batch ie. Post/Put etc
   * @param req
   * @param batchId
   */
  private addChangeSetRequest(req: BatchInnerRequest, batchId: string) {
    this.addCommonRequestHeader(req, batchId);
    if (req.data) {
      this._addBatchBodyLine(
        `Content-Length: ${formatRequestDataForBatch(req.data).length}`,
      );
    }
    this._addBatchBodyLine();

    if (req.data && req.method !== BatchMethod.GET) {
      this._addBatchBodyLine(formatRequestDataForBatch(req.data));
    }
  }

  /**
   * Controls adding the correct content-type to each reqest based on BatchContentType
   * @param contentType
   */
  private appendAcceptTypeFromContentType(contentType: BatchContentType) {
    switch (contentType) {
      case BatchContentType.JSON:
        this._addBatchBodyLine(`Accept: application/json,plain/text`);
        break;
      // TODO: Allow for other BatchContentType (xml & plain text)
      // TODO: Should we throw an error here in case of default?
    }
  }

  /**
   * Function that adds common parts to Read and Changeset Requests
   * @param req
   * @param batchId
   */
  private addCommonRequestHeader(req: BatchInnerRequest, batchId: string) {
    this._addBatchBodyLine(`--${batchId}`)
      ._addBatchBodyLine(`Content-Type: application/http`)
      ._addBatchBodyLine(`Content-Transfer-Encoding: ${req.transferEncoding}`)
      ._addBatchBodyLine()
      ._addBatchBodyLine(
        `${req.method} ${
          req.path && req.path[0] === "/" ? req.path : `/${req.path}`
        } ${req.httpVersion}`,
      )
      ._addBatchBodyLine(`Content-Type: ${req.contentType}`);

    this.appendAcceptTypeFromContentType(req.contentType);
  }

  /**
   * Function that adds a Read/Get batch request
   * @param req Batch request configration
   * @param batchId batch id to attach to the request
   */
  private addGetRequest(req: BatchInnerRequest, batchId: string) {
    this.addCommonRequestHeader(req, batchId);
    this._addBatchBodyLine();
  }

  /**
   * Slices the Input Batch Requests into the required page size based on constructor input
   * @param page page number
   * @returns Sliced array of BatchInnerRequest (fitted for a page)
   */
  private getPageRequests(page: number): BatchInnerRequest[] {
    const pageStart = page * this.maxBatchRequests;
    return this.batchRequests.slice(
      pageStart,
      pageStart + this.maxBatchRequests,
    );
  }

  /**
   * Builds the stored requests a a string request body for a given page number
   *
   * @public
   * @param {number} page
   * @returns {string} Batch request body
   */
  public buildQuery(page: number): string | undefined {
    // As a first step we must always empty the previous batch content
    this.batchBody = "";

    const changeSetId = generateChangesetID();
    const batchId = generateBatchID();
    const pageRequests = this.getPageRequests(page);

    let changeSetHeaderAdded: boolean = false;

    if (pageRequests.length === 0) return undefined;

    // Add requests to batch body
    pageRequests.forEach((req, index) => {
      //Determine
      if (req.method === BatchMethod.GET) {
        this.addGetRequest(req, batchId);
      } else {
        if (!changeSetHeaderAdded) {
          this._addBatchBodyLine(`--${batchId}`);
          this._addBatchBodyLine(
            `Content-Type: multipart/mixed; boundary=${changeSetId}`,
          );
          this._addBatchBodyLine();

          changeSetHeaderAdded = true;
        }

        this.addChangeSetRequest(req, changeSetId);

        //Last Changeset line?
        if (pageRequests.length - 1 === index) {
          this._addBatchBodyLine();
          this._addBatchBodyLine(`--${changeSetId}--`);
        }
        this._addBatchBodyLine();
      }

      this._addBatchBodyLine();
    });

    // Once all requests have been added to batch, add closure tags
    this._addBatchBodyLine(`--${batchId}--`, true);

    return batchId;
  }

  /**
   * Utility: function mainly for tests and debugging
   * @returns the currently generated batch body generated from a buildQuery Call
   */
  public getBatchBody(): string {
    return this.batchBody;
  }

  /**
   * Parses the response string body received from the request to a given type.
   *
   * @public
   * @param {string} response
   * @returns {this} Instance chain
   */
  public parseBatchResponse(response: string): this {
    if (
      !response ||
      (typeof response === "string" && response.trim().length === 0)
    )
      return this;

    const responsePart = new BatchResponseParser().parseResponse(response);
    if (responsePart && Array.isArray(responsePart)) {
      this.output = this.output.concat(responsePart);
    }

    return this;
  }

  /**
   * Adds a given line to the request body
   *
   * @private
   * @param {string} [line]
   * @param {boolean} [skipNewLine=false]
   * @returns {this} Instance chain
   */
  private _addBatchBodyLine(line?: string, skipNewLine: boolean = false): this {
    this.batchBody += line ?? "";

    if (skipNewLine) return this;

    this.batchBody += NEW_LINE;
    return this;
  }

  /**
   * Fires the batch at a given paging
   *
   * @private
   * @param {number} page
   * @returns {Promise<void>}
   */
  private async _fireBatch<T>(page: number): Promise<void> {
    // First we build the query
    const batchId = this.buildQuery(page);

    if (!batchId) {
      //We are done batching
      return;
    }

    const headers = {
      MaxDataServiceVersion: this.dataServiceVersion,
      "Content-Type": `multipart/mixed; boundary=${batchId}`,
    };

    // Perform http request with batch
    let res: string | undefined = undefined;
    if ((this.service as TestService).baseUrl === undefined) {
      res = await (this.service as Service)
        .transaction(this.request)
        .send("POST", "/$batch", this.batchBody as String, headers);
    } else {
      //Test service
      const testService: TestService = this.service as TestService;

      let config: AxiosRequestConfig = {
        method: "post",
        maxBodyLength: Infinity,
        baseURL: `${testService.baseUrl}`,
        url: "/$batch",
        headers: headers,
        data: this.batchBody as String,
      };

      //Credentials sent along?
      if (testService.username && testService.password) {
        config.auth = {
          username: testService.username,
          password: testService.password,
        };
      }

      try {
        const axiosResponse = await axios.request(config);
        res = axiosResponse.data;
      } catch (e) {
        throw new Error(typeof e === "string" ? e : JSON.stringify(e));
      }
    }

    this.parseBatchResponse(res ? res : "");

    // Now recursively repeat for the required amount of pages
    void (await this._fireBatch(1 + page));
  }

  /**
   * You wanna re-use the same builder for another set of batches - then you need to clear it first.
   */
  public clear() {
    this.output = [];
    this.batchBody = "";
    this.batchRequests = [];
  }
}
