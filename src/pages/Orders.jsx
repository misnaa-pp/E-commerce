import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders } from "../redux/slices/orderSlice";

function Orders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f3ec]">
        <section className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
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
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec]">
      <section className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl text-[#3d2415] sm:text-5xl">
          My Orders
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-[#765e4e]">
          Keep track of your little purchases.
        </p>
      </section>

      {orders.length === 0 ? (
        <section className="flex flex-col items-center px-6 pb-24 text-center">
          <h2 className="mt-5 font-serif text-2xl text-[#3d2415]">
            No orders yet
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-[#765e4e]">
            You haven't placed any orders yet. Discover something
            beautiful for your little one.
          </p>

          <Link
            to="/products"
            className="mt-7 border border-[#6b3f22] px-7 py-3 text-xs font-medium tracking-widest text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white"
          >
            EXPLORE COLLECTION
          </Link>
        </section>
      ) : (
        <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10">
          <div className="mb-6 border-b border-[#e5ded4] pb-4">
            <p className="text-xs tracking-[0.2em] text-[#765e4e]">
              {orders.length}{" "}
              {orders.length === 1 ? "ORDER" : "ORDERS"}
            </p>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-[#e5ded4] bg-[#fffdf9] p-6 sm:p-8"
              >
                <div className="flex flex-col gap-3 border-b border-[#e5ded4] pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs tracking-wider text-[#8a7565]">
                      ORDER #{order.id}
                    </p>

                    <p className="mt-1 text-sm text-[#765e4e]">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : order.date || "Date unavailable"}
                    </p>
                  </div>

                  <span className="w-fit border border-[#b8a28f] px-3 py-1 text-[10px] tracking-widest text-[#6b3f22]">
                    {order.status?.toUpperCase() || "PENDING"}
                  </span>
                </div>

                <div className="divide-y divide-[#e5ded4]">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 py-5"
                    >
                      <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#eee6dc] sm:h-28 sm:w-24">
                        <img
                          src={item.image}
                          alt={item.title || item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-center">
                        <h3 className="text-sm text-[#3d2415]">
                          {item.title || item.name}
                        </h3>

                        <p className="mt-1 text-xs text-[#8a7565]">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-2 text-sm text-[#765e4e]">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 border-t border-[#e5ded4] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-[#765e4e]">
                    <span>
                      {order.items?.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}{" "}
                      items
                    </span>

                    <span className="mx-3 text-[#c5b4a5]">
                      |
                    </span>

                    <span className="font-medium text-[#3d2415]">
                      Total ₹{order.total}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="w-fit border-b border-[#6b3f22] pb-1 text-xs tracking-wider text-[#6b3f22] transition hover:text-[#3d2415]"
                  >
                    VIEW ORDER →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Orders;