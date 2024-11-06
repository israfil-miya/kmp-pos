import moment from 'moment-timezone';

export const getTodayDate = () => moment().format('YYYY-MM-DD');

export const getTodayDate_DD_MM_YYYY = () => {
  return moment().format('DD-MM-YYYY');
};

export const formatDate = (dateString: string | Date) => {
  if (!dateString) return '';

  return moment(dateString).format('Do MMMM, YYYY');
};

export const getTimeFromISODate = (isoDate: string): string => {
  if (!isoDate) return '';
  if (moment(isoDate, moment.ISO_8601, true).isValid()) {
    return moment(isoDate).format('hh:mm A');
  } else {
    return '';
  }
};
