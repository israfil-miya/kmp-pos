import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ProductDataTypes } from '../../products/schema';
import { POSContext, ProductType } from '../POSContext';
import { getAllProductsFiltered as getAllProductsFilteredAction } from '../actions';

function SearchedProducts() {
  let context = useContext(POSContext);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllProductsFiltered = useCallback(async (): Promise<void> => {
    try {
      // setLoading(true);

      let response = await getAllProductsFilteredAction({
        filters: {
          searchText: context?.search || '',
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

          // Filter out products with batch codes that exist in the context.products
          parsedMessage = parsedMessage.filter(
            p =>
              !context?.products.some(
                ctxProduct => ctxProduct.batch === p.batch,
              ),
          );
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
            batch: product.batch,
            name: product.name,
            price: product.selling_price,
            vat: product.vat_rate,
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
  }, [context?.search, context?.products]);

  const updateCart = (product: ProductType) => {
    console.log('Insert func called');
    context?.insertProduct(product);
    setProducts(products.filter(p => p.batch !== product.batch));
  };

  useEffect(() => {
    if (context?.search) {
      getAllProductsFiltered();
    }
  }, [context?.search, getAllProductsFiltered]);

  if (loading) return <p className="text-center">Loading...</p>;

  if (!loading && !context?.search)
    return <p className="text-center">Start typing to search...</p>;

  return (
    <div>
      {products.length ? (
        <div>
          {products.map((product, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <div>
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-500">{product.price}</p>
              </div>
              <div>
                <button
                  className="bg-gray-200 px-2 py-1 rounded-lg"
                  onClick={() => {
                    updateCart(product);
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No products found</p>
      )}
    </div>
  );
}

export default SearchedProducts;
