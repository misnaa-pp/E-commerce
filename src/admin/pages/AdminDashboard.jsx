
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getAdminDashboard } from "../../services/adminService";

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
  const { admin } = useSelector((state) => state.admin);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboard();

        setDashboard(data);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.response?.data?.message ||
          "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalProducts = dashboard?.totalProducts || 0;
  const totalCustomers = dashboard?.totalCustomers || 0;
  const totalOrders = dashboard?.totalOrders || 0;
  const pendingOrders = dashboard?.pendingOrders || 0;
  const totalRevenue = dashboard?.totalRevenue || 0;

  const lowStockProducts = dashboard?.lowStockProducts || 0;
  const outOfStockProducts = dashboard?.outOfStockProducts || 0;

  const categoryData = dashboard?.categoryData || [];
  const monthlySales = dashboard?.monthlySales || [];
  const recentOrders = dashboard?.recentOrders || [];

  const statCards = [
    {
      title: "Total Products",
      value: totalProducts,
      description: "Products in your store",
      icon: "▣",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      description: "Registered customers",
      icon: "♙",
    },
    {
      title: "Total Orders",
      value: totalOrders,
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

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm tracking-widest text-[#98704F]">
          LOADING DASHBOARD...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <p className="text-sm text-red-600">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-[#6B3F22] px-5 py-2 text-sm text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

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
                        fill={chartColors[index % chartColors.length]}
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
                        {order.customerName || "Customer"}
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
              {lowStockProducts}
            </span>

          </div>

          <div className="space-y-5 p-6">

            <div>
              <p className="text-sm text-gray-500">
                Low stock products
              </p>

              <p className="mt-1 text-2xl font-bold text-orange-600">
                {lowStockProducts}
              </p>
            </div>

            <div className="border-t border-[#F0E8DF] pt-5">
              <p className="text-sm text-gray-500">
                Out of stock products
              </p>

              <p className="mt-1 text-2xl font-bold text-red-600">
                {outOfStockProducts}
              </p>
            </div>

            <Link
              to="/admin/products"
              className="block border-t border-[#F0E8DF] pt-4 text-center text-sm font-medium text-[#8A5A36] hover:underline"
            >
              Manage Products
            </Link>

          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;