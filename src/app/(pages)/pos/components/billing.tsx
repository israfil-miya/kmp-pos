import { useSession } from 'next-auth/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { createNewInvoice } from '../actions';
import { POSContext, ProductType } from '../POSContext';
import { InvoiceDataTypes } from '../schema';

// Define the structure of the Invoice state
interface Invoice {
  sub_total: number;
  sub_cost: number; // Total cost based on product cost and quantity
  discount_value: number; // Store the discount value directly
  calculated_discount: number; // Store the calculated discount amount
  vat: number;
  round_off: number;
  total_amount: number;
  payment_method: string;
  paid_amount: number;
  discount_type: 'fixed' | 'percentage';
}

function Billing() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const context = useContext(POSContext);

  const [invoice, setInvoice] = useState<Invoice>({
    sub_total: 0,
    sub_cost: 0, // Initialize sub_cost
    discount_value: 0, // Initialize discount_value
    calculated_discount: 0, // Initialize calculated_discount
    vat: 0,
    round_off: 0,
    total_amount: 0,
    payment_method: 'cash',
    paid_amount: 0,
    discount_type: 'fixed',
  });

  const paymentOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'check', label: 'Check' },
    { value: 'bank', label: 'Bank' },
    { value: 'bkash', label: 'Bkash' },
    { value: 'nagad', label: 'Nagad' },
    { value: 'rocket', label: 'Rocket' },
  ];

  const discountTypes = [
    { value: 'percentage', label: '%' },
    { value: 'fixed', label: `৳` },
  ];

  // Calculate sub_total, sub_cost, and vat based on products
  const getTotal = useCallback(() => {
    let sub_total = 0;
    let sub_cost = 0;
    let vat = 0;
    context?.products.forEach((product: ProductType) => {
      const quantity = product.unit || 0;
      sub_total += product.price * quantity;
      sub_cost += product.cost * quantity; // Calculate sub_cost
      vat += ((product.price * product.vat) / 100) * quantity;
    });
    setInvoice(prevInvoice => ({
      ...prevInvoice,
      sub_total,
      sub_cost, // Update sub_cost
      vat,
    }));
  }, [context?.products]);

  // Recalculate sub_total, sub_cost, and vat whenever products change
  useEffect(() => {
    getTotal();
  }, [context?.products, getTotal]);

  // Calculate the discount based on discount_value and discount_type
  const calculateDiscount = useCallback(() => {
    const { discount_value, sub_total, discount_type } = invoice;
    let calculated_discount = 0;

    if (discount_type === 'percentage') {
      calculated_discount = (discount_value * sub_total) / 100;
    } else {
      calculated_discount = discount_value;
    }

    setInvoice(prevInvoice => ({
      ...prevInvoice,
      calculated_discount: Math.min(calculated_discount, sub_total), // Ensure the discount does not exceed sub_total
    }));
  }, [invoice.discount_value, invoice.sub_total, invoice.discount_type]);

  // Handle discount input changes
  const handleDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const discountValue = parseFloat(value);

    // Validate the discount input
    if (discountValue < 0) return;

    // Prevent discount percentage from exceeding 100%
    if (invoice.discount_type === 'percentage' && discountValue > 100) return;

    setInvoice(prevInvoice => ({
      ...prevInvoice,
      discount_value: discountValue, // Store the input value in discount_value
    }));
  };

  // Recalculate the calculated discount whenever discount_value or discount_type changes
  useEffect(() => {
    calculateDiscount();
  }, [invoice.discount_value, invoice.discount_type, calculateDiscount]);

  // Calculate round_off and total_amount whenever sub_total, calculated_discount, or vat changes
  useEffect(() => {
    const { sub_total, calculated_discount, vat } = invoice;
    const totalBeforeRoundOff = sub_total - calculated_discount + vat;
    const roundedTotal = Math.ceil(totalBeforeRoundOff);
    const roundOff = parseFloat(
      (roundedTotal - totalBeforeRoundOff).toFixed(2),
    );

    setInvoice(prev => ({
      ...prev,
      round_off: isNaN(roundOff) ? 0 : roundOff,
      total_amount: parseFloat((totalBeforeRoundOff + roundOff).toFixed(2)),
    }));
  }, [invoice.sub_total, invoice.calculated_discount, invoice.vat]);

  // a function to generate a 8 digit alphanumeric invoice number (all capital characters and numbers) with INV- prefix
  const generateInvoiceNumber = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let result = 'INV-';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const createInvoice = async () => {
    try {
      setLoading(true);

      const { products, customer } = context || {};

      // Validate the customer details
      if (
        !customer?.name &&
        !customer?.phone &&
        !customer?.address &&
        invoice.paid_amount < invoice.total_amount
      ) {
        toast.error('Please provide customer details');
        return;
      }

      // Validate the payment details
      if (!invoice.payment_method || invoice.paid_amount < 0) {
        if (invoice.paid_amount > 0) {
          toast.error('Please provide payment details');
          return;
        }
      }

      // Create the invoice object
      const newInvoice: InvoiceDataTypes = {
        invoice_no: generateInvoiceNumber(),
        cashier: session?.user?.full_name || session?.user?.name || '',
        customer: {
          name: customer?.name || '',
          phone: customer?.phone || '',
          address: customer?.address || '',
        },
        products: products!.map(product => ({
          product: JSON.parse(JSON.stringify(product.id)),
          unit: product.unit || 0,
          total_price: product.price * (product.unit || 0),
          total_cost: product.cost * (product.unit || 0),
        })),
        discount_amount: invoice.calculated_discount,
        vat_amount: invoice.vat,
        sub_total: invoice.sub_total,
        grand_total: invoice.total_amount,
        paid_amount: invoice.paid_amount,
        payment_method: invoice.payment_method,
        store_name: session?.user?.store || '',
        sub_cost: invoice.sub_cost, // Include sub_cost in the invoice
      };

      console.log(newInvoice);

      let response = await createNewInvoice(newInvoice);
      if (response.error) {
        if (response?.message !== '') {
          toast.error(response.message);
        }
      } else if (response?.message !== '') {
        // after creating the invoice, reset the context and invoice state
        context?.resetAll();
        setInvoice({
          sub_total: 0,
          sub_cost: 0, // Reset sub_cost
          discount_value: 0,
          calculated_discount: 0,
          vat: 0,
          round_off: 0,
          total_amount: 0,
          payment_method: 'cash',
          paid_amount: 0,
          discount_type: 'fixed',
        });
        toast.success(response.message);
      } else {
        console.log('Nothing was returned from the server');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while submitting the data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full">
        {/* Bill Details */}
        <div className="space-y-2 w-full">
          <div className="flex justify-between items-center">
            <p className="font-medium">Sub Total:</p>
            <p>{invoice.sub_total.toFixed(2)} ৳</p>
          </div>
          {/* 
          <div className="flex justify-between items-center">
            <p className="font-medium">Sub Cost:</p>
            <p>{invoice.sub_cost.toFixed(2)} ৳</p>
          </div> */}

          <div className="flex justify-between items-center">
            <p className="font-medium">Discount:</p>
            <div className="flex items-center gap-2">
              -
              <input
                type="number"
                value={invoice.discount_value}
                onChange={handleDiscount}
                className="w-20 p-2 border rounded"
                placeholder={
                  invoice.discount_type === 'percentage' ? '0%' : '0৳'
                }
              />
              <Select
                defaultValue={discountTypes[0]}
                value={discountTypes.find(
                  option => option.value === invoice.discount_type,
                )}
                onChange={e =>
                  setInvoice(prevInvoice => ({
                    ...prevInvoice,
                    discount_type:
                      e?.value === 'percentage' ? 'percentage' : 'fixed',
                    discount_value: 0,
                  }))
                }
                options={discountTypes}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="font-medium">VAT:</p>
            <p>{invoice.vat.toFixed(2)} ৳</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="font-medium">Round Off:</p>
            <p>+ {invoice.round_off.toFixed(2)} ৳</p>
          </div>
        </div>

        <hr className="my-4" />

        {/* Total Amount Section */}
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-lg">Total Amount:</p>
          <p className="font-bold text-lg">
            {Number(invoice.total_amount.toFixed(2)) || 0} &#2547;
          </p>
        </div>

        <hr className="my-4" />

        {/* Payment Section */}

        <div className="space-y-2 w-full">
          <div className="flex justify-between items-center">
            <p className="font-medium">Payment Method:</p>
            <Select
              menuPortalTarget={
                typeof window !== 'undefined' ? document.body : null
              }
              onChange={e =>
                setInvoice(prevInvoice => ({
                  ...prevInvoice,
                  payment_method: e?.value || '',
                }))
              }
              classNamePrefix="react-select"
              value={paymentOptions.find(
                option => option.value === invoice.payment_method,
              )}
              menuPlacement="auto"
              name="payment_method"
              options={paymentOptions}
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="font-medium">Paid Amount:</p>
            <input
              value={invoice.paid_amount}
              onChange={e =>
                setInvoice(prevInvoice => ({
                  ...prevInvoice,
                  paid_amount: parseFloat(e.target.value) || 0,
                }))
              }
              type="number"
              placeholder="Enter paid amount"
              className="appearance-none text-lg font-semibold block max-w-md text-gray-700 border border-gray-200 rounded p-2.5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
        </div>
      </div>
      <button
        onClick={createInvoice}
        disabled={!context?.products.length || loading}
        className="w-full disabled:bg-green-400 disabled:text-gray-100 mt-6 text-center rounded-sm bg-green-600 hover:[&:not([disabled])]:opacity-90 hover:[&:not([disabled])]:ring-2 hover:[&:not([disabled])]:ring-green-600 transition duration-200 delay-300 hover:[&:not([disabled])]:text-opacity-100 text-white py-2 px-3"
      >
        PAY THE BILL
      </button>

      {/* Custom Styles to Remove Number Input Arrows */}
      <style jsx>
        {`
          /* Chrome, Safari, Edge, Opera */
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          input[type='number'] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </>
  );
}

export default Billing;
