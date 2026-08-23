import React from 'react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import { fetchProductById } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { addToWishlist } from "../redux/slices/wishlistSlice";

function ProductDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f3ec]">
        <p className="text-xs tracking-[0.25em] text-[#765e4e]">
          LOADING...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8f3ec]">

        <p className="text-sm text-[#765e4e]">
          {error}
        </p>

        <Link
          to="/products"
          className="mt-6 border border-[#6b3f22] px-6 py-3 text-xs tracking-widest text-[#6b3f22]"
        >
          BACK TO COLLECTION
        </Link>

      </main>
    );
  }

  if (!selectedProduct) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f3ec]">
        <p className="text-sm text-[#765e4e]">
          Product not found.
        </p>
      </main>
    );
  }

  const product = selectedProduct;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
      })
    );
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f3ec]">

      <div className="mx-auto max-w-7xl px-6 pt-8 sm:px-10 lg:px-16">

        <Link
          to="/products"
          className="text-xs tracking-wider text-[#765e4e] transition hover:text-[#3d2415]"
        >
          ← BACK TO COLLECTION
        </Link>

      </div>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-16 lg:py-16">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">

          <div className="bg-[#eee6dc]">

            <div className="aspect-[4/5] overflow-hidden">

              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover" />
            </div>

          </div>


          <div className="flex flex-col justify-center">

            <p className="text-xs tracking-[0.25em] text-[#765039]">
              {product.category || "KIDSWEAR"}
            </p>

            <p className="mt-5 text-lg text-[#765e4e]">
              ₹{product.price}
            </p>

            <div className="my-7 border-t border-[#e5ded4]" />


            <p className="max-w-lg text-sm leading-7 text-[#765e4e]">
              {product.description ||
                "Thoughtfully selected for little ones, with comfort, quality and everyday adventures in mind."}
            </p>

            <p className="mt-5 text-xs tracking-wide text-[#8a7565]">
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </p>

            {product.stock > 0 && (
              <div className="mt-7">

                <p className="mb-3 text-xs tracking-widest text-[#765e4e]">
                  QUANTITY
                </p>

                <div className="flex w-fit items-center border border-[#d8cabc]">

                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                    className="px-4 py-3 text-[#6b3f22] transition hover:bg-[#eee6dc] disabled:opacity-30"
                  > − </button>

                  <span className="px-5 text-sm text-[#3d2415]">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    disabled={quantity === product.stock}
                    className="px-4 py-3 text-[#6b3f22] transition hover:bg-[#eee6dc] disabled:opacity-30"
                  > + </button>

                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="mt-8 w-full bg-[#6b3f22] px-6 py-4 text-xs font-medium tracking-[0.15em] text-white transition hover:bg-[#4e2d19] disabled:cursor-not-allowed disabled:bg-[#b9aa9d]"
            >
              {product.stock > 0
                ? "ADD TO CART"
                : "OUT OF STOCK"}
            </button>

            <button
              onClick={() =>
                dispatch(addToWishlist(product))
              }
              className="mt-4 w-full border border-[#6b3f22] px-6 py-4 text-xs font-medium tracking-[0.15em] text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white"
            >
               ADD TO WISHLIST
            </button>


            <div className="mt-10 border-t border-[#e5ded4]">

              <div className="border-b border-[#e5ded4] py-5">
                <p className="text-xs tracking-wider text-[#3d2415]">
                  PRODUCT DETAILS
                </p>

                <p className="mt-3 text-sm leading-6 text-[#765e4e]">
                  Carefully selected kidswear designed with
                  comfort and everyday wear in mind.
                </p>

              </div>


              <div className="py-5">

                <p className="text-xs tracking-wider text-[#3d2415]">
                  SHIPPING & RETURNS
                </p>

                <p className="mt-3 text-sm leading-6 text-[#765e4e]">
                  Easy delivery and hassle-free returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;