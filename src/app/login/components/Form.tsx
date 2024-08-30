'use client';

import '@/app/globals.css';
import cn from '@/utility/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LoginDataTypes, validationSchema } from '../schema';

const LoginForm = () => {
  const router = useRouter();

  const handleSignIn: SubmitHandler<LoginDataTypes> = async data => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.ok) {
        toast.success('Logged in successfully');
        router.replace('/');
        return;
      } else {
        if (result?.error === 'CredentialsSignin') {
          toast.error('Invalid email or password');
          return;
        } else {
          toast.error('An error occurred');
          return;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while submitting the form');
      return;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: loading },
  } = useForm<LoginDataTypes>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(handleSignIn)}>
      <div className="flex flex-col mb-2">
        <div className="w-full">
          <div>
            <label
              className="tracking-wide text-sm font-bold block mb-2 "
              htmlFor="email-input"
            >
              <span className="uppercase">Email</span>
              <span className="text-red-700 text-wrap block text-xs">
                {errors?.email && errors.email.message}
              </span>
            </label>
            <input
              className={cn(
                'appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500',
                errors.email && 'border-red-500',
              )}
              required
              {...register('email')}
              type="email"
              id="email-input"
              placeholder="johndoe@pos.com"
            />
          </div>

          <div>
            <label
              className="tracking-wide text-sm font-bold block mb-2 "
              htmlFor="password-input"
            >
              <span className="uppercase">Password</span>
              <span className="text-red-700 text-wrap block text-xs">
                {errors?.password && errors.password.message}
              </span>
            </label>
            <input
              className={cn(
                'appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500',
                errors.password && 'border-red-500',
              )}
              type="password"
              required
              {...register('password')}
              id="password-input"
              placeholder="*******"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-sm w-full bg-black text-white font-bold hover:bg-gray-800 px-8 py-2.5 focus:outline-none"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
