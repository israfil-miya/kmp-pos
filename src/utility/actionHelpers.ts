export const mapFormDataToFields = (formData: {
  [k: string]: FormDataEntryValue;
}): Record<string, string> => {
  const fields: Record<string, string> = {};
  for (const key of Object.keys(formData)) {
    fields[key] = formData[key].toString();
  }
  return fields;
};

export const extractDbErrorMessages = (error: any): string[] => {
  return Object.values(error.errors).map((err: any) => err.message);
};

export function flattenObject(obj: any): Record<string, string | number> {
  const result: Record<string, string | number> = {};

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Flatten nested objects (could be enhanced for deeper nesting)
      const flatObject = flattenObject(obj[key]);
      for (const subKey in flatObject) {
        result[`${key}.${subKey}`] = flatObject[subKey];
      }
    } else if (typeof obj[key] === 'string' || typeof obj[key] === 'number') {
      result[key] = obj[key];
    } else {
      result[key] = String(obj[key]); // Convert other types to string
    }
  }

  return result;
}
