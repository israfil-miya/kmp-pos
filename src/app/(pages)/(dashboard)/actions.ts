'use server';
import Category from '@/models/Categories';
import Expense from '@/models/Expenses';
import Invoice from '@/models/Invoices';
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
  expensesCurrentYear: number;
  salesCurrentYear: number;
  salesToday: number;
  invoicesToday: number;
  expiredProducts: number;
  suppliers: number;
  pendingDue: number;
  stores: number;
}

export const getAllCardStats = async (): Promise<FormState> => {
  try {
    const expensesCurrentMonth = await Expense.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0,
            ),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const salesCurrentMonth = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0,
            ),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$grand_total' },
        },
      },
    ]);

    const expensesCurrentYear = await Expense.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lt: new Date(new Date().getFullYear(), 12, 0),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const salesCurrentYear = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lt: new Date(new Date().getFullYear(), 12, 0),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$grand_total' },
        },
      },
    ]);

    const salesToday = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
            ),
            $lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() + 1,
            ),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$grand_total' },
        },
      },
    ]);

    const invoicesToday = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
            ),
            $lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() + 1,
            ),
          },
        },
      },
      {
        $count: 'total',
      },
    ]);

    const pendingDue = await Invoice.aggregate([
      {
        $addFields: {
          totalDue: { $subtract: ['$grand_total', '$paid_amount'] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalDue' },
        },
      },
    ]);

    const expiredProducts = await Product.countDocuments({
      $and: [{ exp_date: { $lt: getTodayDate() } }, { exp_date: { $ne: '' } }],
    });

    const suppliers = await Supplier.countDocuments({});

    const availableProducts = await Product.countDocuments({
      $or: [{ exp_date: { $gte: getTodayDate() } }, { exp_date: '' }],
    });

    const stores = await Store.countDocuments({});

    const stats: Stats = {
      expensesCurrentMonth: expensesCurrentMonth[0]?.total || 0,
      salesCurrentMonth: salesCurrentMonth[0]?.total || 0,
      expensesCurrentYear: expensesCurrentYear[0]?.total || 0,
      salesCurrentYear: salesCurrentYear[0]?.total || 0,
      salesToday: salesToday[0]?.total || 0,
      invoicesToday: invoicesToday[0]?.total || 0,
      pendingDue: pendingDue[0]?.total
        ? pendingDue[0]?.total > 0
          ? pendingDue[0]?.total
          : 0
        : 0,
      stores,
      expiredProducts,
      suppliers,
    };

    console.log(salesToday);

    return {
      error: false,
      message: JSON.stringify(stats),
    };
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving stats data',
    };
  }
};
