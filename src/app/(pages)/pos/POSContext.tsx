import React, { createContext } from 'react';

export type ProductType = {
  batch: string;
  name: string;
  price: number;
  vat: number;
  quantity: number;
};

export type POSContextType = {
  search: string;
  products: ProductType[];
  setProducts: (products: ProductType[]) => void;
  setSearch: (search: string) => void;
  insertProduct: (product: ProductType) => void;
  removeProduct: (product: ProductType['batch']) => void;
};

const POSContext = createContext<POSContextType | null>(null);

function POStContextProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = React.useState('');
  const [products, setProducts] = React.useState<ProductType[]>([]);

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

  return (
    <POSContext.Provider
      value={{
        search,
        products,
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
