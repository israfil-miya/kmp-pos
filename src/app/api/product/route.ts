import { NextResponse } from 'next/server';
import dbConnect from '@/utility/dbconnect';
dbConnect();
import Product from '@/models/Products';
import getQuery from '@/utility/getapiquery';
import { headers } from 'next/headers';
import { auth } from '@/auth';

import {
  createRegexQuery,
  addIfDefined,
  addRegexField,
  Query,
  RegexQuery,
} from '@/utility/productsfilterhelpers';

async function handleCreateNewProduct(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const data = await req.json();

  try {
    const productData = await Product.findOneAndUpdate(
      {
        name: data.name,
      },
      data,
      {
        upsert: true,
        new: true,
      },
    );

    if (productData) {
      return { data: 'Inserted new product successfully', status: 200 };
    } else {
      return { data: 'Unable to insert new product', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleGetAllProducts(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  try {
    const categoryData = await Category.find();

    if (categoryData) {
      return { data: categoryData, status: 200 };
    } else {
      return { data: 'No category found', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}


async function handleGetAllReports(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  try {
    const page: number = Number(headers().get('page')) || 1;
    const ITEMS_PER_PAGE: number = Number(headers().get('item_per_page')) || 30;
    const isFilter: boolean = headers().get('filtered') === 'true';
    const paginated: boolean = headers().get('paginated') === 'true';

    const filters = await req.json();

    const {
      country,
      companyName,
      category,
      marketerName,
      fromDate,
      toDate,
      test,
      prospect,
      onlyLead,
      followupDone,
      regularClient,
      staleClient,
      prospectStatus,
      generalSearchString,
      show,
    } = filters;

    const query: Query = {};

    addRegexField(query, 'country', country);
    addRegexField(query, 'company_name', companyName);
    addRegexField(query, 'category', category);
    addRegexField(query, 'marketer_name', marketerName, true);
    addRegexField(query, 'prospect_status', prospectStatus, true);


    if (fromDate || toDate) {
      query.calling_date_history = query.calling_date_history || {};
      query.calling_date_history.$elemMatch = {
        ...(fromDate && { $gte: fromDate }),
        ...(toDate && { $lte: toDate }),
      };
    }

    if (!fromDate && !toDate && !staleClient) {
      delete query.calling_date_history;
    }


    const searchQuery: Query = { ...query };

    let sortQuery: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    // Sorting by followup date (ascending) if followup is pending and not a regular client (/pending-followups)
    if (
      followupDone === false &&
      regularClient === false &&
      searchQuery.is_lead === false
    ) {
      sortQuery = {
        hasFollowupDate: 1, // Sort by presence of followup_date first (0 for missing, 1 for present)
        followup_date: 1, // Then sort by followup_date ascending
        createdAt: -1, // Finally, sort by createdAt descending
      };
    }

    if (!query && isFilter == true && !generalSearchString) {
      return { data: 'No filter applied', status: 400 };
    } else {
      const skip = (page - 1) * ITEMS_PER_PAGE;

      if (generalSearchString) {
        searchQuery['$or'] = [
          { country: { $regex: generalSearchString, $options: 'i' } },
          { company_name: { $regex: generalSearchString, $options: 'i' } },
          { category: { $regex: generalSearchString, $options: 'i' } },
          { marketer_name: { $regex: generalSearchString, $options: 'i' } },
          { designation: { $regex: generalSearchString, $options: 'i' } },
          { website: { $regex: generalSearchString, $options: 'i' } },
          { contact_person: { $regex: generalSearchString, $options: 'i' } },
          { contact_number: { $regex: generalSearchString, $options: 'i' } },
          { calling_status: { $regex: generalSearchString, $options: 'i' } },
          { email_address: { $regex: generalSearchString, $options: 'i' } },
          { linkedin: { $regex: generalSearchString, $options: 'i' } },
        ];
      }

      const count: number = await Report.countDocuments(searchQuery);
      let reports: any;

      if (paginated) {
        reports = await Report.aggregate([
          { $match: searchQuery },
          {
            $addFields: {
              hasFollowupDate: {
                $cond: {
                  if: { $eq: ['$followup_date', ''] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          { $sort: sortQuery },
          { $skip: skip },
          { $limit: ITEMS_PER_PAGE },
          {
            $project: {
              hasFollowupDate: 0, // Remove the added field from the final output
            },
          },
        ]);
      } else {
        reports = await Report.find(searchQuery).lean();
      }

      console.log('SEARCH Query:', searchQuery);

      const pageCount: number = Math.ceil(count / ITEMS_PER_PAGE);

      if (!reports) {
        return { data: 'Unable to retrieve reports', status: 400 };
      } else {
        let reportsData = {
          pagination: {
            count,
            pageCount,
          },
          items: reports,
        };

        return { data: reportsData, status: 200 };
      }
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}



async function handleDeleteCategory(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const { categoryId } = await req.json();

  try {
    const categoryData = await Category.findOneAndDelete({
      _id: categoryId,
    });

    if (categoryData) {
      return { data: 'Deleted the category successfully', status: 200 };
    } else {
      return { data: 'Unable to delete the category', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleEditCategory(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const { categoryId, editedData } = await req.json();

  try {
    const categoryData = await Category.findByIdAndUpdate(
      categoryId,
      editedData,
      {
        new: true,
      },
    );

    if (categoryData) {
      return { data: 'Edited the category successfully', status: 200 };
    } else {
      return { data: 'Unable to edit the category', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

export async function GET(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    case 'get-all-categories':
      res = await handleGetAllCategories(req);
      return NextResponse.json(res.data, { status: res.status });
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}

export async function POST(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    case 'create-new-category':
      res = await handleCreateNewCategory(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'delete-category':
      res = await handleDeleteCategory(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'edit-category':
      res = await handleEditCategory(req);
      return NextResponse.json(res.data, { status: res.status });
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}
