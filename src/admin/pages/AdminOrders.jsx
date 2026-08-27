import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, fetchOrderById,} from "../../redux/slices/orderSlice";
import OrderDetails from "../components/OrderDetails";

function AdminOrders() {
  const dispatch = useDispatch();

  const {
    orders,
    selectedOrder,
    loading,
    error,
  } = useSelector((state) => state.orders);

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchOrders());
    }
  }, [dispatch, orders.length]);

  const handleViewDetails = async (id) => {
    try {
      await dispatch(
        fetchOrderById(id)
      ).unwrap();

      setShowDetails(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (
    loading &&
    orders.length === 0
  ) {
    return (
      <div className="flex justify-center py-20">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (
    error &&
    orders.length === 0
  ) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-[#5a3e2b]">
          Orders
        </h1>

        <p className="mt-4 text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#5a3e2b]">
          Orders
        </h1>

        <p className="text-gray-500 mt-1">
          Manage customer orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">

          <h2 className="text-xl font-semibold">
            No orders found
          </h2>

          <p className="text-gray-500 mt-2">
            Customer orders will appear here.
          </p>

        </div>
      ) : (

        <div className="overflow-x-auto bg-white rounded-xl shadow">

          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">

                <th className="p-4">
                  Order ID
                </th>

                <th className="p-4">
                  Customer
                </th>

                <th className="p-4">
                  Total
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Action
                </th>

              </tr>
            </thead>
            <tbody>

              {orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-b">

                  <td className="p-4 font-medium">
                    #{order.id}
                  </td>

                  <td className="p-4">
                    <div>

                      <p className="font-medium">
                        {order.customer.name }
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.customer.email || ""}
                      </p>

                    </div>
                  </td>

                  <td className="p-4">
                    ₹
                    {order.totalAmount ??
                      order.total ?? 0}
                  </td>

                  <td className="p-4">

                    <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                      {order.status ||
                        "Pending"}
                    </span>

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleViewDetails(
                          order.id
                        )
                      }
                      className="px-4 py-2 rounded-lg bg-[#5a3e2b] text-white" >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}

      {showDetails &&
        selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onClose={() =>
              setShowDetails(false)
            }
          />
        )}
    </div>
  );
}

export default AdminOrders;