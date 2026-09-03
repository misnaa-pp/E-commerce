import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUser, } from "../../redux/slices/userSlice";
import toast from "react-hot-toast";

function AdminUsers() {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  const { users, loading, error} = useSelector((state) => state.users);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  const handleToggleBlock = async (user) => {
  try {
    await dispatch(
      updateUser({
        id: user.id,
        userData: {
          isBlocked: !user.isBlocked,
        },
      })
    ).unwrap();

    if (user.isBlocked) {
      toast.success("User unblocked successfully!");
    } else {
      toast.success("User blocked successfully!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to update user status");
  }
};

  if (
    loading &&
    users.length === 0
  ) {
    return (
      <div className="flex justify-center py-20">
        <p>Loading users...</p>
      </div>
    );
  }

  if (
    error &&
    users.length === 0
  ) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-[#5a3e2b]">
          Users
        </h1>

        <p className="mt-4 text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>

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
      {filteredUsers.length === 0 ? (
  <div className="bg-white rounded-xl shadow p-10 text-center">

    <h2 className="text-xl font-semibold">
      {searchTerm
        ? "No users found"
        : "No users available"}
    </h2>

    <p className="text-gray-500 mt-2">
      {searchTerm
        ? "Try searching with another name or email."
        : "There are no registered users yet."}
    </p>

  </div>
      ) : (

        <div className="overflow-x-auto bg-white rounded-xl shadow">

          <table className="w-full text-left">

            <thead>

              <tr className="border-b bg-gray-50">

                <th className="p-4">
                  Name
                </th>

                <th className="p-4">
                  Email
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

              {filteredUsers.map((user) => (

                <tr
                  key={user.id}
                  className="border-b" >
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-[#eadfd4] flex items-center justify-center text-[#5a3e2b] font-semibold">
                        {user.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <span className="font-medium">
                        {user.name}
                      </span>

                    </div>
                  </td>

                  <td className="p-4 text-gray-600">
                    {user.email}
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
                      onClick={() =>
                        handleToggleBlock(user)
                      }
                      className={`px-4 py-2 rounded-lg ${user.isBlocked
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                        }`}>
                      {user.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;