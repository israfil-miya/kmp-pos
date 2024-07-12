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

export async function GET(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    case 'handle-login':
      res = await handleLogin(req);
      return NextResponse.json(res.data, { status: res.status });
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}

export async function POST(req: Request) {
  let res: { data: string | Object; status: number };
  switch (getQuery(req).action) {
    default:
      return NextResponse.json({ response: 'OK' }, { status: 200 });
  }
}
