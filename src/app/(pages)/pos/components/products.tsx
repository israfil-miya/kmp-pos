import { Types } from 'mongoose';
import { useSession } from 'next-auth/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ProductDataTypes } from '../../products/schema';
import { POSContext, ProductType } from '../POSContext';
import { getAllProductsFiltered as getAllProductsFilteredAction } from '../actions';

function SearchedProducts() {
  let context = useContext(POSContext);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const getAllProductsFiltered = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      console.log('store', session?.user);

      let response = await getAllProductsFilteredAction({
        filters: {
          searchText: context?.search || '',
          store: session?.user.store || '',
        },
      });
      if (response.error) {
        if (response?.message !== '') {
          toast.error(response.message);
        }
      } else if (response?.message !== '') {
        let parsedMessage: ProductDataTypes[];

        try {
          parsedMessage = JSON.parse(response.message) as ProductDataTypes[];

          // // Filter out products with batch codes that exist in the context.products
          // parsedMessage = parsedMessage.filter(
          //   p =>
          //     !context?.products.some(
          //       ctxProduct => ctxProduct.batch === p.batch,
          //     ),
          // );
        } catch (error) {
          console.error(
            'Failed to parse response message as ProductType:',
            error,
          );
          return;
        }

        let products: ProductType[] = [];

        for (let i = 0; i < parsedMessage.length; i++) {
          let product = parsedMessage[i];

          products.push({
            id: new Types.ObjectId(product._id),
            batch: product.batch,
            name: product.name,
            price: product.selling_price,
            vat: product.vat_rate,
            unit: 1,
            quantity: product.quantity,
          });
        }

        setProducts(products);
        // setLoading(true);
      } else {
        console.log('Nothing was returned from the server');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving products data');
    } finally {
      setLoading(false);
    }
  }, [context?.search, session?.user]);

  const updateCart = (product: ProductType) => {
    // Check if the product with the same batch already exists in the cart
    let productInCart = context?.products.find(p => p.batch === product.batch);

    if (productInCart) {
      let updatedProduct = {
        ...product,
        unit: productInCart.unit + product.unit,
      };

      if (updatedProduct.unit > updatedProduct.quantity) {
        toast.error('Available quantity exceeded!');
        return;
      }

      context?.updateProduct(updatedProduct); // Set the updated array
    } else {
      // If the product doesn't exist, insert it into the cart
      context?.insertProduct(product);
    }
  };

  useEffect(() => {
    if (context?.search) {
      getAllProductsFiltered();
    }
  }, [context?.search, getAllProductsFiltered]);

  if (loading) return <p className="text-center pb-4">Loading...</p>;

  if (!loading && !context?.search)
    return <p className="text-center pb-4">Start typing to search...</p>;

  return (
    <div>
      {products.length ? (
        <div className="table-responsive text-nowrap text-sm select-none">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="font-bold">S/N</th>
                <th className="font-bold">Batch</th>
                <th className="font-bold">Name</th>
                <th className="font-bold">Qty</th>
                <th className="font-bold">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: ProductType, index: number) => (
                <tr
                  key={String(product.id)}
                  className="cursor-pointer"
                  onClick={() => updateCart(product)}
                >
                  <td>{index + 1}</td>
                  <td>{product.batch}</td>
                  <td className="capitalize test-wrap">{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price} ৳</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center pb-4">No products found</p>
      )}
    </div>
  );
}

export default SearchedProducts;
