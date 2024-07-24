import React from 'react';

export interface UserDataTypes {
  _id?: string;
  full_name?: string;
  email?: string;
  role?: string;
  store?: string;
  phone?: string;
  note?: string;
  password?: string;
  __v?: number;
}

export function handleResetState(
  setState: React.Dispatch<React.SetStateAction<UserDataTypes>>,
) {
  setState({
    full_name: '',
    email: '',
    role: '',
    store: '',
    phone: '',
    note: '',
    password: '',
  });
}
