
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { login } from "../redux/slices/AuthSlice";
import {loginUser,getMyProfile} from "../services/authService";


function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setError("");

        const response = await loginUser({
            email: formData.email,
            password: formData.password
        });

        const accessToken = response.accessToken;
        const refreshToken = response.refreshToken;

        const user = await getMyProfile(accessToken);

        dispatch(login({
            user,
            accessToken,
            refreshToken
        }));

        toast.success("Login successful!");

        navigate("/");

    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Login failed";

        setError(message);
        toast.error(message);
    }
};



  return (
    <div className="min-h-[calc(100vh-95px)] bg-bg-[#EDE4D8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[500px] rounded-md bg-[#fffdf9] px-8 py-12 shadow-xl sm:px-12">
        <div className="mb-9 text-center">
          <h1 className="font-serif text-4xl text-[#4c4b3f]">Please Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="h-16 w-full rounded-md border border-[#d8d3cc] bg-white px-5 font-serif text-lg text-[#4c4b3f] outline-none transition placeholder:text-[#7d897f] focus:border-[#737466] focus:ring-1 focus:ring-[#737466]"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="h-16 w-full rounded-md border border-[#d8d3cc] bg-white px-5 font-serif text-lg text-[#4c4b3f] outline-none transition placeholder:text-[#7d897f] focus:border-[#737466] focus:ring-1 focus:ring-[#737466]"
            required
          />

          {error && (<p className="text-center text-sm text-red-700">{error}</p>)}

          <button type="submit" className="h-16 w-full rounded-md bg-[#6b3f22] font-serif text-xl text-white transition duration-300 hover:bg-[#4e2d19]"
          >Login</button>
        </form>

        <div className="mt-8 border-t border-[#e5ded4] pt-6 text-center">
          <p className="text-sm text-[#858075]">
            Don't have an account? <Link to="/register"
              className="mt-1 inline-block font-serif text-sm text-[#5b5a4d] underline underline-offset-4 transition hover:text-[#29291f]">Register</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;

