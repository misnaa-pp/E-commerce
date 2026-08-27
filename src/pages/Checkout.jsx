import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { placeOrder } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const { loading, error } = useSelector((state) => state.orders);

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

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 1000 ? 0 : 50;

  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      customer: formData,
      paymentMethod,
      items: cartItems,
      subtotal,
      shipping,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      await dispatch(placeOrder(orderData)).unwrap();

      dispatch(clearCart());

      navigate("/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f3ec]">
        <section className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
          <h1 className="font-serif text-4xl text-[#3d2415] sm:text-5xl">
            Checkout
          </h1>
        </section>

        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 text-center">
          <h2 className="font-serif text-3xl text-[#3d2415]">
            Your cart is empty
          </h2>

          <p className="mt-3 text-sm text-[#765e4e]">
            Add some products to your cart before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="mt-7 border border-[#6b3f22] px-7 py-3 text-xs font-medium tracking-widest text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white"
          >
            EXPLORE COLLECTION
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec]">
      <section className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl text-[#3d2415] sm:text-5xl">
          Checkout
        </h1>

        <p className="mt-3 text-sm text-[#765e4e]">
          Complete your order details below.
        </p>
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
                    required
                    rows="4"
                    className="w-full resize-none border border-[#d8cabc] bg-transparent px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]"
                  />
                </div>

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

                  <div>
                    <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                      PINCODE
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      required
                      className="w-full border border-[#d8cabc] bg-transparent px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]"
                    />
                  </div>
                </div>

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

            <aside className="h-fit bg-[#E8DDD0] p-7 sm:p-8 lg:sticky lg:top-8">
              <h2 className="font-serif text-2xl text-[#3d2415]">
                Your Order
              </h2>

              <div className="mt-7 space-y-5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#eee6dc]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />

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

              {error && (
                <div className="mt-5 border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

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