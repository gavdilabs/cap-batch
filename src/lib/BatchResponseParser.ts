import {
  BatchContentType,
  BatchResponse,
  BatchResponseParser as IBatchResponseParser,
} from "./BatchBuilder.types";

const DEFAULT_HTTP_VERSION = "HTTP/1.1";
const CONTENT_TYPE = "Content-Type";
const CONTENT_LENGTH = "Content-Length";

//REGEX´es
const REGEX_STATUS_NUMBER = new RegExp("[0-9]{3}");
const REGEX_REQ_PARTS = new RegExp("(--batch|--changeset).+\r\n", "g");
const REGEX_PULL_NUMBER_ANY_LENGTH = new RegExp("[0-9]+");

export default class BatchResponseParser implements IBatchResponseParser {
  private bHasErrors: boolean = false;

  /**
   * Interface function for flag if response had errors
   * @returns boolean indication if response had errors
   */
  public hasErrors(): boolean {
    return this.bHasErrors;
  }

  /**
   * Interface function for Response Parser
   * @param response Full string rep. of the $batch response
   * @param httpVersion which DataVersion to look for defaults to HTTP/1.1
   * @returns Array of BatchResponse objects
   */
  public parseResponse(
    response: string,
    httpVersion: string = DEFAULT_HTTP_VERSION,
  ): BatchResponse[] {
    const output: BatchResponse[] = [];

    //Split the response into Request relevant parts based on --batch and --changeset
    const requestParts = response.split(REGEX_REQ_PARTS).filter((part) => {
      if (part && part.trim().length === 0) {
        return false;
      }

      return true;
    });

    //Build the responseobjects
    requestParts.forEach((part) => {
      const lines = part.split("\r\n");

      //TODO: If we can make the Request Regex smarter we can avoid this check

      const statusNumber = this.getStatusNumber(lines, httpVersion);
      const contentType = this.getContentType(lines);
      const contentLength = this.getLengthNumber(lines);

      //If we do not find the status - no need to do more. As its not a request/response w/o it
      if (statusNumber && contentType && contentLength) {
        let outputRecord: BatchResponse = {
          statusCode: statusNumber,
          contentType: contentType,
          contentLength: contentLength,
          data: this.getResponseData(lines, contentType),
          error: statusNumber > 299,
        };

        //Had errors?
        if (statusNumber > 299) {
          this.bHasErrors = true;
        }

        output.push(outputRecord);
      }
    });

    return output;
  }

  /**
   * Get the content type of the response data
   * @param lines All lines related to a single request
   * @returns string representation of the content-type for data. ie. application/json
   */
  private getContentType(lines: string[]): string | undefined {
    const contentTypes = lines.filter(
      (line) => line.indexOf(CONTENT_TYPE) === 0,
    );

    return contentTypes && contentTypes.length > 0
      ? contentTypes[contentTypes.length - 1]
      : undefined;
  }

  /**
   * Parses response data part based on the content-type
   * @param lines Array of string lines holding the content of the --batch
   * @param contentType
   * @returns
   */
  private getResponseData(
    lines: string[],
    contentType: string,
  ): object | string {
    const firstDataLine = lines.findIndex(
      (line) => line.indexOf(CONTENT_LENGTH) === 0,
    );

    if (firstDataLine > -1) {
      const data = lines[firstDataLine + 2] ? lines[firstDataLine + 2] : "";

      if (data) {
        switch (this.getBatchDataType(contentType)) {
          case BatchContentType.JSON:
            try {
              return JSON.parse(data);
            } catch {
              console.error(`Failed to serailize data: ${data} to JSON`);
            }
          default:
            return String(data);
        }
      }

      return {};
    } else {
      return {};
    }
  }

  /**
   * Helper for determining the enum type of the batch data
   * @param contentType string version of the content type
   * @returns Enum rep. of the content-type
   */
  private getBatchDataType(contentType: string): BatchContentType {
    if (contentType.indexOf("application/json") > -1) {
      return BatchContentType.JSON;
    } else if (contentType.indexOf("application/xml") > -1) {
      return BatchContentType.XML;
    } else {
      return BatchContentType.TEXT;
    }
  }

  /**
   * Get the Content-Length number value from the request lines
   * @param lines All lines related to a single request
   * @returns number or undefined
   */
  private getLengthNumber(lines: string[]): number | undefined {
    const lengthStr = lines.find((line) => line.indexOf(CONTENT_LENGTH) === 0);
    const numberPart = lengthStr?.match(REGEX_PULL_NUMBER_ANY_LENGTH);
    if (numberPart && Array.isArray(numberPart) && numberPart.length === 1) {
      return parseInt(numberPart[0]);
    } else {
      return undefined;
    }
  }

  /**
   * Gets the status number for the request ie. 200 OK, 201 CREATED etc.
   * @param lines All lines related to a single request
   * @param httpVersion We need this to determine start of status line
   * @returns number or undefined
   */
  private getStatusNumber(
    lines: string[],
    httpVersion: string,
  ): number | undefined {
    //Find status
    const statusLine = lines.find((line) => line.indexOf(httpVersion) === 0);

    if (!statusLine) {
      return undefined;
    }

    const numberPart = statusLine.match(REGEX_STATUS_NUMBER);
    if (numberPart && Array.isArray(numberPart) && numberPart.length === 1) {
      return parseInt(numberPart[0]);
    } else {
      return undefined;
    }
  }
}
