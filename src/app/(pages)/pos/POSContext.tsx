import { Types } from 'mongoose';
import React, { createContext } from 'react';

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
  setCustomer: (customer: CustomerType) => void;
  setProducts: (products: ProductType[]) => void;
  setSearch: (search: string) => void;
  insertProduct: (product: ProductType) => void;
  removeProduct: (product: ProductType['batch']) => void;
};

const POSContext = createContext<POSContextType | null>(null);

function POStContextProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = React.useState('');
  const [products, setProducts] = React.useState<ProductType[]>([]);
  const [customer, setCustomer] = React.useState<CustomerType>();

  const insertProduct = (product: ProductType) => {
    setProducts([...products, product]);
  };

  const removeProduct = (batch: ProductType['batch']) => {
    setProducts(products.filter(p => p.batch !== batch));
  };

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  const updateProducts = (products: ProductType[]) => {
    setProducts(products);
  };

  const updateCustomer = (customer: CustomerType) => {
    setCustomer(customer);
  };

  return (
    <POSContext.Provider
      value={{
        search,
        products,
        customer,
        setCustomer: updateCustomer,
        setProducts: updateProducts,
        setSearch: updateSearch,
        insertProduct,
        removeProduct,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export { POSContext, POStContextProvider };
