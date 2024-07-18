import { NextResponse } from 'next/server';
import dbConnect from '@/utility/dbconnect';
dbConnect();
import User from '@/models/Users';
import getQuery from '@/utility/getapiquery';

async function handleLogin(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const email = req.headers.get('email');
  const password = req.headers.get('password');

  try {
    const userData = await User.findOne({
      email: email,
      password: password,
    });

    if (userData) {
      return { data: userData, status: 200 };
    } else {
      return { data: 'Invalid email or password', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleCreateNewUser(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const data = await req.json();

  try {
    const userData = await User.findOneAndUpdate(
      {
        email: data.email,
      },
      data,
      {
        upsert: true,
        new: true,
      },
    );

    if (userData) {
      return { data: 'Created new user successfully', status: 200 };
    } else {
      return { data: 'Unable to create new user', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleGetAllUsers(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  try {
    const userData = await User.find();

    if (userData) {
      return { data: userData, status: 200 };
    } else {
      return { data: 'No user found', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleDeleteUser(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const { userId } = await req.json();

  try {
    const userData = await User.findOneAndDelete({
      _id: userId,
    });

    if (userData) {
      return { data: 'Deleted user successfully', status: 200 };
    } else {
      return { data: 'Unable to delete user', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

async function handleEditUser(req: Request): Promise<{
  data: string | Object;
  status: number;
}> {
  const { userId, editedData } = await req.json();

  try {
    const userData = await User.findByIdAndUpdate(userId, editedData, {
      new: true,
    });

    if (userData) {
      return { data: 'Edited user data successfully', status: 200 };
    } else {
      return { data: 'Unable to edit user data', status: 400 };
    }
  } catch (e) {
    console.error(e);
    return { data: 'An error occurred', status: 500 };
  }
}

export async function GET(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    case 'handle-login':
      res = await handleLogin(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'get-all-users':
      res = await handleGetAllUsers(req);
      return NextResponse.json(res.data, { status: res.status });
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}

export async function POST(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    case 'create-new-user':
      res = await handleCreateNewUser(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'delete-user':
      res = await handleDeleteUser(req);
      return NextResponse.json(res.data, { status: res.status });
    case 'edit-user':
      res = await handleEditUser(req);
      return NextResponse.json(res.data, { status: res.status });
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}
