'use server';
import Category from '@/models/Categories';
import Expense from '@/models/Expenses';
import Invoice from '@/models/Invoices';
import Product from '@/models/Products';
import Store from '@/models/Stores';
import Supplier from '@/models/Suppliers';
import { getTodayDate } from '@/utility/date';
import dbConnect from '@/utility/dbConnect';
import moment from 'moment-timezone';
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
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 12, 0);
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    // Execute multiple aggregation queries in parallel using Promise.all
    const [
      expensesCurrentMonth,
      salesCurrentMonth,
      expensesCurrentYear,
      salesCurrentYear,
      salesToday,
      invoicesToday,
      pendingDue,
      expiredProducts,
      suppliers,
      availableProducts,
      stores,
    ] = await Promise.all([
      // Expenses and sales for the current month
      Expense.aggregate([
        { $match: { createdAt: { $gte: startOfMonth, $lt: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Invoice.aggregate([
        { $match: { createdAt: { $gte: startOfMonth, $lt: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$grand_total' } } },
      ]),

      // Expenses and sales for the current year
      Expense.aggregate([
        { $match: { createdAt: { $gte: startOfYear, $lt: endOfYear } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Invoice.aggregate([
        { $match: { createdAt: { $gte: startOfYear, $lt: endOfYear } } },
        { $group: { _id: null, total: { $sum: '$grand_total' } } },
      ]),

      // Sales and invoice count for today
      Invoice.aggregate([
        { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
        { $group: { _id: null, total: { $sum: '$grand_total' } } },
      ]),
      Invoice.aggregate([
        { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
        { $count: 'total' },
      ]),

      // Pending dues
      Invoice.aggregate([
        {
          $addFields: {
            totalDue: { $subtract: ['$grand_total', '$paid_amount'] },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalDue' } } },
      ]),

      // Other counts (expired products, suppliers, available products, stores)
      Product.countDocuments({
        $and: [
          { exp_date: { $lt: getTodayDate() } },
          { exp_date: { $ne: '' } },
        ],
      }),
      Supplier.countDocuments(),
      Product.countDocuments({
        $or: [{ exp_date: { $gte: getTodayDate() } }, { exp_date: '' }],
      }),
      Store.countDocuments(),
    ]);

    // Compile results into stats object
    const stats: Stats = {
      expensesCurrentMonth: expensesCurrentMonth[0]?.total || 0,
      salesCurrentMonth: salesCurrentMonth[0]?.total || 0,
      expensesCurrentYear: expensesCurrentYear[0]?.total || 0,
      salesCurrentYear: salesCurrentYear[0]?.total || 0,
      salesToday: salesToday[0]?.total || 0,
      invoicesToday: invoicesToday[0]?.total || 0,
      pendingDue: pendingDue[0]?.total ? Math.max(pendingDue[0].total, 0) : 0,
      stores,
      expiredProducts,
      suppliers,
    };

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
    const now = moment.tz('Asia/Dhaka');
    const lastYear = now.clone().subtract(5, 'months').startOf('month');

    const salesMonthly = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear.toDate() },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$grand_total' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const monthlySalesObject: { [key: string]: number } = {};
    for (let i = 0; i < 6; i++) {
      const date = now.clone().subtract(5 - i, 'months');
      const monthName = `${date.format('MMM')}-${date.year()}`;
      monthlySalesObject[monthName] = 0;
    }

    salesMonthly.forEach(({ _id, total }) => {
      const monthName = `${moment.months(_id.month - 1)}-${_id.year}`;
      monthlySalesObject[monthName] = total;
    });

    return {
      error: false,
      message: JSON.stringify(monthlySalesObject),
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
    const now = moment.tz('Asia/Dhaka');
    const last14Days = now.clone().subtract(13, 'days').startOf('day');

    const salesByStore = await Store.aggregate([
      {
        $lookup: {
          from: 'invoices',
          let: { storeName: '$name' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$store_name', '$$storeName'] },
                    { $gte: ['$createdAt', last14Days.toDate()] },
                    { $lte: ['$createdAt', now.toDate()] },
                  ],
                },
              },
            },
          ],
          as: 'invoices',
        },
      },
      {
        $unwind: {
          path: '$invoices',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$name',
          total: { $sum: { $ifNull: ['$invoices.grand_total', 0] } },
        },
      },
    ]);

    const formattedSalesByStore = salesByStore.reduce(
      (acc, storeData) => {
        acc[storeData._id] = Math.round(storeData.total);
        return acc;
      },
      {} as { [key: string]: number },
    );

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
    const now = moment.tz('Asia/Dhaka');
    const last14Days = now.clone().subtract(13, 'days').startOf('day');

    const results: { [key: string]: { sales: number; expenses: number } } = {};

    // Create an array of date promises
    const promises = Array.from({ length: 14 }, (_, i) => {
      const date = last14Days.clone().add(i, 'days');
      const formattedDate = date.format('MMM-DD');
      const endDate = date.clone().endOf('day');

      if (i === 13) {
        endDate.set({
          hour: now.hour(),
          minute: now.minute(),
          second: now.second(),
          millisecond: now.millisecond(),
        });
      }

      // Sales and expenses promises for the date range
      return Promise.all([
        Invoice.aggregate([
          {
            $match: {
              createdAt: {
                $gte: date.toDate(),
                $lte: endDate.toDate(),
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$grand_total' },
            },
          },
        ]),
        Expense.aggregate([
          {
            $match: {
              createdAt: {
                $gte: date.toDate(),
                $lte: endDate.toDate(),
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
            },
          },
        ]),
        formattedDate,
      ]);
    });

    // Resolve all promises
    const resultsArray = await Promise.all(promises);

    resultsArray.forEach(([sales, expenses, formattedDate]) => {
      results[formattedDate] = {
        sales: Math.round(sales[0]?.total || 0),
        expenses: Math.round(expenses[0]?.total || 0),
      };
    });

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
