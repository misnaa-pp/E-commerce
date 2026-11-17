
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { updateUser } from "../redux/slices/AuthSlice";
import { updateProfile } from "../services/authService";


function Profile() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  
  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name) {
      newErrors.name = "Name is required.";
    } else if (!/^[\p{L}][\p{L}\s.'-]{1,59}$/u.test(name)) {
      newErrors.name = "Enter a valid name.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.userId) {
        toast.error("Unable to identify your account. Please login again.");
        return;
    }

    if (!validateForm()) {
        toast.error("Please correct the highlighted fields.");
        return;
    }

    try {
        setIsSaving(true);

        const profileData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || null,
            address: formData.address.trim() || null
        };

        // Send updated details to ASP.NET Core
        const updatedUser = await updateProfile(profileData);

        // Update Redux and Local Storage
        dispatch(updateUser(updatedUser));

        toast.success("Profile updated successfully!");

    } catch (error) {
        console.error("Profile update failed:", error);

        const message =
            error.response?.data?.message ||
            "Unable to update profile. Please try again.";

        toast.error(message);

        if (error.response?.status === 401) {
            toast.error("Your session has expired. Please login again.");
        }

        if (error.response?.status === 400) {
            setErrors((prev) => ({
                ...prev,
                email: message
            }));
        }

    } finally {
        setIsSaving(false);
    }
};

  const inputClass = (field) =>
    `w-full border ${
      errors[field] ? "border-red-500" : "border-[#d8cabc]"
    } bg-white px-4 py-3 text-sm text-[#3d2415] outline-none placeholder:text-[#a18d7d] focus:border-[#6b3f22]`;

  const ErrorMessage = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-600">
        {errors[field]}
      </p>
    ) : null;

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f3ec]">
        <p className="text-sm text-[#765e4e]">
          Please log in to view your profile.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec] px-5 py-14 sm:px-10">

      <div className="mx-auto max-w-3xl">


        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#e8ddd0] font-serif text-3xl uppercase text-[#6b3f22]">
            {user.name?.charAt(0) || "U"}
          </div>

          <h1 className="font-serif text-4xl text-[#3d2415]">
            My Profile
          </h1>

          <p className="mt-3 text-sm text-[#765e4e]">
            Manage your personal information.
          </p>
        </div>

        <section className="border border-[#e5ded4] bg-[#fffdf9] p-6 sm:p-10">

          <form onSubmit={handleSubmit} noValidate>

            <div className="space-y-6">

              <div>
                <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                  FULL NAME
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={inputClass("name")}
                />

                <ErrorMessage field="name" />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass("email")}
                />

                <ErrorMessage field="email" />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                  PHONE NUMBER
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  className={inputClass("phone")}
                />

                <ErrorMessage field="phone" />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-wider text-[#765e4e]">
                  DELIVERY ADDRESS
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your delivery address"
                  rows="4"
                  className={`${inputClass("address")} resize-none`}
                />

              </div>

            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">

              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-[#6b3f22] px-6 py-4 text-xs font-medium tracking-widest text-white transition hover:bg-[#4f2d18] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "SAVING..." : "SAVE CHANGES"}
              </button>

              <Link
                to="/orders"
                className="flex flex-1 items-center justify-center border border-[#6b3f22] px-6 py-4 text-xs font-medium tracking-widest text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white"
              >
                MY ORDERS
              </Link>

            </div>

          </form>

        </section>

      </div>
    </main>
  );
}

export default Profile;
