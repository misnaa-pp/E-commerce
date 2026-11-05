
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <footer className="bg-[#E9DFD3] text-[#4A3020]">

      
      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:gap-12">

        {/* Brand */}
        <div>

          <Link to="/" className="inline-block">

            <h2 className="font-serif text-4xl tracking-[0.12em]">
              INARAH
            </h2>

            <p className="mt-1 text-[10px] tracking-[0.45em] text-[#8A6F5C]">
              KIDS WEAR
            </p>

          </Link>

          <p className="mt-6 max-w-xs text-sm leading-7 text-[#765E4E]">
            Bringing comfort, charm and happiness to
            your little one's wardrobe, one outfit at a time.
          </p>

        </div>

        {/* Shop */}
        <div>

          <h3 className="mb-6 font-serif text-xl">
            Shop
          </h3>

          <ul className="space-y-4 text-sm text-[#765E4E]">

            <li>
              <Link
                to="/products"
                className="transition hover:translate-x-1 hover:text-[#3E2617]"
              >
                All Products
              </Link>
            </li>

            <li>
              <Link
                to="/products?category=Girls"
                className="transition hover:text-[#3E2617]"
              >
                Girls Collection
              </Link>
            </li>

            <li>
              <Link
                to="/products?category=Boys"
                className="transition hover:text-[#3E2617]"
              >
                Boys Collection
              </Link>
            </li>

            <li>
              <Link
                to="/products?category=Kids"
                className="transition hover:text-[#3E2617]"
              >
                Kids Collection
              </Link>
            </li>

          </ul>

        </div>

        {/* Quick Links */}
        <div>

          <h3 className="mb-6 font-serif text-xl">
            Quick Links
          </h3>

          <ul className="space-y-4 text-sm text-[#765E4E]">

            <li>
              <Link
                to="/"
                className="transition hover:text-[#3E2617]"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/wishlist"
                className="transition hover:text-[#3E2617]"
              >
                My Wishlist
              </Link>
            </li>

            <li>
              <Link
                to="/cart"
                className="transition hover:text-[#3E2617]"
              >
                Shopping Cart
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className="transition hover:text-[#3E2617]"
              >
                Browse Collections
              </Link>
            </li>

          </ul>

        </div>

        {/* My Account */}
        <div>

          <h3 className="mb-6 font-serif text-xl">
            My Account
          </h3>

          <ul className="space-y-4 text-sm text-[#765E4E]">

            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/orders"
                    className="transition hover:text-[#3E2617]"
                  >
                    My Orders
                  </Link>
                </li>

                <li>
                  <Link
                    to="/wishlist"
                    className="transition hover:text-[#3E2617]"
                  >
                    My Wishlist
                  </Link>
                </li>

                <li>
                  <Link
                    to="/cart"
                    className="transition hover:text-[#3E2617]"
                  >
                    My Cart
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="transition hover:text-[#3E2617]"
                  >
                    Login
                  </Link>
                </li>

                <li>
                  <Link
                    to="/register"
                    className="transition hover:text-[#3E2617]"
                  >
                    Create an Account
                  </Link>
                </li>
              </>
            )}

          </ul>

        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#d8c9b9] px-6 py-6 sm:px-10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

          <p className="text-xs tracking-wide text-[#8A6F5C]">
            © {new Date().getFullYear()} INARAH KIDSWEAR.
            ALL RIGHTS RESERVED.
          </p>

          <Link
            to="/"
            className="font-serif text-sm tracking-[0.2em] text-[#6B3F22] transition hover:text-[#3E2617]"
          >
            MADE WITH ♡ FOR LITTLE ONES
          </Link>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
