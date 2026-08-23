import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

function Navbar() {

  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);


  return (
    <header className=" w-full border-b border-[#e5ded4] bg-[#f8f3ec]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[95px] max-w-[1400px] items-center justify-between px-8 lg:px-12">

        <Link to="/" className="flex min-w-[220px] flex-col items-center text-[#4c4b3f]">
          <span className="font-serif text-3xl tracking-tight">
            INARAH
          </span>

          <span className="mt-1 text-center text-[9px] tracking-[5px] text-[#777567]">
            KIDS WEAR
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="font-serif text-[16px] text-[#5b5a4d] transition hover:text-[#29291f]">Home</Link>
          <Link to="/products" className="font-serif text-[16px] text-[#5b5a4d] transition hover:text-[#29291f]">Products</Link>
          <Link to="/wishlist" className="font-serif text-[16px] text-[#5b5a4d] transition hover:text-[#29291f]">Wishlist ({wishlistItems.length})</Link>
          <Link to="/cart" className="font-serif text-[16px] text-[#5b5a4d] transition hover:text-[#29291f]">Cart ({cartCount})</Link>
          <Link to="/orders" className="font-serif text-[16px] text-[#5b5a4d] transition hover:text-[#29291f]">My orders</Link>
          <Link to="/login" className="font-serif text-[16px] text-[#5b5a4d] transition hover:text-[#29291f]">Login</Link>
        </nav>
        <div>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => dispatch(logout())}
                className="rounded-full border border-[#737466] px-5 py-2.5 font-serif text-sm text-[#5b5a4d] transition hover:bg-[#737466] hover:text-[#f8f3ec]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-[#737466] px-6 py-3 font-serif text-[15px] text-[#f8f3ec] transition hover:bg-[#5d5e51]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
