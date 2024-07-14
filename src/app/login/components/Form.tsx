'use client';

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import '@/app/globals.css';

const LoginForm = () => {
  const [creds, setCreds] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  let handleSignInSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: creds.email,
        password: creds.password,
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      });

      if (result?.error) {
        setLoading(false);
        if (result.error === 'CredentialsSignin') {
          toast.error('Invalid email or password', {
            id: 'invalid-creds',
          });
        } else {
          toast.error('An error occurred', { id: 'error' });
        }
      } else if (result?.ok) {
        router.push('/');
        setLoading(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred', { id: 'unexpected-error' });
      throw error;
    }
  };

  let handleOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSignInSubmit}>
      <div className="flex flex-col mb-2">
        <div className="w-full">
          <div>
            <label
              className="block uppercase tracking-wide text-sm font-bold mb-2"
              htmlFor="grid-password"
            >
              Email Address
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              required
              name="email"
              value={creds.email}
              onChange={handleOnChange}
              type="email"
              id="email-input"
              placeholder="johndoe@pos.com"
            />
          </div>

          <div>
            <label
              className="block uppercase tracking-wide text-sm font-bold mb-2"
              htmlFor="grid-password"
            >
              Password
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="password"
              name="password"
              required
              value={creds.password}
              onChange={handleOnChange}
              id="password-input"
              placeholder="*******"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md w-full bg-black text-white font-bold hover:bg-gray-800 px-8 py-2.5 focus:outline-none"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
