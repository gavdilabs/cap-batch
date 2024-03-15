import {
  BatchQueryBuilder,
  formatRequestDataForBatch,
  generateBatchID,
  generateChangesetID,
} from "../src/index";

test("Should include the BatchQueryBuilder", () => {
  expect(BatchQueryBuilder).toBeDefined();
});

test("Should include utility method: generateBatchID", () => {
  expect(generateBatchID).toBeDefined();
});

test("Should include utility method: generateChangesetID", () => {
  expect(generateChangesetID).toBeDefined();
});

test("Should include utility method: formatRequestDataForBatch", () => {
  expect(formatRequestDataForBatch).toBeDefined();
});
