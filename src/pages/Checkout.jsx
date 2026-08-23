import React from 'react';

import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity,0);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Order Details:", {
      customer: formData,
      paymentMethod,
      items: cartItems,
      total,
    });
  };

  
  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8f3ec] px-6 text-center">

        <h1 className="font-serif text-3xl text-[#3d2415]">
          Your cart is empty
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-6 text-[#765e4e]">
          Add some beautiful pieces to your cart before
          proceeding to checkout.
        </p>

        <Link
          to="/products"
          className="mt-7 border border-[#6b3f22] px-7 py-3 text-xs font-medium tracking-widest text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white"
        >
          EXPLORE COLLECTION
        </Link>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec]">

      <section className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl text-[#3d2415] sm:text-5xl">
          Checkout
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-16">

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">

            <div>
              <h2 className="font-serif text-2xl text-[#3d2415]">
                Delivery Details
              </h2>
              <p className="mt-2 text-sm text-[#765e4e]">
                Please enter your delivery information.
              </p>
          
              <div className="mt-8 space-y-6">
                <div>
                  <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                    FULL NAME
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="w-full border border-[#d8cabc] bg-transparent px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                      EMAIL
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full border border-[#d8cabc] bg-transparent px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                      PHONE
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      required
                      className="w-full border border-[#d8cabc] bg-transparent px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]"
                    />
                  </div>

                </div>

                <div>
                  <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                    ADDRESS
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House name, street, landmark..."
                    rows="4"
                    required
                    className="w-full resize-none border border-[#d8cabc] bg-transparent px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                      CITY
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                      className="w-full border border-[#d8cabc] bg-transparent px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                      STATE
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                      className="w-full border border-[#d8cabc] bg-transparent px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]"
                    />
                  </div>
                </div>

                <div>

                  <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                    PINCODE
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    required
                    className="w-full border border-[#d8cabc] bg-transparent px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]"
                  />

                </div>
              </div>


              <div className="mt-12">

                <h2 className="font-serif text-2xl text-[#3d2415]">
                  Payment Method
                </h2>

                <div className="mt-6 space-y-3">

                  <label className="flex cursor-pointer items-center gap-4 border border-[#d8cabc] bg-[#fffdf9] p-4">

                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="accent-[#6b3f22]"
                    />

                    <div>
                      <p className="text-sm text-[#3d2415]">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-xs text-[#8a7565]">
                        Pay when your order arrives.
                      </p>
                    </div>

                  </label>

                  <label className="flex cursor-pointer items-center gap-4 border border-[#d8cabc] bg-[#fffdf9] p-4">

                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="accent-[#6b3f22]"
                    />
                    <div>
                      <p className="text-sm text-[#3d2415]">
                        Online Payment
                      </p>
                      <p className="mt-1 text-xs text-[#8a7565]">
                        UPI, card or net banking.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <aside className="h-fit bg-[#E8DDD0] p-7 sm:p-8 lg:sticky lg:top-8">

              <h2 className="font-serif text-2xl text-[#3d2415]">
                Your Order
              </h2>

              <div className="mt-7 space-y-5">
                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4">

                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#eee6dc]">

                      <img src={item.image} alt={item.title} className="h-full w-full object-cover"/>

                      <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6b3f22] px-1 text-[10px] text-white">
                        {item.quantity}
                      </span>

                    </div>

                    <div className="flex flex-1 justify-between gap-3">

                      <div>
                        <p className="text-sm text-[#3d2415]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-[#8a7565]">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm text-[#765e4e]">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-7 border-t border-[#cdbdad]" />

              <div className="space-y-4 text-sm">

                <div className="flex justify-between text-[#765e4e]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-[#765e4e]">
                  <span>Shipping</span>
                  <span>FREE</span>
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

              <button
                type="submit"
                className="mt-7 w-full bg-[#6b3f22] px-5 py-4 text-xs font-medium tracking-[0.15em] text-white transition hover:bg-[#4e2d19]"
              >
                PLACE ORDER →
              </button>

              <Link
                to="/cart"
                className="mt-5 block text-center text-xs tracking-wide text-[#765e4e] transition hover:text-[#3d2415]"
              >
                ← BACK TO CART
              </Link>
            </aside>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Checkout;