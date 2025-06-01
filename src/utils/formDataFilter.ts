/**
 * Utility functions for filtering form data before sending to backend
 */

/**
 * Checks if a value is considered "empty" and should be filtered out
 * @param value - The value to check
 * @returns true if the value should be filtered out
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.trim() === "")
  )
    return true;

  return false;
};

/**
 * Filters out null, undefined, empty strings, and empty arrays from an object
 * @param data - The object to filter
 * @returns A new object with only non-empty values
 */
export const filterEmptyValues = <T extends Record<string, any>>(
  data: T,
): Partial<T> => {
  const filtered: Partial<T> = {};

  for (const [key, value] of Object.entries(data)) {
    if (!isEmpty(value)) {
      // For arrays, filter out empty string elements
      if (
        Array.isArray(value) &&
        value.some((item) => typeof item === "string")
      ) {
        const filteredArray = value.filter(
          (item) => typeof item !== "string" || item.trim() !== "",
        );
        if (filteredArray.length > 0) {
          filtered[key as keyof T] = filteredArray as T[keyof T];
        }
      } else {
        filtered[key as keyof T] = value;
      }
    }
  }

  return filtered;
};

/**
 * Filters certificate array to remove empty certificates
 * @param certificates - Array of certificates
 * @returns Filtered array with only valid certificates
 */
export const filterValidCertificates = (
  certificates: Array<{
    name: string;
    file: File | string | null;
    issueDate: string;
    description: string;
  }>,
) => {
  return certificates.filter(
    (cert) =>
      !isEmpty(cert.name) &&
      !isEmpty(cert.issueDate) &&
      !isEmpty(cert.description) &&
      cert.file !== null,
  );
};

/**
 * Logs the filtered data for debugging purposes
 * @param original - Original data object
 * @param filtered - Filtered data object
 * @param context - Context string for logging
 */
export const logFilteredData = (
  original: any,
  filtered: any,
  context: string,
) => {
  console.log(`[${context}] Original data:`, original);
  console.log(`[${context}] Filtered data:`, filtered);

  const originalKeys = Object.keys(original);
  const filteredKeys = Object.keys(filtered);
  const removedKeys = originalKeys.filter((key) => !filteredKeys.includes(key));

  if (removedKeys.length > 0) {
    console.log(`[${context}] Removed empty fields:`, removedKeys);
  }
};
