import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { addToCart } from "../redux/slices/cartSlice";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";

function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // Remove product after confirmation
  const handleRemove = (product) => {
    const productName = product.name || product.title || "this product";

    const confirmed = window.confirm(
      `Are you sure you want to remove "${productName}" from your wishlist?`
    );

    if (confirmed) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Product removed from wishlist!");
    }
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) {
      toast.error("Sorry, this product is out of stock.");
      return;
    }

    dispatch(
      addToCart({
        ...product,
        quantity: 1,
      })
    );

    toast.success("Product added to cart!");
  };

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
              className="mt-7 border border-[#6b3f22] px-7 py-3 text-xs font-medium tracking-widest text-[#6b3f22] transition hover:bg-[#6b3f22] hover:!text-white"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Heading */}
            <div className="mb-8 flex items-center justify-between border-b border-[#e5ded4] pb-4">
              <section className="px-6 pb-10 pt-14 text-center sm:px-10">
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

            {/* Wishlist Products */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {wishlistItems.map((product) => {
                const productName =
                  product.name || product.title || "Product";

                const productImage = Array.isArray(product.images)
                  ? product.images[0]
                  : product.images || product.image;

                return (
                  <div
                    key={product.id}
                    className="group"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#eee6dc]">
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={productImage}
                          alt={productName}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(product)}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#fffdf9]/90 text-lg text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white"
                        aria-label="Remove from wishlist"
                        title="Remove from wishlist"
                      >
                        ×
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="pt-4">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-sm text-[#3d2415] hover:text-[#8b5e3c]">
                          {productName}
                        </h3>
                      </Link>

                      <p className="mt-1 text-sm text-[#765e4e]">
                        ₹{product.price}
                      </p>

                      {/* Stock Status */}
                      {Number(product.stock) > 0 ? (
                        <p className="mt-1 text-xs text-green-700">
                          In Stock
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-red-600">
                          Out of Stock
                        </p>
                      )}

                      {/* Add to Cart */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={Number(product.stock) <= 0}
                        className="mt-4 border-b border-[#6b3f22] pb-1 text-xs tracking-wider text-[#6b3f22] transition hover:text-[#3d2415] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Wishlist;