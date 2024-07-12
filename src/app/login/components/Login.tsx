import React from 'react';
import Image from 'next/image';
import moment from 'moment-timezone';
import LoginForm from './Form';

const Login = () => {
  return (
    <div className="flex flex-row items-center justify-around align-middle min-h-[100vh]">
      <div>
        <Image
          src="/images/unsplash-1.jpg"
          alt="login"
          width={500}
          height={500}
        />
      </div>
      <div className="bg-gray-100 text-black p-6 pb-10 w-96">
        <h1 className="text-3xl font-bold text-center uppercase pt-3 pb-4">
          Login
        </h1>
        <LoginForm />
        <p className="text-center text-sm pt-4 pb-1">
          ALL rights reserved by POS@DEMO &copy; {moment().format('YYYY')}-
          {moment().add(1, 'year').format('YYYY')}
        </p>
      </div>
    </div>
  );
};

export default Login;
