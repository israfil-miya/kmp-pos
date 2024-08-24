import Product from '@/models/Products';
import dbConnect from '@/utility/dbConnect';
import getQuery from '@/utility/getApiQuery';
import { addRegexField, Query } from '@/utility/productsFilterHelpers';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
dbConnect();

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
    const page: number = Number(headers().get('page')) || 1;
    const ITEMS_PER_PAGE: number = Number(headers().get('item_per_page')) || 30;
    const isFilter: boolean = headers().get('filtered') === 'true';
    const paginated: boolean = headers().get('paginated') === 'true';

    const filters = await req.json();

    const { searchText } = filters;

    const query: Query = {};

    addRegexField(query, 'name', searchText);
    addRegexField(query, 'batch', searchText, true);
    addRegexField(query, 'category', searchText);
    addRegexField(query, 'supplier', searchText);
    addRegexField(query, 'store', searchText);

    const searchQuery =
      Object.keys(query).length > 0
        ? {
            $or: Object.entries(query).map(([key, value]) => ({
              [key]: value,
            })),
          }
        : { $or: [{}] };

    let sortQuery: Record<string, 1 | -1> = {
      in_stock: -1,
      createdAt: -1,
    };

    console.log(searchQuery);

    if (!query && isFilter == true) {
      return { data: 'No filter applied', status: 400 };
    } else {
      const skip = (page - 1) * ITEMS_PER_PAGE;

      const count: number = await Product.countDocuments(searchQuery);
      let products: any;

      if (paginated) {
        products = await Product.aggregate([
          { $match: searchQuery },
          {
            $addFields: {
              in_stock: {
                $cond: { if: { $gt: ['$quantity', 0] }, then: 1, else: 0 },
              },
            },
          },
          { $sort: sortQuery },
          { $skip: skip },
          { $limit: ITEMS_PER_PAGE },
          // { $project: { in_stock: 0 } }, // remove the in_stock field from the final output
        ]);
      } else {
        products = await Product.find(searchQuery).lean();
      }

      console.log('SEARCH Query:', searchQuery, products);

      const pageCount: number = Math.ceil(count / ITEMS_PER_PAGE);

      if (!products) {
        return { data: 'Unable to retrieve products', status: 400 };
      } else {
        let productsData = {
          pagination: {
            count,
            pageCount,
          },
          items: products,
        };

        return { data: productsData, status: 200 };
      }
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleDeleteProduct(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const { productId } = await req.json();

  try {
    const data = await Product.findOneAndDelete({
      _id: productId,
    });

    if (data) {
      return { data: 'Deleted the product successfully', status: 200 };
    } else {
      return { data: 'Unable to delete the product', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleEditProduct(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const { productId, editedData } = await req.json();

  try {
    const productData = await Product.findByIdAndUpdate(productId, editedData, {
      new: true,
    });

    if (productData) {
      return { data: 'Edited the product data successfully', status: 200 };
    } else {
      return { data: 'Unable to edit the product data', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

export async function GET(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}

export async function POST(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    case 'get-all-products':
      res = await handleGetAllProducts(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'create-new-product':
      res = await handleCreateNewProduct(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'delete-product':
      res = await handleDeleteProduct(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'edit-product':
      res = await handleEditProduct(req);
      return NextResponse.json(res.data, { status: res.status });
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}
