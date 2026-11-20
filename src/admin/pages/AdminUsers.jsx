
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getAdminUsers,
    getAdminUserById,
    toggleBlockUser
} from "../../services/adminService";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAdminUsers(searchTerm);
                setUsers(data || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load customers."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [searchTerm]);

    const handleViewUser = async (userId) => {
        try {
            setDetailsLoading(true);
            setSelectedUser(null);

            const data = await getAdminUserById(userId);
            setSelectedUser(data);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to load customer details."
            );
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleToggleBlock = async (user) => {
        try {
            setUpdatingId(user.userId);

            const response = await toggleBlockUser(user.userId);

            setUsers(prev =>
                prev.map(item =>
                    item.userId === user.userId
                        ? { ...item, isBlocked: response.isBlocked }
                        : item
                )
            );

            if (selectedUser?.userId === user.userId) {
                setSelectedUser(prev => ({
                    ...prev,
                    isBlocked: response.isBlocked
                }));
            }

            toast.success(response.message);

        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to update customer status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#5a3e2b]">
                        Users
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage registered customers
                    </p>
                </div>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full md:w-72 px-4 py-3 border rounded-lg outline-none focus:ring-1 focus:ring-[#5a3e2b]"
                />
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-20">
                    <p>Loading users...</p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="bg-white rounded-xl shadow p-10 text-center">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && users.length === 0 && (
                <div className="bg-white rounded-xl shadow p-10 text-center">
                    <h2 className="text-xl font-semibold">
                        {searchTerm ? "No users found" : "No users available"}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {searchTerm
                            ? "Try searching with another name or email."
                            : "There are no registered users yet."}
                    </p>
                </div>
            )}

            {/* Users Table */}
            {!loading && !error && users.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-4">Customer</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Registered Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                                <th className="p-4">Details</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr
                                    key={user.userId}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#eadfd4] flex items-center justify-center text-[#5a3e2b] font-semibold">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium">
                                                {user.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        {user.email}
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        {user.phone || "N/A"}
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "N/A"}
                                    </td>

                                    <td className="p-4">
                                        {user.isBlocked ? (
                                            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-600">
                                                Blocked
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
                                                Active
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-4">
                                        <button
                                            onClick={() => handleToggleBlock(user)}
                                            disabled={updatingId === user.userId}
                                            className={`px-4 py-2 rounded-lg disabled:opacity-50 ${
                                                user.isBlocked
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {updatingId === user.userId
                                                ? "Updating..."
                                                : user.isBlocked
                                                    ? "Unblock"
                                                    : "Block"}
                                        </button>
                                    </td>

                                    <td className="p-4">
                                        <button
                                            onClick={() => handleViewUser(user.userId)}
                                            className="px-4 py-2 rounded-lg bg-[#eadfd4] text-[#5a3e2b] hover:bg-[#dfcbbb]"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Customer Details Modal */}
            {(detailsLoading || selectedUser) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">

                        {detailsLoading ? (
                            <p className="text-center py-10">
                                Loading customer details...
                            </p>
                        ) : selectedUser && (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-[#5a3e2b]">
                                        Customer Details
                                    </h2>
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="text-2xl text-gray-500 hover:text-black"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-full bg-[#eadfd4] flex items-center justify-center text-xl font-semibold text-[#5a3e2b]">
                                        {selectedUser.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {selectedUser.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Customer #{selectedUser.userId}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{selectedUser.email}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="font-medium">{selectedUser.role}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <p className={`font-medium ${selectedUser.isBlocked ? "text-red-600" : "text-green-600"}`}>
                                            {selectedUser.isBlocked ? "Blocked" : "Active"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Registered Date</p>
                                        <p className="font-medium">
                                            {selectedUser.createdAt
                                                ? new Date(selectedUser.createdAt).toLocaleString()
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="w-full mt-6 bg-[#5a3e2b] text-white py-3 rounded-lg hover:bg-[#493120]"
                                >
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminUsers;
