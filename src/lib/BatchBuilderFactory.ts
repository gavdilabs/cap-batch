import { Request, Service } from "@sap/cds";
import { BatchQueryBuilder, DataServiceVersion } from ".";
import { TestService } from "./BatchBuilder.types";

/**
 * Factory for BatchQueryBuilder.
 * Allows for creating multiple query builders that targets a specific service.
 */
export default class BatchQueryBuilderFactory {
  private _service: Service | TestService;
  private _odataVersion: DataServiceVersion;

  constructor(
    service: Service | TestService,
    odataVersion: DataServiceVersion,
  ) {
    this._service = service;
    this._odataVersion = odataVersion;
  }

  /**
   * Returns the service connection associated with the factory
   *
   * @public
   * @returns {Service} external service connection
   */
  public getService(): Service | TestService {
    return this._service;
  }

  /**
   * Returns the OData service version bound
   *
   * @public
   * @returns {ODataServiceVersion} Service version
   */
  public getDataServiceVersion(): DataServiceVersion {
    return this._odataVersion;
  }

  /**
   * Creates a new instance of a BatchQueryBuilder with request context
   *
   * @public
   * @param {Request} req
   * @param {number} [maxBatchRequests=50]
   * @returns {BatchQueryBuilder} Query builder instance
   */
  public createInstance(
    req: Request,
    maxBatchRequests: number = 50,
  ): BatchQueryBuilder {
    return new BatchQueryBuilder(
      req,
      this._service,
      maxBatchRequests,
      this._odataVersion,
    );
  }
}
