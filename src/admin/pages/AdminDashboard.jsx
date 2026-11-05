
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchProducts } from "../../redux/slices/productSlice";
import { fetchUsers } from "../../redux/slices/userSlice";
import { fetchOrders } from "../../redux/slices/orderSlice";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const chartColors = [
  "#6B3F22",
  "#98704F",
  "#BD9A78",
  "#D8C1A8",
  "#E9DCCF",
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function AdminDashboard() {
  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.admin);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { users, loading: usersLoading } = useSelector(
    (state) => state.users
  );
  const { orders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }

    if (users.length === 0) {
      dispatch(fetchUsers());
    }

    if (orders.length === 0) {
      dispatch(fetchOrders());
    }
  }, [
    dispatch,
    products.length,
    users.length,
    orders.length,
  ]);

  // Exclude cancelled orders from order value
  const validOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() !== "cancelled"
  );

  const totalRevenue = validOrders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "pending"
  ).length;

  // Products with stock of 5 or less
  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= 5
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) <= 0
  );

  // Products grouped by category
  const categoryData = products.reduce((acc, product) => {
    const category = product.category || "Other";

    const existing = acc.find(
      (item) => item.name === category
    );

    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        name: category,
        value: 1,
      });
    }

    return acc;
  }, []);

  // Last six months' order value
  const currentDate = new Date();

  const monthlySales = Array.from(
    { length: 6 },
    (_, index) => {
      const monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 5 + index,
        1
      );

      const monthOrders = validOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);

        return (
          !Number.isNaN(orderDate.getTime()) &&
          orderDate.getMonth() === monthDate.getMonth() &&
          orderDate.getFullYear() === monthDate.getFullYear()
        );
      });

      const revenue = monthOrders.reduce(
        (total, order) =>
          total + Number(order.total || 0),
        0
      );

      return {
        month: monthDate.toLocaleDateString("en-IN", {
          month: "short",
        }),
        revenue,
      };
    }
  );

  // Latest orders
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const isLoading =
    productsLoading || usersLoading || ordersLoading;

  const statCards = [
    {
      title: "Total Products",
      value: products.length,
      description: "Products in your store",
      icon: "▣",
    },
    {
      title: "Total Customers",
      value: users.length,
      description: "Registered customers",
      icon: "♙",
    },
    {
      title: "Total Orders",
      value: orders.length,
      description: `${pendingOrders} pending orders`,
      icon: "▤",
    },
    {
      title: "Order Value",
      value: formatCurrency(totalRevenue),
      description: "Excluding cancelled orders",
      icon: "₹",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Dashboard Heading */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm tracking-widest text-[#98704F]">
            INARAH STORE MANAGEMENT
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#4A3020]">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Welcome back, {admin?.name || "Admin"}!
            Here's what's happening with your store.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-[#98704F]">
          Updating dashboard information...
        </p>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {statCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-[#E9DCCF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3EAE0] text-xl font-semibold text-[#6B3F22]">
                {card.icon}
              </div>

            </div>

            <h2 className="mt-5 break-words text-2xl font-bold text-[#4A3020]">
              {card.value}
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              {card.description}
            </p>

          </div>
        ))}

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Revenue Chart */}
        <div className="rounded-2xl border border-[#E9DCCF] bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="font-serif text-xl font-semibold text-[#4A3020]">
              Order Revenue
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Order value over the last six months
            </p>
          </div>

          <div className="h-[300px]">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlySales}
                margin={{
                  top: 10,
                  right: 10,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fill: "#8A7564", fontSize: 12 }}
                />

                <YAxis
                  tick={{ fill: "#8A7564", fontSize: 12 }}
                  tickFormatter={(value) =>
                    `₹${value >= 1000 ? `${value / 1000}k` : value}`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    "Order value",
                  ]}
                />

                <Bar
                  dataKey="revenue"
                  name="Order value"
                  fill="#98704F"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* Category Chart */}
        <div className="rounded-2xl border border-[#E9DCCF] bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="font-serif text-xl font-semibold text-[#4A3020]">
              Products by Category
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Distribution of your product collection
            </p>
          </div>

          <div className="h-[300px]">

            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={95}
                    paddingAngle={3}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          chartColors[index % chartColors.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No product data available
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Recent Orders and Low Stock */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent Orders */}
        <div className="overflow-hidden rounded-2xl border border-[#E9DCCF] bg-white shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between border-b border-[#F0E8DF] p-6">

            <div>
              <h2 className="font-serif text-xl font-semibold text-[#4A3020]">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest customer purchases
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="text-sm font-medium text-[#8A5A36] hover:underline"
            >
              View All
            </Link>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[600px] text-left">

              <thead className="bg-[#FAF7F3] text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0E8DF]">

                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="text-sm transition hover:bg-[#FAF7F3]"
                    >
                      <td className="px-6 py-4 font-medium text-[#6B3F22]">
                        #{String(order.id).slice(-6)}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {order.customer?.name || "Customer"}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-6 py-4 font-medium text-[#4A3020]">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            order.status?.toLowerCase() === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status?.toLowerCase() === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-sm text-gray-400"
                    >
                      No orders available yet.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* Low Stock Products */}
        <div className="rounded-2xl border border-[#E9DCCF] bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-[#F0E8DF] p-6">

            <div>
              <h2 className="font-serif text-xl font-semibold text-[#4A3020]">
                Low Stock Alert
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Products needing attention
              </p>
            </div>

            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              {lowStockProducts.length}
            </span>

          </div>

          <div className="space-y-4 p-6">

            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#4A3020]">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {product.category || "Other"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      Number(product.stock) <= 0
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {Number(product.stock) <= 0
                      ? "Out of stock"
                      : `${product.stock} left`}
                  </span>

                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">
                All products have sufficient stock.
              </p>
            )}

            {lowStockProducts.length > 0 && (
              <Link
                to="/admin/products"
                className="block border-t border-[#F0E8DF] pt-4 text-center text-sm font-medium text-[#8A5A36] hover:underline"
              >
                Manage Products
              </Link>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
