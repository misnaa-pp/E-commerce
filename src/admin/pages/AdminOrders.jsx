
import { useEffect, useState, useCallback } from "react";
import {
    getAdminOrders,
    getAdminOrderDetails,
    updateAdminOrderStatus
} from "../../services/adminService";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedStatuses, setSelectedStatuses] = useState({});
    const [updatingId, setUpdatingId] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const pageSize = 10;

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminOrders({
                pageNumber,
                pageSize,
                search,
                status
            });

            setOrders(data.items || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    }, [pageNumber, search, status]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusSelection = (orderId, newStatus) => {
        setSelectedStatuses(prev => ({
            ...prev,
            [orderId]: newStatus
        }));
    };

    const handleUpdateStatus = async (order) => {
        const newStatus = selectedStatuses[order.orderId];

        if (!newStatus || newStatus === order.orderStatus) {
            return;
        }

        try {
            setUpdatingId(order.orderId);

            await updateAdminOrderStatus(
                order.orderId,
                newStatus
            );

            alert("Order status updated successfully.");

            setSelectedStatuses(prev => {
                const updated = { ...prev };
                delete updated[order.orderId];
                return updated;
            });

            await fetchOrders();

        } catch (err) {
            alert(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to update order status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const handleViewDetails = async (orderId) => {
        try {
            setDetailsLoading(true);
            setSelectedOrder(null);

            const data = await getAdminOrderDetails(orderId);

            setSelectedOrder(data);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to load order details."
            );
        } finally {
            setDetailsLoading(false);
        }
    };

    const getAvailableStatuses = (currentStatus) => {
        switch (currentStatus) {
            case "Pending":
                return ["Processing", "Cancelled"];
            case "Processing":
                return ["Shipped", "Cancelled"];
            case "Shipped":
                return ["Delivered"];
            default:
                return [];
        }
    };

    const getStatusColor = (orderStatus) => {
        switch (orderStatus) {
            case "Pending":
                return "bg-yellow-100 text-yellow-700";
            case "Processing":
                return "bg-blue-100 text-blue-700";
            case "Shipped":
                return "bg-purple-100 text-purple-700";
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                Order Management
            </h1>


            <div className="flex flex-col md:flex-row gap-4 mb-6">

                <input
                    type="text"
                    placeholder="Search customer name or email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPageNumber(1);
                    }}
                    className="border rounded-lg px-4 py-2 flex-1"
                />

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPageNumber(1);
                    }}
                    className="border rounded-lg px-4 py-2"
                >
                    <option value="">All Orders</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

            </div>


            {loading ? (
                <p className="text-center py-10">Loading orders...</p>
            ) : error ? (
                <p className="text-red-500 text-center py-10">{error}</p>
            ) : orders.length === 0 ? (
                <p className="text-center py-10">No orders found.</p>
            ) : (
                <div className="overflow-x-auto">

                    <table className="w-full border-collapse text-sm">

                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Update Status</th>
                                <th className="p-3">Details</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(order => {
                                const availableStatuses =
                                    getAvailableStatuses(order.orderStatus);

                                return (
                                    <tr
                                        key={order.orderId}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3">
                                            #{order.orderId}
                                        </td>

                                        <td className="p-3">
                                            <p className="font-medium">
                                                {order.customerName}
                                            </p>
                                            <p className="text-gray-500">
                                                {order.customerEmail}
                                            </p>
                                        </td>

                                        <td className="p-3">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </td>

                                        <td className="p-3 font-medium">
                                            ₹{Number(order.totalAmount).toFixed(2)}
                                        </td>

                                        <td className="p-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            {availableStatuses.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    <select
                                                        value={selectedStatuses[order.orderId] || ""}
                                                        onChange={(e) =>
                                                            handleStatusSelection(
                                                                order.orderId,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border rounded px-2 py-1"
                                                    >
                                                        <option value="">
                                                            Select status
                                                        </option>

                                                        {availableStatuses.map(item => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        onClick={() => handleUpdateStatus(order)}
                                                        disabled={
                                                            !selectedStatuses[order.orderId] ||
                                                            updatingId === order.orderId
                                                        }
                                                        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                                                    >
                                                        {updatingId === order.orderId
                                                            ? "Updating..."
                                                            : "Update"}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">
                                                    No changes
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-3">
                                            <button
                                                onClick={() => handleViewDetails(order.orderId)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>

                </div>
            )}


            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">

                    <button
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(prev => prev - 1)}
                        className="border px-4 py-2 rounded disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <span>
                        Page {pageNumber} of {totalPages}
                    </span>

                    <button
                        disabled={pageNumber >= totalPages}
                        onClick={() => setPageNumber(prev => prev + 1)}
                        className="border px-4 py-2 rounded disabled:opacity-40"
                    >
                        Next
                    </button>

                </div>
            )}


            {(detailsLoading || selectedOrder) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                        {detailsLoading ? (
                            <p className="text-center py-10">
                                Loading order details...
                            </p>
                        ) : selectedOrder && (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">
                                        Order #{selectedOrder.orderId}
                                    </h2>

                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="text-2xl text-gray-500"
                                    >
                                        ×
                                    </button>
                                </div>


                                <h3 className="font-semibold mb-2">
                                    Customer Information
                                </h3>

                                <div className="bg-gray-50 p-4 rounded-lg mb-5">
                                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                                </div>


                                <h3 className="font-semibold mb-2">
                                    Shipping Address
                                </h3>

                                <div className="bg-gray-50 p-4 rounded-lg mb-5">
                                    <p>{selectedOrder.fullName}</p>
                                    <p>{selectedOrder.addressLine}</p>
                                    <p>
                                        {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postalCode}
                                    </p>
                                    <p>{selectedOrder.country}</p>
                                </div>


                                <h3 className="font-semibold mb-2">
                                    Payment Information
                                </h3>

                                <div className="bg-gray-50 p-4 rounded-lg mb-5">
                                    <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                                    <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                                    <p><strong>Order Status:</strong> {selectedOrder.orderStatus}</p>
                                </div>


                                <h3 className="font-semibold mb-3">
                                    Ordered Products
                                </h3>

                                <div className="space-y-3 mb-5">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div
                                            key={`${item.productId}-${index}`}
                                            className="flex items-center gap-4 border rounded-lg p-3"
                                        >
                                            {item.imageUrl && (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            )}

                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {item.productName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    ₹{Number(item.unitPrice).toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>

                                            <p className="font-semibold">
                                                ₹{Number(item.subTotal).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>


                                <div className="border-t pt-4 space-y-2">
                                    <p className="flex justify-between">
                                        Subtotal
                                        <span>₹{Number(selectedOrder.subTotal).toFixed(2)}</span>
                                    </p>

                                    <p className="flex justify-between">
                                        Shipping
                                        <span>₹{Number(selectedOrder.shippingCharge).toFixed(2)}</span>
                                    </p>

                                    <p className="flex justify-between font-bold text-lg">
                                        Total
                                        <span>₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                                    </p>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminOrders;
