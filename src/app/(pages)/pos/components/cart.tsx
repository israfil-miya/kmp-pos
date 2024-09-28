import React, { useContext } from 'react';
import { POSContext, ProductType } from '../POSContext';

function Cart() {
  let context = useContext(POSContext);

  return (
    <>
      <div className="table-responsive text-nowrap text-sm">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="font-bold align-middle text-center">S/N</th>
              <th className="font-bold align-middle text-center">Batch</th>
              <th className="font-bold align-middle text-center">Name</th>
              <th className="font-bold align-middle text-center">Unit</th>
              <th className="font-bold align-middle text-center">
                <div className="flex-col flex">
                  <p>Price/Unit</p>
                </div>
              </th>
              <th className="font-bold align-middle text-center">VAT/Unit</th>
              <th className="font-bold align-middle text-center">Subtotal</th>
              <th className="font-bold align-middle text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {context?.products.length !== 0 ? (
              context?.products.map((product: ProductType, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="capitalize">{product.batch}</td>
                  <td className="capitalize">{product.name}</td>
                  <td className="capitalize">
                    <input
                      className="appearance-none w-8 bg-gray-50 p-1 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      value={product.unit}
                    />
                    {' / ' + product.quantity}
                  </td>
                  <td className="capitalize">{product.price}&#2547;</td>
                  <td className="capitalize">{product.vat}%</td>
                  <td className="capitalize">
                    {Number(
                      Math.round(
                        parseFloat(
                          product.price * 1 +
                            ((product.price * product.vat) / 100) * 1 +
                            'e' +
                            2,
                        ),
                      ) +
                        'e-' +
                        2,
                    ).toFixed(2)}
                    &#2547;
                  </td>
                  <td
                    className="text-center"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <button
                      onClick={() => context?.removeProduct(product.batch)}
                      className="rounded-sm bg-red-600 hover:opacity-90 hover:ring-2 hover:ring-red-600 transition duration-200 delay-300 hover:text-opacity-100 text-white p-2 items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr key={0}>
                <td colSpan={8} className="align-center text-center">
                  No products in cart!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Cart;
