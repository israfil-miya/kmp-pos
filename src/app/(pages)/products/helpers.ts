import React from 'react';

export interface ProductDataTypes {
  _id?: string;
  batch?: string;
  name?: string;
  description?: string;
  cost_price?: number;
  selling_price?: number;
  quantity?: number;
  supplier?: string;
  category?: string;
  store?: string;
  mft_date?: string;
  exp_date?: string;
  in_stock?: boolean;
  __v?: number;
}

export function handleResetState(
  setState: React.Dispatch<React.SetStateAction<ProductDataTypes>>,
) {
  setState({
    batch: '',
    name: '',
    description: '',
    cost_price: 0,
    selling_price: 0,
    quantity: 0,
    supplier: '',
    category: '',
    store: '',
    mft_date: '',
    exp_date: '',
    in_stock: false,
  });
}
