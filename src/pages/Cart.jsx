
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + shipping;

  // Remove product with confirmation
  const handleRemove = (item) => {
    const productName = item.name || item.title || "this product";

    const confirmed = window.confirm(
      `Are you sure you want to remove ${productName} from your cart?`
    );

    if (confirmed) {
      dispatch(removeFromCart(item.id));
      toast.success("Product removed from cart");
    }
  };

  // Increase quantity with stock validation
  const handleIncrease = (item) => {
    if (item.quantity >= item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }

    dispatch(increaseQuantity(item.id));
    toast.success("Quantity increased");
  };

  // Decrease quantity
  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      toast.error("Minimum quantity is 1");
      return;
    }

    dispatch(decreaseQuantity(item.id));
    toast.success("Quantity decreased");
  };

  return (
    <main className="min-h-screen bg-[#f8f3ec]">
      <section className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl text-[#3d2415] sm:text-5xl">
          Your Cart
        </h1>
      </section>

      {cartItems.length === 0 ? (
        <section className="flex flex-col items-center px-6 pb-24 text-center">
          <h2 className="mt-5 font-serif text-2xl text-[#3d2415]">
            Your cart is empty
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-[#765e4e]">
            Discover something lovely for your little one.
          </p>

          <Link
            to="/products"
            className="mt-7 border border-[#6b3f22] px-7 py-3 text-xs font-medium tracking-widest text-[#6b3f22] transition hover:bg-[#6b3f22] hover:!text-white"
          >
            EXPLORE COLLECTION
          </Link>
        </section>
      ) : (
        <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10">
          <div className="mb-6 border-b border-[#e5ded4] pb-4">
            <p className="text-xs tracking-[0.2em] text-[#765e4e]">
              {cartItems.length}{" "}
              {cartItems.length === 1 ? "ITEM" : "ITEMS"}
            </p>
          </div>

          <div className="flex flex-col">
            {cartItems.map((item) => {
              const productImage = Array.isArray(item.images)
                ? item.images[0]
                : item.images || item.image;

              const productName = item.name || item.title || "Product";

              return (
                <div
                  key={item.id}
                  className="flex gap-5 border-b border-[#e5ded4] py-6"
                >
                  <div className="h-32 w-24 shrink-0 overflow-hidden bg-[#eee6dc] sm:h-40 sm:w-32">
                    <img
                      src={productImage}
                      alt={productName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="text-sm text-[#3d2415]">
                          {productName}
                        </h3>

                        <p className="mt-1 text-sm text-[#765e4e]">
                          ₹{item.price}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemove(item)}
                        className="text-xs tracking-wide text-[#8a7565] transition hover:text-red-600"
                      >
                        REMOVE
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center border border-[#d8cabc]">
                        <button
                          onClick={() => handleDecrease(item)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-2 text-sm text-[#6b3f22] transition hover:bg-[#eee6dc] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="px-3 text-sm text-[#3d2415]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleIncrease(item)}
                          disabled={item.quantity >= item.stock}
                          className="px-3 py-2 text-sm text-[#6b3f22] transition hover:bg-[#eee6dc] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm text-[#765e4e]">
                        ₹{Number(item.price) * Number(item.quantity)}
                      </p>
                    </div>

                    <p className="mt-2 text-xs text-[#8a7565]">
                      {item.stock} available in stock
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="mt-10 bg-[#E8DDD0] p-7 sm:p-8">
            <h2 className="font-serif text-2xl text-[#3d2415]">
              Order Summary
            </h2>

            <div className="mt-7 space-y-4 text-sm">
              <div className="flex justify-between text-[#765e4e]">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-[#765e4e]">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-[#765e4e]">
                  Add ₹{1000 - subtotal} more to get free shipping.
                </p>
              )}
            </div>

            <div className="my-6 border-t border-[#cdbdad]" />

            <div className="flex justify-between text-[#3d2415]">
              <span className="text-sm font-medium">Total</span>

              <span className="text-lg font-medium">
                ₹{total}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-7 block w-full bg-[#6b3f22] px-5 py-4 text-center text-xs font-medium tracking-[0.15em] !text-white transition hover:bg-[#4e2d19]"
            >
              PROCEED TO CHECKOUT →
            </Link>

            <Link
              to="/products"
              className="mt-5 block text-center text-xs tracking-wide text-[#765e4e] transition hover:text-[#3d2415]"
            >
              ← CONTINUE SHOPPING
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default Cart;
