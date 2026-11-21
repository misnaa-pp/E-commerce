
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { fetchProductById } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import getImageUrl from "../utils/imageUrl";

function WishlistSizeSelection() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f3ec]">
        <p className="text-xs tracking-widest text-[#765e4e]">
          LOADING...
        </p>
      </main>
    );
  }

  if (error || !selectedProduct) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8f3ec]">
        <p className="text-sm text-[#765e4e]">
          {error || "Product not found"}
        </p>

        <Link to="/wishlist" className="mt-6 text-[#6b3f22]">
          BACK TO WISHLIST
        </Link>
      </main>
    );
  }

  const product = selectedProduct;
  const productName = product.name || product.title || "Product";
  const productImage =
    product.images?.[0] || product.image || "";
  const stock = Number(product.stock) || 0;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      await dispatch(
        addToCart({
          ...product,
          size: selectedSize,
          quantity: 1,
          stock,
        })
      ).unwrap();

      toast.success(`${productName} added to cart!`);
      navigate("/cart");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to add product to cart"
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f3ec]">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/wishlist"
          className="text-xs tracking-widest text-[#765e4e]"
        >
          ← BACK TO WISHLIST
        </Link>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="aspect-[3/4] overflow-hidden bg-[#eee6dc]">
            <img
              src={getImageUrl(productImage)}
              alt={productName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-3xl text-[#3d2415]">
              {productName}
            </h1>

            <p className="mt-4 text-[#765e4e]">
              ₹{product.price}
            </p>

            <p className="mt-6 text-xs tracking-widest text-[#765e4e]">
              SELECT SIZE
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              {product.sizes?.map((size, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`border px-5 py-3 text-sm transition ${
                    selectedSize === size
                      ? "border-[#6b3f22] bg-[#6b3f22] text-white"
                      : "border-[#d8cabc] text-[#6b3f22]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {(!product.sizes || product.sizes.length === 0) && (
              <p className="mt-3 text-sm text-red-600">
                No sizes available for this product.
              </p>
            )}

            <p className="mt-5 text-xs text-[#765e4e]">
              {stock > 0 ? `${stock} available` : "Out of stock"}
            </p>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={stock <= 0 || !product.sizes?.length}
              className="mt-8 w-full bg-[#6b3f22] px-6 py-4 text-xs tracking-widest text-white transition hover:bg-[#4e2d19] disabled:opacity-40"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default WishlistSizeSelection;
