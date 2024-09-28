import React, { useCallback, useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { POSContext } from '../POSContext';

// Define the structure of a Product
interface Product {
  price: number;
  unit?: number;
  vat: number;
}

// Define the structure of the Invoice state
interface Invoice {
  sub_total: number;
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
  const context = useContext(POSContext);

  const [invoice, setInvoice] = useState<Invoice>({
    sub_total: 0,
    discount_value: 0, // Initialize discount_value
    calculated_discount: 0, // Initialize calculated_discount
    vat: 0,
    round_off: 0,
    total_amount: 0,
    payment_method: '',
    paid_amount: 0,
    discount_type: 'fixed',
  });

  const paymentOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'bkash', label: 'Bkash' },
    { value: 'nagad', label: 'Nagad' },
    { value: 'rocket', label: 'Rocket' },
  ];

  const discountTypes = [
    { value: 'percentage', label: '%' },
    { value: 'fixed', label: `৳` },
  ];

  // Calculate sub_total and vat based on products
  const getTotal = useCallback(() => {
    let sub_total = 0;
    let vat = 0;
    context?.products.forEach((product: Product) => {
      const quantity = product.unit || 0;
      sub_total += product.price * quantity;
      vat += ((product.price * product.vat) / 100) * quantity;
    });
    setInvoice(prevInvoice => ({
      ...prevInvoice,
      sub_total,
      vat,
    }));
  }, [context?.products]);

  // Recalculate sub_total and vat whenever products change
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
  }, [invoice]);

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

  // Calculate round_off and total_amount whenever sub_total, discount, or vat changes
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
  }, [invoice.sub_total, invoice.calculated_discount, invoice.vat, invoice]);

  return (
    <>
      <div className="w-full">
        {/* Bill Details */}
        <div className="flex justify-between mb-4 w-full">
          <div className="flex flex-col flex-grow min-w-0 space-y-2">
            <div className="flex items-center">Sub Total:</div>
            <div className="flex items-center">Discount:</div>
            <div className="flex items-center">VAT:</div>
            <div className="flex items-center">Round Off:</div>
          </div>
          <div className="flex flex-col items-end min-w-max space-y-2">
            <div className="flex items-center">
              {invoice.sub_total.toFixed(2)} &#2547;
            </div>
            <div className="flex items-center gap-1">
              -
              <input
                onChange={handleDiscount}
                type="number"
                className="appearance-none w-20 p-2 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={invoice.discount_value}
                placeholder={
                  invoice.discount_type === 'percentage' ? '0%' : '0৳'
                }
              />
              <Select
                onChange={e =>
                  setInvoice(prevInvoice => ({
                    ...prevInvoice,
                    discount_type:
                      e?.value === 'percentage' ? 'percentage' : 'fixed',
                    discount_value: 0,
                  }))
                }
                classNamePrefix="react-select"
                value={discountTypes.find(
                  option => option.value === invoice.discount_type,
                )}
                name="discount_type"
                options={discountTypes}
              />
            </div>
            <div className="flex items-center">
              {invoice.vat.toFixed(2)} &#2547;
            </div>
            <div className="flex items-center">
              {invoice.round_off.toFixed(2)} &#2547;
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Total Amount Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold text-lg">Total Amount:</div>
          <div className="font-bold text-lg">
            {Number(invoice.total_amount.toFixed(2)) || 0} &#2547;
          </div>
        </div>

        <hr className="my-4" />

        {/* Payment Section */}
        <div className="flex justify-between w-full">
          <div className="flex flex-col flex-grow min-w-0 space-y-4">
            <div className="font-semibold">Payment Method:</div>
            <div className="font-semibold">Paid Amount:</div>
          </div>
          <div className="flex flex-col items-end min-w-max space-y-4">
            <Select
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
            <input
              onChange={e =>
                setInvoice(prevInvoice => ({
                  ...prevInvoice,
                  paid_amount: parseFloat(e.target.value) || 0,
                }))
              }
              type="number"
              placeholder="Enter an amount in Taka"
              className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-2.5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
        </div>
      </div>

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
