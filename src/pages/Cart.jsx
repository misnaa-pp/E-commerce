import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import {removeFromCart,increaseQuantity,decreaseQuantity,} from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity,0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[#f8f3ec]">

      <section className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl text-[#3d2415] sm:text-5xl">Your Cart</h1>
      </section>

      {cartItems.length === 0 ? (
        <section className="flex flex-col items-center px-6 pb-24 text-center">
          <h2 className="mt-5 font-serif text-2xl text-[#3d2415]">
            Your cart is empty
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#765e4e]">
            Discover something lovely for your little one.</p>

          <Link
            to="/products"
            className="mt-7 border border-[#6b3f22] px-7 py-3 text-xs font-medium tracking-widest text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white"
          >
            EXPLORE COLLECTION </Link>
        </section>
      ) : (

        <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10">

          <div>

            <div className="mb-6 border-b border-[#e5ded4] pb-4">
              <p className="text-xs tracking-[0.2em] text-[#765e4e]">
                {cartItems.length}{" "}
                {cartItems.length === 1 ? "ITEM" : "ITEMS"}
              </p>
            </div>

            <div className="flex flex-col">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-5 border-b border-[#e5ded4] py-6">
                  <div className="h-32 w-24 shrink-0 overflow-hidden bg-[#eee6dc] sm:h-40 sm:w-32">

                    <img src={item.images} alt={item.title} className="h-full w-full object-cover"/>
                  </div>

                  <div className="flex flex-1 flex-col justify-between">

                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="text-sm text-[#3d2415]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#765e4e]">
                          ₹{item.price}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          dispatch(removeFromCart(item.id))
                        }
                        className="text-xs tracking-wide text-[#8a7565] transition hover:text-[#6b3f22]">
                        REMOVE
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-[#d8cabc]">

                        <button
                          onClick={() =>
                            dispatch(decreaseQuantity(item.id))
                          }
                          className="px-3 py-2 text-sm text-[#6b3f22] transition hover:bg-[#eee6dc]">
                          − </button>

                        <span className="px-3 text-sm text-[#3d2415]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            dispatch(increaseQuantity(item.id))
                          }
                          className="px-3 py-2 text-sm text-[#6b3f22] transition hover:bg-[#eee6dc]">
                          + </button>
                      </div>

                      <p className="text-sm text-[#765e4e]">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


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
                <span> Shipping </span>
                <span> FREE </span>
              </div>
            </div>


            <div className="my-6 border-t border-[#cdbdad]" />

            <div className="flex justify-between text-[#3d2415]">

              <span className="text-sm font-medium">
                Total
              </span>

              <span className="text-lg font-medium">
                ₹{total}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-7 block w-full bg-[#6b3f22] px-5 py-4 text-center text-xs font-medium tracking-[0.15em] text-white transition hover:bg-[#4e2d19]"
            >PROCEED TO CHECKOUT → </Link>

            <Link
              to="/products"
              className="mt-5 block text-center text-xs tracking-wide text-[#765e4e] transition hover:text-[#3d2415]"
            > ← CONTINUE SHOPPING </Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default Cart;