export const YYYY_MM_DD_to_DD_MM_YY = (dateString: string | Date) => {
  if (!dateString) return '';

  // If it's a Date object, convert it to YYYY-MM-DD format
  if (dateString instanceof Date) {
    const year = dateString.getFullYear();
    const month = (dateString.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = dateString.getDate().toString().padStart(2, '0');
    dateString = `${year}-${month}-${day}`;
  }

  const [year, month, day] = dateString.split('-');

  if (year.length !== 4) return dateString;

  return `${day}-${month}-${year}`;
};

export const ISO_to_DD_MM_YY = (isoDate: string | Date) => {
  const date = isoDate instanceof Date ? isoDate : new Date(isoDate);

  // Handle invalid dates
  if (isNaN(date.getTime())) return '';

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear().toString();

  return `${day}-${month}-${year}`;
};
