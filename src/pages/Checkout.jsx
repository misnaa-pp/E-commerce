

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { placeOrder } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart.items);
  const { orders, loading } = useSelector((state) => state.orders);

  // Product received from Buy Now
  const buyNowItem = location.state?.buyNowItem || null;

  // Determine checkout mode
  const isBuyNowCheckout = Boolean(buyNowItem);

  // Select products based on checkout mode
  const checkoutItems = isBuyNowCheckout
    ? [
        {
          ...buyNowItem,
          quantity: buyNowItem.quantity || 1,
        },
      ]
    : cartItems;

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  // Calculate total based on selected checkout items
  const subtotal = checkoutItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + shipping;

  // Validation
  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    const namePattern = /^[\p{L}][\p{L}\s.'-]{1,59}$/u;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phonePattern = /^[6-9]\d{9}$/;
    const pincodePattern = /^\d{6}$/;
    const locationPattern = /^[\p{L}][\p{L}\s.'-]{1,49}$/u;

    if (!name) {
      newErrors.name = "Full name is required.";
    } else if (!namePattern.test(name)) {
      newErrors.name = "Enter a valid name.";
    }

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!phonePattern.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!address) {
      newErrors.address = "Delivery address is required.";
    } else if (address.length < 5) {
      newErrors.address = "Address must contain at least 5 characters.";
    }

    if (!city) {
      newErrors.city = "City is required.";
    } else if (!locationPattern.test(city)) {
      newErrors.city = "Enter a valid city name.";
    }

    if (!state) {
      newErrors.state = "State is required.";
    } else if (!locationPattern.test(state)) {
      newErrors.state = "Enter a valid state name.";
    }

    if (!pincode) {
      newErrors.pincode = "PIN code is required.";
    } else if (!pincodePattern.test(pincode)) {
      newErrors.pincode = "PIN code must contain exactly 6 digits.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "pincode") {
      updatedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkoutItems.length === 0) {
      toast.error("No products available for checkout.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    const orderData = {
      customer: {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
      },
      paymentMethod,
      items: checkoutItems,
      subtotal,
      shipping,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      await dispatch(placeOrder(orderData)).unwrap();

      // Clear cart only for normal cart checkout
      if (!isBuyNowCheckout) {
        dispatch(clearCart());
      }

      toast.success("Your order has been placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Failed to place your order. Please try again.");
    }
  };

  const inputClass = (field) =>
    `w-full border ${
      errors[field] ? "border-red-500" : "border-[#d8cabc]"
    } bg-transparent px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]`;

  const ErrorMessage = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-600">
        {errors[field]}
      </p>
    ) : null;

  // Empty checkout
  if (checkoutItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f3ec]">
        <section className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
          <h1 className="font-serif text-3xl text-[#3d2415]">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm text-[#765e4e]">
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="mt-7 border border-[#6b3f22] px-7 py-3 text-xs tracking-widest text-[#6b3f22] hover:bg-[#6b3f22] hover:text-white"
          >
            EXPLORE COLLECTION
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec]">

      {/* Heading */}
      <section className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl text-[#3d2415] sm:text-5xl">
          Checkout
        </h1>

        <p className="mt-3 text-sm text-[#765e4e]">
          {isBuyNowCheckout
            ? "Complete your purchase."
            : "Complete your order details below."}
        </p>

        <p className="mt-2 text-xs tracking-widest text-[#8a7565]">
          {isBuyNowCheckout ? "BUY NOW CHECKOUT" : "CART CHECKOUT"}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 lg:px-16">

        <form onSubmit={handleSubmit} noValidate>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">

            {/* Delivery Details */}
            <div>

              <h2 className="font-serif text-2xl text-[#3d2415]">
                Delivery Details
              </h2>

              <p className="mt-2 text-sm text-[#765e4e]">
                Please enter your delivery information.
              </p>

              <div className="mt-8 space-y-6">

                {/* Name */}
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
                    autoComplete="name"
                    className={inputClass("name")}
                  />

                  <ErrorMessage field="name" />
                </div>

                {/* Email and Phone */}
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
                      autoComplete="email"
                      className={inputClass("email")}
                    />

                    <ErrorMessage field="email" />
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
                      placeholder="10-digit phone number"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      className={inputClass("phone")}
                    />

                    <ErrorMessage field="phone" />
                  </div>

                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                    ADDRESS
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House name, street, landmark..."
                    autoComplete="street-address"
                    rows="4"
                    className={`${inputClass("address")} resize-none`}
                  />

                  <ErrorMessage field="address" />
                </div>

                {/* City, State, PIN */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">

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
                      autoComplete="address-level2"
                      className={inputClass("city")}
                    />

                    <ErrorMessage field="city" />
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
                      autoComplete="address-level1"
                      className={inputClass("state")}
                    />

                    <ErrorMessage field="state" />
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
                      placeholder="6-digit PIN"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="postal-code"
                      className={inputClass("pincode")}
                    />

                    <ErrorMessage field="pincode" />
                  </div>

                </div>

                {/* Payment */}
                <div>
                  <h2 className="font-serif text-2xl text-[#3d2415]">
                    Payment Method
                  </h2>

                  <div className="mt-5 space-y-4">

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
            </div>

            {/* Order Summary */}
            <aside className="h-fit bg-[#E8DDD0] p-7 sm:p-8 lg:sticky lg:top-8">

              <h2 className="font-serif text-2xl text-[#3d2415]">
                Order Summary
              </h2>

              <div className="mt-7 space-y-5">

                {checkoutItems.map((item, index) => {
                  const image = Array.isArray(item.images)
                    ? item.images[0]
                    : item.images || item.image;

                  return (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex gap-4"
                    >

                      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#eee6dc]">

                        {image && (
                          <img
                            src={image}
                            alt={item.title || item.name}
                            className="h-full w-full object-cover"
                          />
                        )}

                        <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6b3f22] px-1 text-[10px] text-white">
                          {item.quantity}
                        </span>

                      </div>

                      <div className="flex flex-1 justify-between gap-3">

                        <div>
                          <p className="text-sm text-[#3d2415]">
                            {item.title || item.name}
                          </p>

                          <p className="mt-1 text-xs text-[#8a7565]">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm text-[#765e4e]">
                          ₹{Number(item.price) * Number(item.quantity)}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

              <div className="my-7 border-t border-[#cdbdad]" />

              <div className="space-y-4 text-sm">

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

                <div className="border-t border-[#cdbdad] pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-[#3d2415]">
                      Total
                    </span>

                    <span className="text-lg font-semibold text-[#3d2415]">
                      ₹{total}
                    </span>
                  </div>
                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full bg-[#6b3f22] px-6 py-4 text-xs font-medium tracking-widest text-white transition hover:bg-[#4f2d18] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "PLACING ORDER..." : "PLACE ORDER →"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-[#8a7565]">
                By placing your order, you agree to our terms and
                conditions.
              </p>

            </aside>

          </div>
        </form>
      </section>
    </main>
  );
}

export default Checkout;
