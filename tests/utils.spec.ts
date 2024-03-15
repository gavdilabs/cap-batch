import { generateBatchID } from "../src";
import {
  formatRequestDataForBatch,
  generateChangesetID,
} from "../src/lib/utils";

test("generateBatchID - Should generate a batch id", () => {
  const result = generateBatchID();

  expect(result).toBeDefined();
  expect(result.length).toBeGreaterThan(0);
});

test("generateBatchID - Should include 'batch_' at the beginning", () => {
  const result = generateBatchID();

  expect(result).toBeDefined();
  expect(result.length).toBeGreaterThan(0);

  const sub = result.substring(0, 6);
  expect(sub).toBeDefined();
  expect(sub).toEqual("batch_");
});

test("generateBatchID - Should be able to generate 100 unique ids", () => {
  const idSet = new Set<string>();

  for (let i = 0; i < 100; i++) {
    const id = generateBatchID();

    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThan(0);

    idSet.add(id);
  }

  expect(idSet.size).toEqual(100);
});

test("generateChangesetID - Should generate a changeset id", () => {
  const result = generateChangesetID();

  expect(result).toBeDefined();
  expect(result.length).toBeGreaterThan(0);
});

test("generateChangesetID - Should include 'changeset_' at the beginning", () => {
  const result = generateChangesetID();

  expect(result).toBeDefined();
  expect(result.length).toBeGreaterThan(0);

  const sub = result.substring(0, 10);
  expect(sub).toBeDefined();
  expect(sub).toEqual("changeset_");
});

test("generateChangesetID - Should be able to generate 100 unique ids", () => {
  const idSet = new Set<string>();

  for (let i = 0; i < 100; i++) {
    const id = generateChangesetID();

    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThan(0);

    idSet.add(id);
  }

  expect(idSet.size).toEqual(100);
});

test("formatRequestDataForBatch - Should be able to format JSON object", () => {
  const expectation = '{"name":"something","context":"test","version":1}';
  const data = {
    name: "something",
    context: "test",
    version: 1,
  };

  const result = formatRequestDataForBatch(data);
  expect(result).toBeDefined();
  expect(result).toEqual(expectation);
});

test("formatRequestDataForBatch - Should throw error on invalid data type", () => {
  const data = 12312412312;
  expect(() => formatRequestDataForBatch(data as any)).toThrow();
});

test("formatRequestDataForBatch - Should throw error on incomplete data", () => {
  const data = undefined;
  expect(() => formatRequestDataForBatch(data as any)).toThrowError();
});
