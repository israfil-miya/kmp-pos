import React from 'react';

export interface StoreDataTypes {
  _id?: string;
  name?: string;
  location?: string;
  manager?: string;
  phone?: string;
  status?: string;
  __v?: number;
}

export function handleResetState(
  setState: React.Dispatch<React.SetStateAction<StoreDataTypes>>,
) {
  setState({
    name: '',
    location: '',
    manager: '',
    phone: '',
    status: '',
  });
}
