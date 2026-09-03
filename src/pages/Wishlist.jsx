import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/slices/cartSlice";
import { removeFromWishlist, } from "../redux/slices/wishlistSlice";

function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <main className="min-h-screen bg-[#f8f3ec]">

      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-16">

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="font-serif text-2xl text-[#3d2415]">
              Your wishlist is empty
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#765e4e]">
              Save your favourite pieces here and come back
              whenever you're ready.
            </p>

            <Link
              to="/products"
              className="mt-7 border border-[#6b3f22] px-7 py-3 text-xs font-medium tracking-widest text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white"
            >
              EXPLORE COLLECTION
            </Link>

          </div>
        ) : (
          <>
  
            <div className="mb-8 flex items-center justify-between border-b border-[#e5ded4] pb-4">
              <section className="px-6 pb-10 pt-14 text-center  sm:px-10">

                <h1 className="mt-3 font-serif text-4xl text-[#3d2415] sm:text-5xl">
                  Wishlist
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#765e4e]">
                  The little pieces you've fallen in love with.
                </p>
              </section>
              <p className="text-xs tracking-widest text-[#765e4e]">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "ITEM" : "ITEMS"}
              </p>
            </div>

  
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">

              {wishlistItems.map((product) => (
                <div
                  key={product.id}
                  className="group"
                >

                  <div className="relative aspect-[3/4] overflow-hidden bg-[#eee6dc]">

                    <img
                      src={product.images || product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <button
                      onClick={() =>
                        dispatch(removeFromWishlist(product.id))
                      }
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#fffdf9]/90 text-lg text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white"
                      aria-label="Remove from wishlist"
                    >
                      × </button>

                  </div>

                  <div className="pt-4">

                    <h3 className="text-sm text-[#3d2415]">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-sm text-[#765e4e]">
                      ₹{product.price}
                    </p>

                    <button
                      onClick={() =>
                        dispatch(
                          addToCart({
                            ...product,
                            quantity: 1,
                          })
                        )
                      }
                      className="mt-4 border-b border-[#6b3f22] pb-1 text-xs tracking-wider text-[#6b3f22] transition hover:text-[#3d2415]"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Wishlist;