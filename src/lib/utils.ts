import { randomUUID } from "crypto";

/**
 * Parses the string line provided and adds content to the given response object.
 * In case that the string line is invalid, nothing is added.
 *
 * @public
 * @param {string} content
 * @param {BatchResponse<T>} response object
 * @returns void
 */

/**
 * Generates a UUID for batch bodies with correct formatting.
 * Format: 'batch_UUID'
 *
 * @public
 * @returns {string}
 */
export function generateBatchID(): string {
  return `batch_${randomUUID()}`;
}

/**
 * Generates a UUID for changeset bodies with correct formatting.
 * Format: 'changeset_UUID'
 *
 * @public
 * @returns {string}
 */
export function generateChangesetID(): string {
  return `changeset_${randomUUID()}`;
}

/**
 * Formats the data body for the batch request to the correct string format.
 * Throws in case of invalid data type or parsing issues.
 *
 * @public
 * @param {object} data
 * @returns {string}
 */
export function formatRequestDataForBatch(data: object): string {
  if (typeof data !== "object" && typeof data !== "string") {
    throw new Error("Invalid data added for batch request");
  }

  try {
    const stringified = JSON.stringify(data);
    return stringified;
  } catch (e) {
    throw new Error(`Failed to format the data in the request body: ${e}`);
  }
}
