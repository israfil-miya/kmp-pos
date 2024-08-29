'use client';

import '@/app/globals.css';
import { zodResolver } from '@hookform/resolvers/zod';
import React, {
  ChangeEvent,
  FormEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { handleSignIn } from '../actions';
import { LoginDataTypes, validationSchema } from '../schema';

const LoginForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, loading] = useActionState(handleSignIn, {
    error: false,
    message: '',
  });

  useEffect(() => {
    if (state.error) {
      if (state?.message !== '') {
        toast.error(state.message);
      }
    } else if (state?.message !== '') {
      toast.success(state.message);
      formRef.current?.reset();
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataTypes>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(state?.fields ?? {}),
    },
  });

  return (
    <form
      action={formAction}
      ref={formRef}
      onSubmit={e => {
        e.preventDefault();
        handleSubmit(() => {
          formAction(new FormData(formRef.current!));
        })(e);
      }}
    >
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
              {...register('email')}
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
