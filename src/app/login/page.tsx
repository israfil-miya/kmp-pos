import '@/app/globals.css';
import { auth } from '@/auth';
import moment from 'moment-timezone';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import LoginForm from './components/Form';

const LoginPage = async () => {
  let session = await auth();

  if (session && session.user) {
    redirect('/');
  }

  return (
    <>
      <div className="flex flex-row items-center justify-around align-middle min-h-[100vh]">
        <div>
          <Image
            src="/images/khalek-molla-high-resolution-logo-transparent.png"
            alt="login"
            quality={100}
            width={500}
            height={60}
            className="w-[500px] h-[60px]"
          />
        </div>
        <div className="bg-gray-100 text-black p-6 pb-10 w-96">
          <h1 className="text-3xl font-bold text-center uppercase pt-3 pb-4">
            Login
          </h1>
          <LoginForm />
          <p className="text-center text-sm pt-4 pb-1">
            ALL rights reserved by KMP &copy; {moment().format('YYYY')}-
            {moment().add(1, 'year').format('YYYY')}
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
