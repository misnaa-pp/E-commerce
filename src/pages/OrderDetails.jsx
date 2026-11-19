
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { fetchOrderById } from "../redux/slices/orderSlice";

function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedOrder, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  // Match the backend OrderId property
  const order =
    selectedOrder?.orderId?.toString() === id
      ? selectedOrder
      : null;

  // Tracking steps
  const trackingSteps = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const status = String(order?.orderStatus || "Pending").toLowerCase();

  const isCancelled = status === "cancelled";

  const statusAliases = {
    pending: 0,
    processing: 1,
    confirmed: 1,
    shipped: 2,
    "out for delivery": 2,
    delivered: 3,
  };

  const currentStep = statusAliases[status] ?? 0;

  // Convert backend image URL
  const getProductImage = (imageUrl) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    const apiUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

    return `${apiUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  // Loading
  if (loading && !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f3ec]">
        <p className="text-sm tracking-widest text-[#765e4e]">
          LOADING ORDER DETAILS...
        </p>
      </main>
    );
  }

  // Order not found
  if (error || !order) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8f3ec] px-6 text-center">
        <h2 className="font-serif text-2xl text-[#3d2415]">
          Order not found
        </h2>

        <p className="mt-3 text-sm text-[#765e4e]">
          We couldn't find the requested order.
        </p>

        <Link
          to="/orders"
          className="mt-6 border border-[#6b3f22] px-6 py-3 text-xs tracking-widest text-[#6b3f22] hover:bg-[#6b3f22] hover:text-white"
        >
          BACK TO MY ORDERS
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec] px-5 py-12 sm:px-10">
      <div className="mx-auto max-w-4xl">

        {/* Back Button */}
        <Link
          to="/orders"
          className="text-xs tracking-widest text-[#765e4e] hover:text-[#3d2415]"
        >
          ← BACK TO MY ORDERS
        </Link>

        {/* Page Heading */}
        <div className="mb-10 mt-8">
          <h1 className="font-serif text-3xl text-[#3d2415] sm:text-4xl">
            Order Details
          </h1>

          <p className="mt-3 text-sm text-[#765e4e]">
            Order #{order.orderId}
          </p>

          <p className="mt-1 text-xs text-[#8a7565]">
            Placed on{" "}
            {order.orderDate
              ? new Date(order.orderDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Date unavailable"}
          </p>
        </div>

        {/* Order Tracking */}
        <section className="mb-8 border border-[#e5ded4] bg-[#fffdf9] p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-[#3d2415]">
            Track Your Order
          </h2>

          <p className="mt-2 text-sm text-[#8a7565]">
            Follow your order's progress.
          </p>

          {isCancelled ? (
            <div className="mt-7 border border-red-200 bg-red-50 p-5">
              <p className="font-medium text-red-700">
                Order Cancelled
              </p>

              <p className="mt-2 text-sm text-red-600">
                This order has been cancelled.
              </p>
            </div>
          ) : (
            <div className="mt-10">

              {/* Desktop Tracking Timeline */}
              <div className="hidden sm:block">
                <div className="relative flex justify-between">

                  <div className="absolute left-0 right-0 top-4 h-[2px] bg-[#e5ded4]" />

                  <div
                    className="absolute left-0 top-4 h-[2px] bg-[#79563d] transition-all"
                    style={{
                      width: `${(currentStep / 3) * 100}%`,
                    }}
                  />

                  {trackingSteps.map((step, index) => {
                    const completed = index <= currentStep;

                    return (
                      <div
                        key={step}
                        className="relative z-10 flex w-1/4 flex-col items-center text-center"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs ${
                            completed
                              ? "border-[#79563d] bg-[#79563d] text-white"
                              : "border-[#d8cabc] bg-[#fffdf9] text-[#8a7565]"
                          }`}
                        >
                          {completed ? "✓" : index + 1}
                        </div>

                        <p
                          className={`mt-3 text-xs ${
                            completed
                              ? "font-medium text-[#3d2415]"
                              : "text-[#a89585]"
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Tracking Timeline */}
              <div className="space-y-5 sm:hidden">
                {trackingSteps.map((step, index) => {
                  const completed = index <= currentStep;

                  return (
                    <div
                      key={step}
                      className="flex items-center gap-4"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                          completed
                            ? "border-[#79563d] bg-[#79563d] text-white"
                            : "border-[#d8cabc] text-[#8a7565]"
                        }`}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      <p
                        className={`text-sm ${
                          completed
                            ? "font-medium text-[#3d2415]"
                            : "text-[#a89585]"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-[#e5ded4] pt-5">
                <p className="text-xs tracking-widest text-[#8a7565]">
                  CURRENT STATUS
                </p>

                <p className="mt-2 font-medium capitalize text-[#6b3f22]">
                  {order.orderStatus}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Ordered Products */}
        <section className="mb-8 border border-[#e5ded4] bg-[#fffdf9] p-6 sm:p-8">
          <h2 className="mb-5 font-serif text-2xl text-[#3d2415]">
            Ordered Items
          </h2>

          <div className="divide-y divide-[#e5ded4]">
            {order.items?.map((item, index) => (
              <div
                key={`${item.productId}-${index}`}
                className="flex gap-4 py-5"
              >
                <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#eee6dc]">
                  {item.imageUrl ? (
                    <img
                      src={getProductImage(item.imageUrl)}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#8a7565]">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="text-sm text-[#3d2415]">
                    {item.productName}
                  </h3>

                  <p className="mt-1 text-xs text-[#8a7565]">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-1 text-xs text-[#8a7565]">
                    Unit Price: ₹
                    {Number(item.unitPrice).toLocaleString("en-IN")}
                  </p>

                  <p className="mt-2 text-sm text-[#765e4e]">
                    Subtotal: ₹
                    {Number(item.subTotal).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment and Price Summary */}
        <section className="border border-[#e5ded4] bg-[#fffdf9] p-6 sm:p-8">
          <h2 className="mb-5 font-serif text-2xl text-[#3d2415]">
            Payment Summary
          </h2>

          <div className="space-y-3 text-sm text-[#765e4e]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                ₹{Number(order.subTotal || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                ₹{Number(order.shippingCharge || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between border-t border-[#e5ded4] pt-4 text-base font-medium text-[#3d2415]">
              <span>Total</span>
              <span>
                ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <span>Payment Method</span>
              <span>{order.paymentMethod || "N/A"}</span>
            </div>

            <div className="flex justify-between">
              <span>Payment Status</span>
              <span>{order.paymentStatus || "Pending"}</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

export default OrderDetails;
