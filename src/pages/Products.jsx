import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

function Products() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = 8;
  const categoryFromUrl = searchParams.get("category");

  const {
    products,
    loading,
    error,
    totalCount,
    totalPages
  } = useSelector((state) => state.products);
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !categoryFromUrl ||
      categoryFromUrl === "all" ||
      product.category?.toLowerCase() === categoryFromUrl.toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setVisibleCount(8);
  }, [categoryFromUrl]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300;

      if (nearBottom && visibleCount < filteredProducts.length) {
        setVisibleCount((count) => count + 8);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visibleCount, filteredProducts.length]);


  useEffect(() => {
    dispatch(fetchProducts({
      search: appliedSearch,
      category:
        categoryFromUrl && categoryFromUrl !== "all"
          ? categoryFromUrl
          : undefined,
      pageNumber,
      pageSize
    }));
  }, [dispatch, appliedSearch, categoryFromUrl, pageNumber]);



  const handleSearch = () => {
    setPageNumber(1);
    setAppliedSearch(searchTerm.trim());
  };

  const handleCategoryChange = (category) => {
    setPageNumber(1);

    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

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

        <div className="mx-auto mb-6 flex max-w-7xl justify-end px-6">
          <div className="flex w-full max-w-sm">

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#cbbcaf] bg-transparent px-4 py-2 text-sm text-[#3d2415] outline-none placeholder:text-[#9b897b] focus:border-[#765039]"
            />

            <button
              onClick={handleSearch}
              className="bg-[#3d2415] px-5 py-2 text-xs tracking-wider text-white transition hover:bg-[#765039]"
            >
              SEARCH
            </button>

          </div>
        </div>
        <p className="text-sm tracking-[0.3em] text-[#765039]">
          INARAH COLLECTIONS
        </p>
      </section>

      <section className="px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div className="flex gap-6 text-xs tracking-wider text-[#765e4e]">

            <button
              onClick={() => handleCategoryChange("all")}
              className={!categoryFromUrl || categoryFromUrl === "all"
                ? "text-[#3d2415]"
                : "hover:text-[#3d2415]"}
            >
              ALL
            </button>

            <button
              onClick={() => handleCategoryChange("girls")}
              className={categoryFromUrl === "girls"
                ? "text-[#3d2415]"
                : "hover:text-[#3d2415]"}
            >
              GIRLS
            </button>

            <button
              onClick={() => handleCategoryChange("boys")}
              className={categoryFromUrl === "boys"
                ? "text-[#3d2415]"
                : "hover:text-[#3d2415]"}
            >
              BOYS
            </button>

            <button
              onClick={() => handleCategoryChange("kids")}
              className={categoryFromUrl === "kids"
                ? "text-[#3d2415]"
                : "hover:text-[#3d2415]"}
            >
              KIDS
            </button>

          </div>


          <p className="hidden text-xs text-[#8a7565] sm:block">
            {totalCount} PRODUCTS
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16">

        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#765e4e]">
              No products available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {visibleCount < filteredProducts.length && (
          <div className="py-10 text-center">
            <p className="text-xs tracking-widest text-[#765e4e]">
              LOADING MORE...
            </p>
          </div>
        )}


        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 py-10">

            <button
              disabled={pageNumber === 1 || loading}
              onClick={() => setPageNumber(prev => prev - 1)}
              className="text-sm text-[#765e4e] disabled:opacity-30"
            >
              PREVIOUS
            </button>

            <span className="text-sm text-[#3d2415]">
              Page {pageNumber} of {totalPages}
            </span>

            <button
              disabled={pageNumber === totalPages || loading}
              onClick={() => setPageNumber(prev => prev + 1)}
              className="text-sm text-[#765e4e] disabled:opacity-30"
            >
              NEXT
            </button>

          </div>
        )}


      </section>

    </main>
  );
}

export default Products;