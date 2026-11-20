
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  fetchOrders,
  cancelOrder,
} from "../redux/slices/orderSlice";

function Orders() {
  const dispatch = useDispatch();
  const [cancellingId, setCancellingId] = useState(null);

  const { orders, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  
  const getProductImage = (imageUrl) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    const apiUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

    return `${apiUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  // Cancel order
  const handleCancelOrder = async (order) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel Order #${order.orderId}?`
    );

    if (!confirmed) return;

    try {
      setCancellingId(order.orderId);

      await dispatch(cancelOrder(order.orderId)).unwrap();

      toast.success("Your order has been cancelled successfully!");

      dispatch(fetchOrders());
    } catch (error) {
      console.error("Cancel order failed:", error);
      toast.error(
        typeof error === "string"
          ? error
          : "Unable to cancel the order. Please try again."
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f3ec]">
        <section className="flex min-h-[500px] items-center justify-center">
          <p className="text-sm tracking-widest text-[#765e4e]">
            LOADING ORDERS...
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f8f3ec]">
        <section className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
          <h2 className="font-serif text-2xl text-[#3d2415]">
            Something went wrong
          </h2>

          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => dispatch(fetchOrders())}
            className="mt-6 border border-[#6b3f22] px-6 py-3 text-xs tracking-widest text-[#6b3f22] hover:bg-[#6b3f22] hover:text-white"
          >
            TRY AGAIN
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec]">

      {/* Page Heading */}
      <section className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl text-[#3d2415] sm:text-5xl">
          My Orders
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-[#765e4e]">
          Keep track of your little purchases.
        </p>
      </section>

      {/* Empty Orders */}
      {orders.length === 0 ? (
        <section className="flex flex-col items-center px-6 pb-24 text-center">
          <h2 className="mt-5 font-serif text-2xl text-[#3d2415]">
            No orders yet
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-[#765e4e]">
            You haven't placed any orders yet. Discover
            something beautiful for your little one.
          </p>

          <Link
            to="/products"
            className="mt-7 border border-[#6b3f22] px-7 py-3 text-xs font-medium tracking-widest text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white"
          >
            EXPLORE COLLECTION
          </Link>
        </section>
      ) : (

        /* Orders List */
        <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10">

          <div className="mb-6 border-b border-[#e5ded4] pb-4">
            <p className="text-xs tracking-[0.2em] text-[#765e4e]">
              {orders.length}{" "}
              {orders.length === 1 ? "ORDER" : "ORDERS"}
            </p>
          </div>

          <div className="space-y-6">

            {orders.map((order) => {
              const isPending =
                String(order.orderStatus || "").toLowerCase() ===
                "pending";

              return (
                <div
                  key={order.orderId}
                  className="border border-[#e5ded4] bg-[#fffdf9] p-6 sm:p-8"
                >

                  
                  <div className="flex flex-col gap-3 border-b border-[#e5ded4] pb-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-xs tracking-wider text-[#8a7565]">
                        ORDER #{order.orderId}
                      </p>

                      <p className="mt-1 text-sm text-[#765e4e]">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Date unavailable"}
                      </p>
                    </div>

                    <span className="w-fit border border-[#b8a28f] px-3 py-1 text-[10px] tracking-widest text-[#6b3f22]">
                      {order.orderStatus?.toUpperCase() || "PENDING"}
                    </span>

                  </div>

                  
                  <div className="divide-y divide-[#e5ded4]">

                    {order.items?.map((item, index) => (
                      <div
                        key={`${item.productId}-${index}`}
                        className="flex gap-4 py-5"
                      >

                        <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#eee6dc] sm:h-28 sm:w-24">

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

                          <p className="mt-2 text-sm text-[#765e4e]">
                            ₹
                            {Number(item.subTotal).toLocaleString("en-IN")}
                          </p>

                        </div>

                      </div>
                    ))}

                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col gap-5 border-t border-[#e5ded4] pt-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="text-sm text-[#765e4e]">
                      <span>
                        {order.items?.reduce(
                          (total, item) =>
                            total + Number(item.quantity || 0),
                          0
                        )}{" "}
                        items
                      </span>

                      <span className="mx-3 text-[#c5b4a5]">
                        |
                      </span>

                      <span className="font-medium text-[#3d2415]">
                        Total ₹
                        {Number(order.totalAmount || 0).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">

                      <Link
                        to={`/orders/${order.orderId}`}
                        className="inline-flex items-center justify-center border border-[#6b3f22] px-5 py-3 text-[10px] font-medium tracking-[0.15em] text-[#6b3f22] transition hover:bg-[#6b3f22] hover:!text-white"
                      >
                        VIEW DETAILS →
                      </Link>

                      {isPending && (
                        <button
                          onClick={() => handleCancelOrder(order)}
                          disabled={cancellingId === order.orderId}
                          className="border border-red-400 px-5 py-3 text-[10px] font-medium tracking-[0.15em] text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cancellingId === order.orderId
                            ? "CANCELLING..."
                            : "CANCEL ORDER"}
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        </section>
      )}

    </main>
  );
}

export default Orders;
