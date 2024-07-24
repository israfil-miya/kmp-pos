import { NextResponse } from 'next/server';
import dbConnect from '@/utility/dbconnect';
dbConnect();
import Store from '@/models/Stores';
import getQuery from '@/utility/getapiquery';

async function handleCreateNewStore(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const data = await req.json();

  try {
    const storeData = await Store.findOneAndUpdate(
      {
        name: data.name,
      },
      data,
      {
        upsert: true,
        new: true,
      },
    );

    if (storeData) {
      return { data: 'Created new store successfully', status: 200 };
    } else {
      return { data: 'Unable to create new store', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleGetAllStores(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  try {
    const storeData = await Store.find();

    if (storeData) {
      return { data: storeData, status: 200 };
    } else {
      return { data: 'No store found', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleDeleteStore(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const { storeId } = await req.json();

  try {
    const storeData = await Store.findOneAndDelete({
      _id: storeId,
    });

    if (storeData) {
      return { data: 'Deleted the store successfully', status: 200 };
    } else {
      return { data: 'Unable to delete the store', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleEditStore(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const { storeId, editedData } = await req.json();

  try {
    const storeData = await Store.findByIdAndUpdate(storeId, editedData, {
      new: true,
    });

    if (storeData) {
      return { data: 'Edited the store successfully', status: 200 };
    } else {
      return { data: 'Unable to edit the store', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

export async function GET(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    case 'get-all-stores':
      res = await handleGetAllStores(req);
      return NextResponse.json(res.data, { status: res.status });
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}

export async function POST(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    case 'create-new-store':
      res = await handleCreateNewStore(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'delete-store':
      res = await handleDeleteStore(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'edit-store':
      res = await handleEditStore(req);
      return NextResponse.json(res.data, { status: res.status });
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}
