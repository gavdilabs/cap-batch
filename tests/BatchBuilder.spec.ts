import { Request, Service } from "@sap/cds";
import { BatchContentType, BatchMethod, BatchQueryBuilder } from "../src";

const TEST_BATCH_RESPONSE = `
--batch_id-1704699294923-61\r\n
content-type: application/http\r\n
content-transfer-encoding: binary\r\n
\r\n
HTTP/1.1 200 OK\r\n
odata-version: 4.0\r\n
content-type: application/json;odata.metadata=minimal;IEEE754Compatible=true\r\n
\r\n
{"@odata.context":"$metadata#CRX.ActiveUser","username":"test","title":"Managing Consultant","firstname":"Test","lastname":"Tester","country":"DK","photoUrl":null,"photo":null,"photoType":null,"isAdmin":true,"isReadOnly":false,"apps":["Leads","Reporting","Admin","Sales"]}\r\n
--batch_id-1704699294923-61\r\n
content-type: application/http\r\n
content-transfer-encoding: binary\r\n
\r\n
HTTP/1.1 200 OK\r\n
odata-version: 4.0\r\n
content-type: application/json;odata.metadata=minimal;IEEE754Compatible=true\r\n
\r\n
{"@odata.context":"$metadata#CRX.ActiveUser","username":"test","title":"Managing Consultant","firstname":"Test","lastname":"Tester","country":"DK","photoUrl":null,"photo":null,"photoType":null,"isAdmin":true,"isReadOnly":false,"apps":["Leads","Reporting","Admin","Sales"]}\r\n
--batch_id-1704699294923-61\r\n
content-type: application/http\r\n
content-transfer-encoding: binary\r\n

HTTP/1.1 200 OK\r\n
odata-version: 4.0\r\n
content-type: application/json;odata.metadata=minimal;IEEE754Compatible=true\r\n
\r\n
{"@odata.context":"$metadata#Leads(ID,IsActiveEntity,createdAt,customer_ID,description,expectedSale_name,favorite,modifiedAt,numOfProducts,owner_userName,probability,state_name,title,totalLicenseSum,totalValue,_favorites(),_products(),customer(ID,IsActiveEntity,logo,logoUrl,name))","value":[{"ID":"84658fc8-fdce-4afd-bacf-90f7074812c1","createdAt":"2023-08-04T06:18:48.263Z","customer_ID":"74a1c50c-fad8-423c-a004-09fc68ad577d","description":" Expected Q1 / 2024","expectedSale_name":"TQ","favorite":null,"modifiedAt":"2024-01-02T06:06:28.466Z","numOfProducts":1,"owner_userName":"test2","probability":70,"state_name":"N","title":"Document Management (TEST2)","totalLicenseSum":"182070.00000000003","totalValue":"236670","customer":{"ID":"74a1c50c-fad8-423c-a004-09fc68ad577d","logoUrl":"","name":"NotReal","logo@odata.mediaContentType":null,"IsActiveEntity":true},"_products":[{"ID":"91e02bff-5868-4994-bc74-7647fadf596e","createdAt":"2023-08-04T06:22:57.151Z","createdBy":"test2@gavdilabs.com","modifiedAt":"2023-08-04T06:22:57.151Z","modifiedBy":"test2@gavdilabs.com","subScriptionLength":3,"numberCounts":3400,"discount":25,"discountReason":"","isReference":false,"lead_ID":"84658fc8-fdce-4afd-bacf-90f7074812c1","product_ID":"fae66971-3ed5-4cc8-aa3e-f8407acf8435","bracketPrice":null,"IsActiveEntity":true}],"_favorites":[{"ID":"f8aa2632-5214-464b-842c-09a5ccba6cef","createdAt":"2023-08-29T06:42:21.879Z","createdBy":"test2@gavdilabs.com","modifiedAt":"2023-08-29T06:42:21.879Z","modifiedBy":"test2@gavdilabs.com","userName":"test2","lead":"84658fc8-fdce-4afd-bacf-90f7074812c1","contact":null,"customer":null}],"IsActiveEntity":true},{"ID":"c7a274ce-7aa1-4676-9b40-052f6e301560","createdAt":"2023-07-31T06:19:44.035Z","customer_ID":"832a61cd-2ac2-45b8-a75d-0bc4ad925ed2","description":"Easy Document Man.","expectedSale_name":"TQ","favorite":null,"modifiedAt":"2024-01-02T06:19:13.529Z","numOfProducts":1,"owner_userName":"test2","probability":90,"state_name":"N","title":"Easy Document Management (TEST2)","totalLicenseSum":"107100","totalValue":"142100","customer":{"ID":"832a61cd-2ac2-45b8-a75d-0bc4ad925ed2","logoUrl":"","name":"SomeOtherCompany","logo@odata.mediaContentType":null,"IsActiveEntity":true},"_products":[{"ID":"1920b6bd-81cc-4942-b83d-292b023cff1d","createdAt":"2023-07-31T06:20:24.625Z","createdBy":"test2@gavdilabs.com","modifiedAt":"2023-07-31T06:20:24.625Z","modifiedBy":"test2@gavdilabs.com","subScriptionLength":3,"numberCounts":1500,"discount":0,"discountReason":"","isReference":false,"lead_ID":"c7a274ce-7aa1-4676-9b40-052f6e301560","product_ID":"fae66971-3ed5-4cc8-aa3e-f8407acf8435","bracketPrice":null,"IsActiveEntity":true}],"_favorites":[{"ID":"6ab6ac42-6a07-475e-9620-9f5d8eace846","createdAt":"2023-08-01T08:41:40.549Z","createdBy":"test2@gavdilabs.com","modifiedAt":"2023-08-01T08:41:40.549Z","modifiedBy":"test2@gavdilabs.com","userName":"test2","lead":"c7a274ce-7aa1-4676-9b40-052f6e301560","contact":null,"customer":null},{"ID":"7e85684f-53ea-462a-9251-a21b3e5488a6","createdAt":"2023-08-29T06:42:19.905Z","createdBy":"test2@gavdilabs.com","modifiedAt":"2023-08-29T06:42:19.905Z","modifiedBy":"test2@gavdilabs.com","userName":"test2","lead":"c7a274ce-7aa1-4676-9b40-052f6e301560","contact":null,"customer":null}],"IsActiveEntity":true},{"ID":"d09b8650-b0ae-4b95-b30d-7f4bbaf9bac9","createdAt":"2023-07-03T07:45:19.922Z","customer_ID":"71539e4e-949f-44c1-ba56-5ba0a5106dec","description":"Transition of COF, Auto-Hire, Workflow and FastHire to Cloud Foundry","expectedSale_name":"NQ","favorite":null,"modifiedAt":"2024-01-02T06:16:30.934Z","numOfProducts":0,"owner_userName":"test","probability":90,"state_name":"N","title":"Transition of Custom HR Apps to Cloud Foundry","totalLicenseSum":"0","totalValue":"130821.56","customer":{"ID":"71539e4e-949f-44c1-ba56-5ba0a5106dec","logoUrl":"","name":"SomeThirdCompany","logo@odata.mediaContentType":"image/png","IsActiveEntity":true},"_products":[],"_favorites":[{"ID":"3fa91b1e-75cf-434b-87cb-3eefa8b9409f","createdAt":"2023-07-27T19:04:52.404Z","createdBy":"test@gavdi.com","modifiedAt":"2023-07-27T19:04:52.404Z","modifiedBy":"test@gavdi.com","userName":"test","lead":"d09b8650-b0ae-4b95-b30d-7f4bbaf9bac9","contact":null,"customer":null}],"IsActiveEntity":true},{"ID":"818861a9-e81f-4280-be12-345168386705","createdAt":"2023-07-03T07:32:20.388Z","customer_ID":"9bf2735f-158d-4873-9448-a2d26a087c69","description":"Participation in the SAP Technology Education Program 23/24","expectedSale_name":"NQ","favorite":null,"modifiedAt":"2024-01-02T06:05:25.374Z","numOfProducts":0,"owner_userName":"test","probability":65,"state_name":"N","title":"STEP 24/25","totalLicenseSum":"0","totalValue":"46961.59","customer":{"ID":"9bf2735f-158d-4873-9448-a2d26a087c69","logoUrl":"","name":"SomeFourthCompany","logo@odata.mediaContentType":"image/png","IsActiveEntity":true},"_products":[],"_favorites":[],"IsActiveEntity":true},{"ID":"b7febfd3-4fc5-4eaa-9fa8-69b595836f47","createdAt":"2023-07-03T08:01:42.768Z","customer_ID":"ec372ccb-926c-4406-b43a-310f732bef4a","description":"Participation in the STEP 23/24 Program","expectedSale_name":"TY","favorite":null,"modifiedAt":"2024-01-02T05:55:36.124Z","numOfProducts":0,"owner_userName":"test","probability":60,"state_name":"N","title":"STEP 23/24","totalLicenseSum":"0","totalValue":"46961.59","customer":{"ID":"ec372ccb-926c-4406-b43a-310f732bef4a","logoUrl":"","name":"SomeOtherCompany","logo@odata.mediaContentType":"image/png","IsActiveEntity":true},"_products":[],"_favorites":[],"IsActiveEntity":true},{"ID":"37460167-af71-4363-afb7-a0dc94b71cb0","createdAt":"2023-07-14T11:45:15.519Z","customer_ID":"6582df54-da83-464e-8485-2c041c4d7f02","description":"Upgrade to Enhancement Package 8 as a Basis for Fiori","expectedSale_name":"NW","favorite":null,"modifiedAt":"2024-01-02T06:14:58.440Z","numOfProducts":0,"owner_userName":"test","probability":80,"state_name":"N","title":"EhP8 Upgrade","totalLicenseSum":"0","totalValue":"40252.79","customer":{"ID":"6582df54-da83-464e-8485-2c041c4d7f02","logoUrl":"","name":"SomethingCompletelyDifferent","logo@odata.mediaContentType":"image/png","IsActiveEntity":true},"_products":[],"_favorites":[],"IsActiveEntity":true},{"ID":"7aefe0b0-e3e2-4a98-a399-c2117bb369b9","createdAt":"2023-07-03T07:16:31.862Z","customer_ID":"ec372ccb-926c-4406-b43a-310f732bef4a","description":"The Technology Upgrade Program for the Internal Developers in preparation for the SAP S/4 HANA project","expectedSale_name":"NQ","favorite":null,"modifiedAt":"2024-01-02T05:55:43.021Z","numOfProducts":0,"owner_userName":"test","probability":70,"state_name":"N","title":"Technology Upgrade Program","totalLicenseSum":"0","totalValue":"36898.39","customer":{"ID":"ec372ccb-926c-4406-b43a-310f732bef4a","logoUrl":"","name":"SomeOtherCompany","logo@odata.mediaContentType":"image/png","IsActiveEntity":true},"_products":[],"_favorites":[],"IsActiveEntity":true},{"ID":"83ca7b40-46ea-45aa-8596-e467a6d3bd2f","createdAt":"2023-08-04T06:40:30.395Z","customer_ID":"4c9ed158-2e3b-4a6d-bef8-c4e3979f8b8c","description":"the license opt.","expectedSale_name":"NW","favorite":null,"modifiedAt":"2024-01-02T06:10:29.887Z","numOfProducts":1,"owner_userName":"test2","probability":55,"state_name":"N","title":"Easy Organizer - license (TEST2)","totalLicenseSum":"10125.000000000002","totalValue":"10126","customer":{"ID":"4c9ed158-2e3b-4a6d-bef8-c4e3979f8b8c","logoUrl":"","name":"ACompany","logo@odata.mediaContentType":"image/png","IsActiveEntity":true},"_products":[{"ID":"6a9c279c-a49a-4b39-afc4-8fba62c2c2e0","createdAt":"2023-08-04T06:41:05.305Z","createdBy":"test2@gavdilabs.com","modifiedAt":"2023-08-04T06:41:05.305Z","modifiedBy":"test2@gavdilabs.com","subScriptionLength":3,"numberCounts":75000,"discount":70,"discountReason":"","isReference":false,"lead_ID":"83ca7b40-46ea-45aa-8596-e467a6d3bd2f","product_ID":"72b2c2d9-82e7-49b8-824b-412902ab1de9","bracketPrice":null,"IsActiveEntity":true}],"_favorites":[{"ID":"d4c7ab76-1f1f-41d7-af89-4c8c07f6504c","createdAt":"2023-08-29T06:42:24.929Z","createdBy":"test2@gavdilabs.com","modifiedAt":"2023-08-29T06:42:24.929Z","modifiedBy":"test2@gavdilabs.com","userName":"test2","lead":"83ca7b40-46ea-45aa-8596-e467a6d3bd2f","contact":null,"customer":null}],"IsActiveEntity":true},{"ID":"486bd116-7684-4cdb-844c-88dd65937ef7","createdAt":"2023-12-12T10:19:51.351Z","customer_ID":"99e5597a-fde6-4447-9ae8-7a0fbdfd1880","description":"Assist in Planning the future direction for the system landscae and its components","expectedSale_name":"NW","favorite":null,"modifiedAt":"2024-01-02T06:17:59.417Z","numOfProducts":0,"owner_userName":"test","probability":85,"state_name":"N","title":"Landscape Planning Workshops","totalLicenseSum":"0","totalValue":"3354.4","customer":{"ID":"99e5597a-fde6-4447-9ae8-7a0fbdfd1880","logoUrl":"","name":"SomeCompany","logo@odata.mediaContentType":"image/png","IsActiveEntity":true},"_products":[],"_favorites":[{"ID":"75386777-dd8b-47e2-aa96-eb466e5b6bab","createdAt":"2024-01-02T08:36:37.218Z","createdBy":"test@gavdi.com","modifiedAt":"2024-01-02T08:36:37.218Z","modifiedBy":"test@gavdi.com","userName":"test","lead":"486bd116-7684-4cdb-844c-88dd65937ef7","contact":null,"customer":null}],"IsActiveEntity":true}]}\r\n
--batch_id-1704699294923-61\r\n
content-type: application/http\r\n
content-transfer-encoding: binary\r\n
--batch_id-1704699294923-61--\r\n
`;

test("Should be constructible with defaults", () => {
  const result = new BatchQueryBuilder({} as Request, {} as Service);

  expect(result).toBeDefined();
});

test("Should allow user to add request", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service);
  const chain = builder.addRequest({
    path: "/test",
    method: BatchMethod.POST,
    contentType: BatchContentType.JSON,
  });

  expect(builder).toBeDefined();
  expect(chain).toBeDefined();

  const requests = chain.getBatchRequests();

  expect(requests).toBeDefined();
  expect(requests.length).toEqual(1);
});

test("Should be possible to build the batch query body and receive its id", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service);
  const chain = builder.addRequest({
    path: "/test",
    method: BatchMethod.POST,
    contentType: BatchContentType.JSON,
  });

  expect(builder).toBeDefined();
  expect(chain).toBeDefined();

  const batchId = chain.buildQuery(0);
  expect(batchId).toBeDefined();
  expect(batchId?.length).toBeGreaterThan(0);
});

test("Should have different batch ID's for each of the generated queries", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service);
  const chain = builder.addRequest({
    path: "/test",
    method: BatchMethod.POST,
    contentType: BatchContentType.JSON,
  });

  expect(builder).toBeDefined();
  expect(chain).toBeDefined();

  const batchId = chain.buildQuery(0);
  expect(batchId).toBeDefined();
  expect(batchId?.length).toBeGreaterThan(0);

  const batchId2 = chain.buildQuery(0);
  expect(batchId2).toBeDefined();
  expect(batchId2?.length).toBeGreaterThan(0);

  expect(batchId !== batchId2).toEqual(true);
});

test("Should be possible to print out batch request body as a string", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service);
  const chain = builder.addRequest({
    path: "/test",
    method: BatchMethod.POST,
    contentType: BatchContentType.JSON,
  });

  expect(builder).toBeDefined();
  expect(chain).toBeDefined();

  const batchId = chain.buildQuery(0);
  expect(batchId).toBeDefined();
  expect(batchId?.length).toBeGreaterThan(0);

  const stringified = chain.toString();
  expect(stringified).toBeDefined();
  expect(stringified.length).toBeGreaterThan(0);
  expect(stringified !== batchId).toEqual(true);
});

test("Should parse the response received from v4 batch query", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service);
  expect(builder).toBeDefined();

  builder
    .addRequest({
      path: "/ActiveUser",
      method: BatchMethod.GET,
      contentType: BatchContentType.JSON,
    })
    .addRequest({
      path: "/ActiveUser",
      method: BatchMethod.GET,
      contentType: BatchContentType.JSON,
    })
    .addRequest({
      path: "/Leads",
      method: BatchMethod.POST,
      contentType: BatchContentType.JSON,
    });

  const result = builder.parseBatchResponse(TEST_BATCH_RESPONSE).result();

  expect(result).toBeDefined();
  //expect(result.length).toEqual(3);
});

test("Should be possible to fetch the max amount of requests per batch", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service);
  expect(builder).toBeDefined();

  const max = builder.getMaxBatchLimit();
  expect(max).toBeDefined();
  expect(max).toEqual(50);
});

test("Should be possible to fetch the max amount of requests per batch even if not default", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service, 100);
  expect(builder).toBeDefined();

  const max = builder.getMaxBatchLimit();
  expect(max).toBeDefined();
  expect(max).toEqual(100);
});

test("Response Content Issue", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service, 100);
  expect(builder).toBeDefined();

  const max = builder.getMaxBatchLimit();
  expect(max).toBeDefined();
  expect(max).toEqual(100);
});

test("GET Requests should automatically have format=json/xml applied etc", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service, 100);
  expect(builder).toBeDefined();

  builder.addRequest({
    path: "/ActiveUser",
    method: BatchMethod.GET,
    contentType: BatchContentType.JSON,
  });

  builder.addRequest({
    path: "/ActiveUser",
    method: BatchMethod.POST,
    contentType: BatchContentType.JSON,
    data: {},
  });

  expect(builder.getBatchRequests().length).toBe(2);
  expect(
    builder.getBatchRequests()[0].path.indexOf("format=json"),
  ).toBeGreaterThan(-1); //GET Requests should have format applied
  expect(builder.getBatchRequests()[1].path.indexOf("format=json")).toBe(-1); //NON GET Requests should not have format applied
});

test("Requests should automatically have / added as first character if left out", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service, 100);
  expect(builder).toBeDefined();

  builder.addRequest({
    path: "ActiveUser",
    method: BatchMethod.GET,
    contentType: BatchContentType.JSON,
  });

  expect(builder.getBatchRequests().length).toBe(1);
  expect(builder.getBatchRequests()[0].path.indexOf("/")).toBe(0);
});

test("Calling clear should allow for filling the batch queue again w new Repuests", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service, 100);
  expect(builder).toBeDefined();

  builder.addRequest({
    path: "ActiveUser",
    method: BatchMethod.GET,
    contentType: BatchContentType.JSON,
  });
  expect(builder.getBatchRequests().length).toBe(1);
  builder.clear();
  expect(builder.getBatchRequests().length).toBe(0);
});

test("Changeset support for non GET requests", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service, 100);
  expect(builder).toBeDefined();

  builder.addRequest({
    path: "Position?$top=1",
    method: BatchMethod.GET,
    contentType: BatchContentType.JSON,
    data: { message: "Order 0" },
  });

  builder.addRequest({
    path: "EmpJob",
    method: BatchMethod.POST,
    contentType: BatchContentType.JSON,
    data: { message: "Order 1" },
  });

  builder.addRequest({
    path: "Position?$top=1",
    method: BatchMethod.GET,
    contentType: BatchContentType.JSON,
    data: { message: "Order 0" },
  });

  builder.addRequest({
    path: "EmpJob",
    method: BatchMethod.POST,
    contentType: BatchContentType.JSON,
    data: { message: "Order 1" },
  });

  const requests = builder.getBatchRequests();
  expect(requests.length).toBe(4);

  //The 2 GET Methods should have been sorted to the top after the buildQuery call
  expect(requests[0].method).toBe(BatchMethod.GET);
  expect(requests[1].method).toBe(BatchMethod.POST);
});

test("Recursive Paging Testing", () => {
  const builder = new BatchQueryBuilder({} as Request, {} as Service, 1);
  expect(builder).toBeDefined();

  builder.addRequest({
    path: "Position?$top=1",
    method: BatchMethod.GET,
    contentType: BatchContentType.JSON,
    data: { message: "Order 0" },
  });

  builder.addRequest({
    path: "EmpJob",
    method: BatchMethod.POST,
    contentType: BatchContentType.JSON,
    data: { message: "Order 1" },
  });

  //The 2 GET Methods should have been sorted to the top after the buildQuery call
  const requests = builder.getBatchRequests();
  expect(requests[0].method).toBe(BatchMethod.GET);
  expect(requests[1].method).toBe(BatchMethod.POST);
  expect(requests.length).toBe(2);

  //Build page 1 body and check EmpJob cannot be found in the generated string
  builder.buildQuery(0);
  let queryOne = builder.getBatchBody();
  expect(queryOne.indexOf("EmpJob")).toBe(-1);
});

