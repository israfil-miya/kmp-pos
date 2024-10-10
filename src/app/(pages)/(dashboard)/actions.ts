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

export const getSalesByMonth = async (): Promise<FormState> => {
  try {
    // Get the current date and calculate the date 12 months ago
    const now = new Date();
    const lastYear = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const salesMonthly = await Invoice.aggregate([
      {
        // Filter invoices from the last 12 months
        $match: {
          createdAt: {
            $gte: lastYear, // Invoices from the last 12 months
          },
        },
      },
      {
        // Group by both year and month
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$grand_total' },
        },
      },
      {
        // Sort by year and month
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // Array to map month numbers to names
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Initialize an array of the last 12 months with 0 sales
    const monthlySalesArray = Array(12)
      .fill(0)
      .map((_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (11 - index)); // Go back 12 months
        const monthName = `${monthNames[date.getMonth()]}-${date.getFullYear()}`; // Get the name of the month with year
        return { [monthName]: 0 };
      });

    // Populate the array with actual sales data
    salesMonthly.forEach(({ _id, total }) => {
      const date = new Date(_id.year, _id.month - 1);
      const monthName = `${monthNames[date.getMonth()]}-${date.getFullYear()}`; // Construct the month-year string
      const monthIndex = monthlySalesArray.findIndex(
        item => Object.keys(item)[0] === monthName,
      );
      if (monthIndex !== -1) {
        monthlySalesArray[monthIndex][monthName] = total; // Update the correct month with total sales
      }
    });

    return {
      error: false,
      message: JSON.stringify(monthlySalesArray),
    };
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving monthly sales data',
    };
  }
};

export const getSalesByStore = async (): Promise<FormState> => {
  try {
    const salesByStore = await Store.aggregate([
      {
        $lookup: {
          from: 'invoices', // Treat "invoices" as the right collection
          localField: 'name', // Match store name with the store_name in invoices
          foreignField: 'store_name',
          as: 'invoices',
        },
      },
      {
        $unwind: {
          path: '$invoices',
          preserveNullAndEmptyArrays: true, // Keep stores even if they have no invoices
        },
      },
      {
        $group: {
          _id: '$name', // Group by store name
          total: { $sum: { $ifNull: ['$invoices.grand_total', 0] } }, // Sum the grand total, default to 0 if no invoices
        },
      },
    ]);

    // Format the result as an array of objects with store names as keys
    const formattedSalesByStore = salesByStore.map(storeData => ({
      [storeData._id]: storeData.total,
    }));

    return {
      error: false,
      message: JSON.stringify(formattedSalesByStore),
    };
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving sales by store data',
    };
  }
};

export const getSalesVSExpensesByDate = async (): Promise<FormState> => {
  try {
    const now = new Date();
    const last14Days = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 14,
    );

    // Initialize an array to hold the results for each day
    const results = [];

    // Loop through the last 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(last14Days);
      date.setDate(last14Days.getDate() + i); // Increment the date by i

      const formattedDate = `${date.toLocaleString('default', { month: 'long' })}-${String(date.getDate()).padStart(2, '0')}`; // Format: Month-Day

      // Get sales for the specific date
      const sales = await Invoice.aggregate([
        {
          $match: {
            createdAt: {
              $gte: date,
              $lt: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1,
              ), // Match only that specific day
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

      // Get expenses for the specific date
      const expenses = await Expense.aggregate([
        {
          $match: {
            createdAt: {
              $gte: date,
              $lt: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1,
              ), // Match only that specific day
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

      // Calculate total sales and expenses for that day
      const salesTotal = sales[0]?.total || 0;
      const expensesTotal = expenses[0]?.total || 0;

      // Push the result into the array
      results.push({
        [formattedDate]: {
          sales: salesTotal,
          expenses: expensesTotal,
        },
      });
    }

    return {
      error: false,
      message: JSON.stringify(results),
    };
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving sales vs expenses data',
    };
  }
};
