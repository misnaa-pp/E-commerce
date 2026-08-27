import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { adminLogout } from "../../redux/slices/adminSlice";

function AdminHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { admin } = useSelector((state) => state.admin);

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-6">
      
      <div>
        <h2 className="text-xl font-semibold text-[#5a3e2b]">
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-5">
        
        <div className="text-right">
          <p className="font-medium">
            {admin?.name}
          </p>

          <p className="text-sm text-gray-500">
            Administrator
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-[#5a3e2b] text-white hover:bg-[#6b4b35]"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default AdminHeader;