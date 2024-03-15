import { Request, Service } from "@sap/cds";
import { BatchQueryBuilderFactory, DataServiceVersion } from "../src";

test("Should be constructible", () => {
  const factory = new BatchQueryBuilderFactory(
    {} as Service,
    DataServiceVersion.ODataV4,
  );
  expect(factory).toBeDefined();
});

test("Should contain createInstance method", () => {
  const factory = new BatchQueryBuilderFactory(
    {} as Service,
    DataServiceVersion.ODataV4,
  );
  expect(factory.createInstance).toBeDefined();
});

test("Should be able to create an instance", () => {
  const factory = new BatchQueryBuilderFactory(
    {} as Service,
    DataServiceVersion.ODataV4,
  );
  expect(factory).toBeDefined();

  const instance = factory.createInstance({} as Request);
  expect(instance).toBeDefined();
});

test("Should be able to fetch the service object", () => {
  const factory = new BatchQueryBuilderFactory(
    {} as Service,
    DataServiceVersion.ODataV4,
  );
  expect(factory).toBeDefined();

  const service = factory.getService();
  expect(service).toBeDefined();
});

test("Should be able to see the factory's OData version", () => {
  const factory = new BatchQueryBuilderFactory(
    {} as Service,
    DataServiceVersion.ODataV4,
  );
  expect(factory).toBeDefined();

  const version = factory.getDataServiceVersion();
  expect(version).toEqual(DataServiceVersion.ODataV4);
});

test("Should be possible to create an instance with default max per request", () => {
  const factory = new BatchQueryBuilderFactory(
    {} as Service,
    DataServiceVersion.ODataV4,
  );
  expect(factory).toBeDefined();

  const instance = factory.createInstance({} as Request);
  expect(instance).toBeDefined();
  expect(instance.getMaxBatchLimit()).toEqual(50);
});

test("Should be possible to create an instance with custom max per request", () => {
  const factory = new BatchQueryBuilderFactory(
    {} as Service,
    DataServiceVersion.ODataV4,
  );
  expect(factory).toBeDefined();

  const instance = factory.createInstance({} as Request, 100);
  expect(instance).toBeDefined();
  expect(instance.getMaxBatchLimit()).toEqual(100);
});
