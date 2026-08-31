import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import { fetchUsers } from "../../redux/slices/userSlice";
import { fetchOrders } from "../../redux/slices/orderSlice";

function AdminDashboard() {
  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.admin);
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.users);
  const { orders } = useSelector((state) => state.orders);

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

  return (
    <div className="p-6">

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Products
          </p>

          <h2 className="text-3xl font-bold text-[#5a3e2b]">
            {products.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Users
          </p>

          <h2 className="text-3xl font-bold text-[#5a3e2b]">
            {users.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Orders
          </p>

          <h2 className="text-3xl font-bold text-[#5a3e2b]">
            {orders.length}
          </h2>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;