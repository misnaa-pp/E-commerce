import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts} from "../../redux/slices/productSlice";
import {fetchUsers} from "../../redux/slices/userSlice";
import {fetchOrders} from "../../redux/slices/orderSlice";

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

function AdminDashboard() {
  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.admin);
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.users);
  const { orders } = useSelector((state) => state.orders);

  const chartColors = [
  "#5a3e2b",
  "#7a5238",
  "#9a7255",
  "#c4a58a",
  "#e5d5c5",
];

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


  const categoryData = products.reduce((acc, product) => {
    const category = product.category || "Other";

    const existingCategory = acc.find(
      (item) => item.name === category
    );

    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({
        name: category,
        value: 1,
      });
    }

    return acc;
  }, []);


  const summaryData = [
    {
      name: "Products",
      count: products.length,
    },
    {
      name: "Users",
      count: users.length,
    },
    {
      name: "Orders",
      count: orders.length,
    },
  ];

  return (
    <div className="p-6">

      <div>
        <h1 className="text-3xl font-bold text-[#5a3e2b]">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Welcome back,{" "}
          <span className="font-semibold">
            {admin?.name}
          </span>{" "}
          👋
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Products
          </p>

          <h2 className="text-3xl font-bold text-[#5a3e2b]">
            {products.length}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Total products
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Users
          </p>

          <h2 className="text-3xl font-bold text-[#5a3e2b]">
            {users.length}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Registered customers
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Orders
          </p>

          <h2 className="text-3xl font-bold text-[#5a3e2b]">
            {orders.length}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Total orders
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold text-[#5a3e2b] mb-6">
            Store Overview
          </h2>

          <div className="h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={summaryData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="count"
                  name="Count"
                  fill="#5a3e2b"/>

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold text-[#5a3e2b] mb-6">
            Products by Category
          </h2>

          <div className="h-[320px]">

            {categoryData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%" >
                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label >
                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No product data available
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;