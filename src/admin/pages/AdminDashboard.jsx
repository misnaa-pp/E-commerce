import { useSelector } from "react-redux";

function AdminDashboard() {
  const { admin } = useSelector((state) => state.admin);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#5a3e2b]">
        Admin Dashboard
      </h1>

      <p className="text-gray-600 mt-2">
        Welcome back, <span className="font-semibold">{admin?.name}</span> 👋
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Products</p>
          <h2 className="text-3xl font-bold text-[#5a3e2b]">--</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Users</p>
          <h2 className="text-3xl font-bold text-[#5a3e2b]">--</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Orders</p>
          <h2 className="text-3xl font-bold text-[#5a3e2b]">--</h2>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;