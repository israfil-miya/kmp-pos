import { NextResponse } from 'next/server';
import dbConnect from '@/utility/dbconnect';
dbConnect();
import Category from '@/models/Categories';
import getQuery from '@/utility/getapiquery';

async function handleCreateNewCategory(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const data = await req.json();

  try {
    const categoryData = await Category.findOneAndUpdate(
      {
        name: data.name,
      },
      data,
      {
        upsert: true,
        new: true,
      },
    );

    if (categoryData) {
      return { data: 'Created new category successfully', status: 200 };
    } else {
      return { data: 'Unable to create new category', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleGetAllCategories(req: Request): Promise<{
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
