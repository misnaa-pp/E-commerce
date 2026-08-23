import React from 'react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

import {useSearchParams,} from "react-router-dom";

function Products() {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category"); 

  const { products, loading, error } = useSelector((state) => state.products);

  const filteredProducts = products.filter((product) => {
  if (!categoryFromUrl) {
    return true;
  }

  return product.category === categoryFromUrl;
});

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;

  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f3ec]">
        <p className="text-sm tracking-widest text-[#765e4e]">
          LOADING...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f3ec]">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec]">

      <section className="px-6 pb-10 pt-14 text-center sm:px-10 lg:px-16">
        <p className="text-s tracking-[0.3em] text-[#765039]">
          INARAH COLLECTIONS
        </p>
      </section>

  
      <section className="px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div className="flex gap-6 text-xs tracking-wider text-[#765e4e]">
            <button className="text-[#3d2415]">
              ALL
            </button>

            <button className="hover:text-[#3d2415]">
              GIRLS
            </button>

            <button className="hover:text-[#3d2415]">
              BOYS
            </button>

            <button className="hover:text-[#3d2415]">
              KIDS
            </button>
          </div>

          <p className="hidden text-xs text-[#8a7565] sm:block">
            {products.length} PRODUCTS
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16">

        {currentProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#765e4e]">
              No products available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">

            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </section>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 pb-16">

          <button
            onClick={() =>
              setCurrentPage((page) => page - 1)
            }
            disabled={currentPage === 1}
            className="text-xs tracking-wider text-[#765e4e] transition hover:text-[#3d2415] disabled:cursor-not-allowed disabled:opacity-30"
          > ← PREV </button>

          <span className="text-xs tracking-wider text-[#3d2415]">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((page) => page + 1)
            }
            disabled={currentPage === totalPages}
            className="text-xs tracking-wider text-[#765e4e] transition hover:text-[#3d2415] disabled:cursor-not-allowed disabled:opacity-30"
          > NEXT → </button>

        </div>
      )}

    </main>
  );
}

export default Products;