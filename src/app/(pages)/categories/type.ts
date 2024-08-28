import React from 'react';
import { FormDataTypes } from './schema';

export interface CategoryDataTypes extends FormDataTypes {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
