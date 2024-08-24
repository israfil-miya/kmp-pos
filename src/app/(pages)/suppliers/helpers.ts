import React from 'react';

export interface SupplierDataTypes {
  _id?: string;
  name?: string;
  company?: string;
  reg_date?: string;
  email?: string;
  phone?: string;
  address?: string;
  __v?: number;
}

export function handleResetState(
  setState: React.Dispatch<React.SetStateAction<SupplierDataTypes>>,
) {
  setState({
    name: '',
    company: '',
    reg_date: '',
    email: '',
    phone: '',
    address: '',
  });
}
