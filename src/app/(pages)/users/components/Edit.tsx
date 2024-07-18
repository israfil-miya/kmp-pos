import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { YYYY_MM_DD_to_DD_MM_YY as convertToDDMMYYYY } from '@/utility/dateconvertion';
import UserDataTypes from './UserDataTypes';

interface PropsType {
  userData: UserDataTypes;
  isLoading: boolean;
  submitHandler: (
    userId: string | undefined,
    userData: UserDataTypes,
    editedData: UserDataTypes,
    setEditedData: React.Dispatch<React.SetStateAction<UserDataTypes>>,
  ) => Promise<void>;
}

const EditButton: React.FC<PropsType> = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const popupRef = useRef<HTMLElement>(null);

  const [editedData, setEditedData] = useState<UserDataTypes>(props.userData);

  useEffect(() => {
    if (!isOpen) {
      setEditedData({});
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target as Node) &&
      !popupRef.current.querySelector('input:focus, textarea:focus')
    ) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        disabled={props.isLoading}
        onClick={() => {
          setIsOpen(true);
        }}
        className="items-center gap-2 rounded-md bg-blue-600 hover:opacity-90 hover:ring-2 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 text-white p-2"
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
          className={`${isOpen ? 'scale-100 opacity-100' : 'scale-125 opacity-0'} bg-white rounded-lg shadow relative md:w-[60vw] lg:w-[40vw]  text-wrap`}
        >
          <header className="flex items-center align-middle justify-between px-4 py-2 border-b rounded-t">
            <h3 className="text-gray-900 text-lg lg:text-xl font-semibold dark:text-white uppercase">
              Edit User
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="default-modal"
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
          <div className="overflow-x-hidden overflow-y-scroll max-h-[70vh] p-4 text-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
              <div>
                <label
                  className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2"
                  htmlFor="grid-password"
                >
                  Full Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="full_name"
                  value={editedData.full_name}
                  onChange={handleChange}
                  type="text"
                />
              </div>

              <div>
                <label
                  className="uppercase tracking-wide text-gray-700 text-sm font-bold flex gap-2 mb-2"
                  htmlFor="grid-password"
                >
                  Email
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                  type="email"
                />
              </div>

              <div>
                <label
                  className="uppercase tracking-wide text-gray-700 text-sm font-bold flex gap-2 mb-2"
                  htmlFor="grid-password"
                >
                  Password
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="password"
                  value={editedData.password}
                  onChange={handleChange}
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
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="phone"
                  value={editedData.phone}
                  onChange={handleChange}
                  type="text"
                />
              </div>

              <div>
                <label
                  className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2"
                  htmlFor="grid-last-name"
                >
                  Role
                </label>
                <select
                  value={editedData.role}
                  onChange={e =>
                    setEditedData(prevData => ({
                      ...prevData,
                      role: e.target.value,
                    }))
                  }
                  required
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value={''} className="text-gray-400">
                    Select user role
                  </option>
                  <option value="administrator">Administrator</option>
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div>
                <label
                  className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2"
                  htmlFor="grid-last-name"
                >
                  Store
                </label>
                <select
                  value={editedData.store}
                  onChange={e =>
                    setEditedData(prevData => ({
                      ...prevData,
                      store: e.target.value,
                    }))
                  }
                  required
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value={''} className="text-gray-400">
                    Select store
                  </option>

                  {/* Loop over stores/stores from database here */}
                  <option value="badda-01">Badda-01</option>
                  <option value="gulshan-02">Gulshan-02</option>
                  <option value="demra-03">Demra-03</option>
                </select>
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
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="note"
                  value={editedData.note}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <footer className="flex items-center px-4 py-2 border-t justify-end gap-6 border-gray-200 rounded-b">
            <div className="buttons space-x-2 ">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-gray-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-gray-600 transition duration-200 delay-300 hover:text-opacity-100 px-8 py-2 uppercase"
                type="button"
              >
                Close
              </button>
              <button
                onClick={() => {
                  props.submitHandler(
                    props.userData?._id,
                    props.userData,
                    editedData,
                    setEditedData,
                  );
                  setIsOpen(false);
                }}
                className="rounded-md bg-blue-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 px-8 py-2 uppercase"
                type="button"
              >
                Submit
              </button>
            </div>
          </footer>
        </article>
      </section>
    </>
  );
};

export default EditButton;
