import {
  Query as creditor_Query,
  RegexFields as creditor_RegexFields,
  RegexQuery as creditor_RegexQuery,
} from '@/app/(pages)/creditors/schema';
import {
  Query as invoice_Query,
  RegexFields as invoice_RegexFields,
  RegexQuery as invoice_RegexQuery,
} from '@/app/(pages)/invoices/schema';
import {
  Query as pos_Query,
  RegexFields as pos_RegexFields,
  RegexQuery as pos_RegexQuery,
} from '@/app/(pages)/pos/schema';
import {
  Query as product_Query,
  RegexFields as product_RegexFields,
  RegexQuery as product_RegexQuery,
} from '@/app/(pages)/products/schema';
import {
  Query as supplier_Query,
  RegexFields as supplier_RegexFields,
  RegexQuery as supplier_RegexQuery,
} from '@/app/(pages)/suppliers/schema';

type RegexQuery =
  | supplier_RegexQuery
  | product_RegexQuery
  | pos_RegexQuery
  | invoice_RegexQuery
  | creditor_RegexQuery;
type Query =
  | supplier_Query
  | product_Query
  | pos_Query
  | invoice_Query
  | creditor_Query;
type RegexFields =
  | supplier_RegexFields
  | product_RegexFields
  | pos_RegexFields
  | invoice_RegexFields
  | creditor_RegexFields;

// Helper function to create a regex query
export const createRegexQuery = (
  value?: string,
  exactMatch: boolean = false,
): RegexQuery | undefined =>
  value
    ? { $regex: exactMatch ? `^${value}$` : value, $options: 'i' }
    : undefined;

// Helper function to add regex fields to the query
export const addRegexField = (
  query: Query,
  key: RegexFields,
  value?: string,
  exactMatch: boolean = false,
) => {
  const regexQuery = createRegexQuery(value, exactMatch);
  if (regexQuery) {
    (query as any)[key] = regexQuery;
  }
};
