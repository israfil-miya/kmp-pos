'use client';

import {
  setCalculatedZIndex,
  setClassNameAndIsDisabled,
  setMenuPortalTarget,
} from '@/utility/selectHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import 'flowbite';
import { initFlowbite } from 'flowbite';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'sonner';
import { createNewUser } from '../actions';
import { UserDataTypes, validationSchema } from '../schema';

const baseZIndex = 50;

interface PropsType {
  storeNames: string[];
}

const CreateButton: React.FC<PropsType> = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, loading] = useActionState(createNewUser, {
    error: false,
    message: '',
  });

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target as Node) &&
      !popupRef.current.querySelector('input:focus, textarea:focus')
    ) {
      setIsOpen(false);
    }
  };

  const storeOptions = props.storeNames.map(store => ({
    value: store,
    label: store.charAt(0).toUpperCase() + store.slice(1),
  }));

  const roleOptions = [
    { value: 'administrator', label: 'Administrator' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'manager', label: 'Manager' },
  ];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UserDataTypes>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      full_name: '',
      email: '',
      role: '',
      store: '',
      phone: '',
      note: '',
      password: '',
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    if (state.error) {
      if (state?.message !== '') {
        toast.error(state.message);
      }
    } else if (state?.message !== '') {
      toast.success(state.message);
      // if (state.fields) {
      //   reset(state.fields as UserDataTypes);
      // }
      reset();
      setIsOpen(false);
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [state, reset]);

  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <>
      <button
        disabled={loading}
        onClick={() => {
          setIsOpen(true);
        }}
        className="w-full items-center flex gap-2 rounded-sm bg-green-600 hover:opacity-90 hover:ring-2 hover:ring-green-600 transition duration-200 delay-300 hover:text-opacity-100 text-white py-2 px-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
        Add User
      </button>

      <section
        onClick={handleClickOutside}
        className={`fixed z-${baseZIndex} inset-0 flex justify-center items-center transition-colors ${isOpen ? 'visible bg-black/20 disable-page-scroll' : 'invisible'} `}
      >
        <article
          ref={popupRef}
          onClick={e => e.stopPropagation()}
          className={`${isOpen ? 'scale-100 opacity-100' : 'scale-125 opacity-0'} bg-white rounded-sm shadow relative md:w-[60vw] lg:w-[40vw]  text-wrap`}
        >
          <header className="flex items-center align-middle justify-between px-4 py-2 border-b rounded-t">
            <h3 className="text-gray-900 text-lg lg:text-xl font-semibold uppercase">
              Create New User
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-sm text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </header>

          <form
            action={formAction}
            ref={formRef}
            className="overflow-y-scroll max-h-[70vh] p-4 text-start"
            onSubmit={e => {
              e.preventDefault();
              handleSubmit(() => {
                formAction(new FormData(formRef.current!));
              })(e);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
              <div>
                <label
                  className="tracking-wide text-gray-700 text-sm font-bold block mb-2 "
                  htmlFor="grid-password"
                >
                  <span className="uppercase">Email*</span>
                  <span className="text-red-700 text-wrap block text-xs">
                    {errors.email && errors.email.message}
                  </span>
                </label>
                <input
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('email')}
                  type="email"
                />
              </div>

              <div>
                <label
                  className="tracking-wide text-gray-700 text-sm font-bold block mb-2 "
                  htmlFor="grid-password"
                >
                  <span className="uppercase">Password*</span>
                  <span className="text-red-700 text-wrap block text-xs">
                    {errors.password && errors.password.message}
                  </span>
                </label>
                <input
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('password')}
                  type="text"
                />
              </div>

              <div>
                <label
                  className="tracking-wide text-gray-700 text-sm font-bold block mb-2 "
                  htmlFor="grid-password"
                >
                  <span className="uppercase">Full Name*</span>
                  <span className="text-red-700 text-wrap block text-xs">
                    {errors.full_name && errors.full_name.message}
                  </span>
                </label>
                <input
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('full_name')}
                  type="text"
                />
              </div>

              <div>
                <label
                  className="uppercase tracking-wide text-gray-700 text-sm font-bold flex gap-2 mb-2"
                  htmlFor="grid-password"
                >
                  Phone
                </label>
                <input
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('phone')}
                  type="text"
                />
              </div>

              <div>
                <label
                  className="tracking-wide text-gray-700 text-sm font-bold block mb-2 "
                  htmlFor="role"
                >
                  <span className="uppercase">Role*</span>
                  <span className="text-red-700 text-wrap block text-xs">
                    {errors.role && errors.role.message}
                  </span>
                </label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      {...setClassNameAndIsDisabled(isOpen)}
                      options={roleOptions}
                      isClearable={true}
                      placeholder="Select role"
                      classNamePrefix="react-select"
                      menuPortalTarget={setMenuPortalTarget}
                      styles={setCalculatedZIndex(baseZIndex)}
                      value={
                        roleOptions.find(
                          option => option.value === field.value,
                        ) || null
                      }
                      onChange={option =>
                        field.onChange(option ? option.value : '')
                      }
                    />
                  )}
                />
              </div>

              <div>
                <label
                  className="tracking-wide text-gray-700 text-sm font-bold block mb-2 "
                  htmlFor="store"
                >
                  <span className="uppercase">Store</span>
                  <span className="text-red-700 text-wrap block text-xs">
                    {errors.store && errors.store.message}
                  </span>
                </label>
                <Controller
                  name="store"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      {...setClassNameAndIsDisabled(isOpen)}
                      options={storeOptions}
                      isClearable={true}
                      placeholder="Select store"
                      classNamePrefix="react-select"
                      menuPortalTarget={setMenuPortalTarget}
                      styles={setCalculatedZIndex(baseZIndex)}
                      value={
                        storeOptions.find(
                          option => option.value === field.value,
                        ) || null
                      }
                      onChange={option =>
                        field.onChange(option ? option.value : '')
                      }
                    />
                  )}
                />
              </div>

              <div>
                <label
                  className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Note
                </label>
                <textarea
                  rows={5}
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('note')}
                />
              </div>
            </div>
          </form>

          <footer className="flex items-center px-4 py-2 border-t justify-end gap-6 border-gray-200 rounded-b">
            <div className="buttons space-x-2 ">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-sm bg-gray-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-gray-600 transition duration-200 delay-300 hover:text-opacity-100 px-4 py-2 uppercase"
                type="button"
                disabled={loading}
              >
                Close
              </button>
              <button
                disabled={loading}
                onClick={() => {
                  formRef.current?.requestSubmit();
                }}
                className="rounded-sm bg-blue-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 px-4 py-2 uppercase"
                type="button"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </footer>
        </article>
      </section>
    </>
  );
};

export default CreateButton;
