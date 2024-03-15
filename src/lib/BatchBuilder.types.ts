/**
 * Allowed HTTP methods for batch builder
 */
export enum BatchMethod {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
  PATCH = "PATCH",
  UPSERT = "UPSERT",
  MERGE = "MERGE",
}

/**
 * Allowed content types for batch builder
 */
export enum BatchContentType {
  JSON = "application/json",
  XML = "application/xml",
  TEXT = "plain/text",
}

/**
 * Allowed data service versions for batch builder
 */
export enum DataServiceVersion {
  ODataV2 = "2.0",
  ODataV4 = "4.0",
}

/**
 * Batch request object.
 * For constructing individual queries in the batch to be sent.
 */
export interface BatchRequest {
  path: string;
  method: BatchMethod;
  contentType: BatchContentType;
  data?: object;
}

/**
 * Batch request object for inner contained requests within the batch queries.
 * Extends BatchRequest
 */
export interface BatchInnerRequest extends BatchRequest {
  transferEncoding: string;
  httpVersion: string;
  outputOrder: number;
  firedOrder?: number;
}

/**
 * Object definition for parsed batch query responses.
 */
export interface BatchResponse {
  request?: BatchRequest;
  contentType?: string;
  statusCode?: number;
  contentLength?: number;
  data?: object | string;
  error?: unknown;
  order?: number;
}

/**
 * Mainly used if you want to hit a URL directly - w/o CDS Service
 */
export interface TestService {
  baseUrl: string;
  username?: string;
  password?: string;
}

/**
 * Utility interface to help type-safing SF Upsert Payloads
 */
export interface SFUpsertHeader {
  __metadata: {
    type: string;
    uri: string;
  };
}

/**
 * Strategy Interface: Allow for different implementations of a BatchResponseParser
 */
export interface BatchResponseParser {
  parseResponse: (response: string, httpVersion?: string) => BatchResponse[];
  hasErrors: () => boolean;
}
