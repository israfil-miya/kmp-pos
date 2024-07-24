import React from 'react';

export interface CategoryDataTypes {
  _id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export function handleResetState(
  setState: React.Dispatch<React.SetStateAction<CategoryDataTypes>>,
) {
  setState({
    name: '',
  });
}
