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
