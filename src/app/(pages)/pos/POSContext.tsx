import { Types } from 'mongoose';
import React, { createContext, Dispatch } from 'react';

export type ProductType = {
  id: Types.ObjectId;
  batch: string;
  name: string;
  price: number;
  vat: number;
  unit: number; // Quantity of the product in the cart
  quantity: number; // Available quantity
};

export type CustomerType = {
  name: string;
  phone: string;
  address: string;
};

export type POSContextType = {
  search: string;
  products: ProductType[];
  customer?: CustomerType;
  setCustomer: Dispatch<React.SetStateAction<CustomerType>>;
  updateProduct: (updatedProduct: ProductType) => void;
  setSearch: Dispatch<React.SetStateAction<string>>;
  insertProduct: (product: ProductType) => void;
  removeProduct: (product: ProductType['batch']) => void;
};

const POSContext = createContext<POSContextType | null>(null);

function POStContextProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = React.useState('');
  const [products, setProducts] = React.useState<ProductType[]>([]);
  const [customer, setCustomer] = React.useState<CustomerType>({
    name: '',
    phone: '',
    address: '',
  });

  const insertProduct = (product: ProductType) => {
    setProducts([...products, product]);
  };

  const removeProduct = (batch: ProductType['batch']) => {
    setProducts(products.filter(p => p.batch !== batch));
  };

  const updateProduct = (updatedProduct: ProductType) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.batch === updatedProduct.batch
          ? { ...product, ...updatedProduct }
          : product,
      ),
    );
  };

  return (
    <POSContext.Provider
      value={{
        search,
        products,
        customer,
        setCustomer: setCustomer,
        updateProduct,
        setSearch: setSearch,
        insertProduct,
        removeProduct,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export { POSContext, POStContextProvider };
