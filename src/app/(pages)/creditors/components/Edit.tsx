'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { InvoiceDataTypes } from '../../invoices/schema';
import { editCreditor } from '../actions';
import { CreditorDataTypes, validationSchema } from '../schema';

interface PropsType {
  creditorData: InvoiceDataTypes;
}

const EditButton: React.FC<PropsType> = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, loading] = useActionState(editCreditor, {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreditorDataTypes>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      due_balance:
        props.creditorData.grand_total - props.creditorData.paid_amount,
      payment_amount: 0,
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
      if (state.fields) {
        reset(state.fields as CreditorDataTypes);
      }
      setIsOpen(false);
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [state, reset]);

  return (
    <>
      <button
        disabled={loading}
        onClick={() => {
          setIsOpen(true);
        }}
        className="items-center gap-2 rounded-sm bg-blue-600 hover:opacity-90 hover:ring-2 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 text-white p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
          <path
            fillRule="evenodd"
            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
          />
        </svg>
      </button>

      <section
        onClick={handleClickOutside}
        className={`fixed z-50 inset-0 flex justify-center items-center transition-colors ${isOpen ? 'visible bg-black/20 disable-page-scroll' : 'invisible'} `}
      >
        <article
          ref={popupRef}
          onClick={e => e.stopPropagation()}
          className={`${isOpen ? 'scale-100 opacity-100' : 'scale-125 opacity-0'} bg-white rounded-sm shadow relative md:w-[60vw] lg:w-[40vw]  text-wrap`}
        >
          <header className="flex items-center align-middle justify-between px-4 py-2 border-b rounded-t">
            <h3 className="text-gray-900 text-lg lg:text-xl font-semibold uppercase">
              Edit Creditor
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
            className="overflow-x-hidden overflow-y-scroll max-h-[70vh] p-4 text-start"
            onSubmit={e => {
              e.preventDefault();
              handleSubmit(() => {
                const formData = new FormData(formRef.current!);
                formData.append('_id', String(props.creditorData._id)!);
                formAction(formData);
              })(e);
            }}
          >
            <div className="gap-x-3 gap-y-4 flex flex-col">
              <div>
                <label className="tracking-wide text-gray-700 text-sm font-bold block mb-2 ">
                  <span className="uppercase">Due Balance</span>
                  <span className="text-red-700 text-wrap block text-xs">
                    {errors.due_balance && errors.due_balance.message}
                  </span>
                </label>
                <input
                  readOnly
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('due_balance')}
                  step=".01"
                  type="number"
                />
              </div>
              <div>
                <label className="tracking-wide text-gray-700 text-sm font-bold block mb-2 ">
                  <span className="uppercase">Payment Amount*</span>
                  <span className="text-red-700 text-wrap block text-xs">
                    {errors.payment_amount && errors.payment_amount.message}
                  </span>
                </label>
                <input
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('payment_amount')}
                  step=".01"
                  type="number"
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

export default EditButton;
