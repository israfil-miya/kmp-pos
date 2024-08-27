import Supplier from '@/models/Suppliers';
import dbConnect from '@/utility/dbConnect';
import getQuery from '@/utility/getApiQuery';
import { addRegexField } from '@/utility/regexQuery';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Query } from './types';
dbConnect();

async function handleCreateNewSupplier(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const data = await req.json();

  try {
    const supplierData = await Supplier.findOneAndUpdate(
      {
        name: data.name,
      },
      data,
      {
        upsert: true,
        new: true,
      },
    );

    if (supplierData) {
      return { data: 'Inserted new supplier successfully', status: 200 };
    } else {
      return { data: 'Unable to insert new supplier', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleGetAllSuppliers(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  try {
    const page: number = Number(headers().get('page')) || 1;
    const ITEMS_PER_PAGE: number = Number(headers().get('item_per_page')) || 30;
    const isFilter: boolean = headers().get('filtered') === 'true';
    const paginated: boolean = headers().get('paginated') === 'true';

    const filters = await req.json();

    const { searchText } = filters;

    const query: Query = {};

    addRegexField(query, 'name', searchText);
    addRegexField(query, 'company', searchText);
    addRegexField(query, 'email', searchText);
    addRegexField(query, 'phone', searchText);
    addRegexField(query, 'address', searchText);

    const searchQuery =
      Object.keys(query).length > 0
        ? {
            $or: Object.entries(query).map(([key, value]) => ({
              [key]: value,
            })),
          }
        : { $or: [{}] };

    let sortQuery: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    console.log(searchQuery);

    if (!query && isFilter == true) {
      return { data: 'No filter applied', status: 400 };
    } else {
      const skip = (page - 1) * ITEMS_PER_PAGE;

      const count: number = await Supplier.countDocuments(searchQuery);
      let suppliers: any;

      if (paginated) {
        suppliers = await Supplier.aggregate([
          { $match: searchQuery },
          { $sort: sortQuery },
          { $skip: skip },
          { $limit: ITEMS_PER_PAGE },
          // { $project: { in_stock: 0 } }, // remove the in_stock field from the final output
        ]);
      } else {
        suppliers = await Supplier.find(searchQuery).lean();
      }

      const pageCount: number = Math.ceil(count / ITEMS_PER_PAGE);

      if (!suppliers) {
        return { data: 'Unable to retrieve suppliers', status: 400 };
      } else {
        let suppliersData = {
          pagination: {
            count,
            pageCount,
          },
          items: suppliers,
        };

        return { data: suppliersData, status: 200 };
      }
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleDeleteSupplier(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const { supplierId } = await req.json();

  try {
    const data = await Supplier.findOneAndDelete({
      _id: supplierId,
    });

    if (data) {
      return { data: 'Deleted the supplier successfully', status: 200 };
    } else {
      return { data: 'Unable to delete the supplier', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleEditSupplier(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const { supplierId, editedData } = await req.json();

  try {
    const supplierData = await Supplier.findByIdAndUpdate(
      supplierId,
      editedData,
      {
        new: true,
      },
    );

    if (supplierData) {
      return { data: 'Edited the supplier data successfully', status: 200 };
    } else {
      return { data: 'Unable to edit the supplier data', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleGetAllSuppliersName(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  try {
    const suppliers = await Supplier.find({}, 'name').lean();

    if (suppliers) {
      return { data: suppliers, status: 200 };
    } else {
      return { data: 'Unable to retrieve suppliers', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

export async function GET(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    case 'get-all-suppliers-name':
      res = await handleGetAllSuppliersName(req);
      return NextResponse.json(res.data, { status: res.status });
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}

export async function POST(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    case 'get-all-suppliers':
      res = await handleGetAllSuppliers(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'create-new-supplier':
      res = await handleCreateNewSupplier(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'delete-supplier':
      res = await handleDeleteSupplier(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'edit-supplier':
      res = await handleEditSupplier(req);
      return NextResponse.json(res.data, { status: res.status });
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}
