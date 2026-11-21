import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { adminLogin } from "../../redux/slices/adminSlice";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading } = useSelector((state) => state.admin);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      adminLogin(formData)
    );

    if (adminLogin.fulfilled.match(result)) {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f3ed] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#fffdf9] rounded-2xl shadow-lg border border-[#e6d8ca] p-8 sm:p-10">

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-center text-[#5a3e2b]">
          Admin Login
        </h1>

        <p className="text-center text-[#8b6f5a] mt-2 mb-8 text-sm sm:text-base">
          Login to access the admin dashboard.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-[#d8c7b7] bg-[#fffdf9] text-[#5a3e2b] placeholder-[#a89584] outline-none focus:border-[#8b6f5a] focus:ring-2 focus:ring-[#eadfd4] transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-[#d8c7b7] bg-[#fffdf9] text-[#5a3e2b] placeholder-[#a89584] outline-none focus:border-[#8b6f5a] focus:ring-2 focus:ring-[#eadfd4] transition"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#5a3e2b] text-white font-medium hover:bg-[#463021] transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminLogin;