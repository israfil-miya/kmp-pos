'use server';
import Category from '@/models/Categories';
import Product from '@/models/Products';
import Store from '@/models/Stores';
import Supplier from '@/models/Suppliers';
import {
  extractDbErrorMessages,
  mapFormDataToFields,
  parseFormData,
} from '@/utility/actionHelpers';
import dbConnect from '@/utility/dbConnect';
import getTodayDate from '@/utility/getTodaysDate';
import { addRegexField } from '@/utility/regexQuery';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

dbConnect();

export type FormState = {
  error: boolean;
  message: string;
  fields?: Record<any, any>;
  issues?: string[];
};

interface Stats {
  expensesCurrentMonth: number;
  salesCurrentMonth: number;
  revenueCurrentMonth: number;
  expensesCurrentYear: number;
  salesCurrentYear: number;
  revenueCurrentYear: number;
  salesToday: number;
  invoicesToday: number;
  productsNew: number;
  expiredProducts: number;
  suppliers: number;
  availableProducts: number;
  stores: number;
}
