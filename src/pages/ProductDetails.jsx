

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate,useParams,Link,} from "react-router-dom";
import toast from "react-hot-toast";
import { fetchProductById } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import {addToWishlist,removeFromWishlist,} from "../redux/slices/wishlistSlice";

function ProductDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedProduct,
    loading,
    error,
  } = useSelector((state) => state.products);

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);


  useEffect(() => {
    dispatch(fetchProductById(id));
    setQuantity(1);
  }, [dispatch, id]);


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f3ec]">
        <p className="text-xs tracking-[0.25em] text-[#765e4e]">
          LOADING...
        </p>
      </main>
    );
  }


  if (error || !selectedProduct) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8f3ec]">
        <p className="text-sm text-[#765e4e]">
          {error || "Product not found."}
        </p>

        <Link
          to="/products"
          className="mt-6 border border-[#6b3f22] px-6 py-3 text-xs tracking-widest text-[#6b3f22]"
        >
          BACK TO COLLECTION
        </Link>
      </main>
    );
  }

  const product = selectedProduct;

  const stock = Number(product.stock) || 0;

  const productName =
    product.name || product.title || "Product";

  const productImages = product.images || [];

  const productImage =
    productImages[selectedImage] || product.image || "";


  const cartItem = cartItems.find(
    (item) => item.id === product.id
  );

  const cartQuantity = cartItem?.quantity || 0;

  const remainingStock = Math.max(
    0,
    stock - cartQuantity
  );

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Only ${stock} items available`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity > remainingStock) {
      toast.error(
        `Only ${remainingStock} more item(s) can be added`
      );
      return;
    }

    dispatch(
      addToCart({
        ...product,
        quantity,
        stock,
      })
    );

    toast.success(`${productName} added to cart`);

    setQuantity(1);
  };


  const handleBuyNow = () => {
    if (stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity > stock) {
      toast.error("Requested quantity is unavailable");
      return;
    }

    navigate("/checkout", {
      state: {
        buyNowItem: {
          ...product,
          quantity,
          stock,
        },
      },
    });
  };

  
const handleWishlist = async () => {
    try {
        if (isWishlisted) {
            await dispatch(
                removeFromWishlist(product.id)
            ).unwrap();

            toast.success("Removed from wishlist");
        } else {
            await dispatch(
                addToWishlist(product)
            ).unwrap();

            toast.success("Added to wishlist");
        }
    } catch (error) {
        toast.error(
            typeof error === "string"
                ? error
                : "Wishlist operation failed"
        );
    }
};

  return (
    <main className="min-h-screen bg-[#f8f3ec]">

      <div className="mx-auto max-w-7xl px-6 pt-8 sm:px-10 lg:px-16">
        <Link
          to="/products"
          className="text-xs tracking-wider text-[#765e4e] transition hover:text-[#3d2415]"
        >
          ← BACK TO COLLECTION
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-16 lg:py-16">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">


          <div>

            <div className="relative bg-[#eee6dc]">

              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={productImage}
                  alt={productName}
                  className="h-full w-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={handleWishlist}
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#fffdf9]/90 text-2xl text-[#6b3f22] shadow-md"
              >
                {isWishlisted ? "♥" : "♡"}
              </button>

            </div>

            {productImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">

                {productImages.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-16 shrink-0 overflow-hidden border-2 ${selectedImage === index
                        ? "border-[#6b3f22]"
                        : "border-transparent"
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}

              </div>
            )}

          </div>

          <div className="flex flex-col justify-center">

            <p className="text-xs tracking-[0.25em] text-[#765039]">
              {product.category || "KIDSWEAR"}
            </p>

            <h1 className="mt-4 font-serif text-3xl text-[#3d2415] sm:text-4xl">
              {productName}
            </h1>


            <div className="mt-5 flex items-center gap-3">

              <span className="text-lg text-[#765e4e]">
                ₹{product.price}
              </span>

              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>

                  <span className="text-sm text-green-700">
                    {product.discount}% OFF
                  </span>
                </>
              )}

            </div>


            <div className="my-7 border-t border-[#e5ded4]" />

            <p className="max-w-lg text-sm leading-7 text-[#765e4e]">
              {product.description ||
                "Thoughtfully selected for little ones, with comfort, quality and everyday adventures in mind."}
            </p>


            {product.sizes?.length > 0 && (
              <div className="mt-7">

                <p className="mb-3 text-xs tracking-widest text-[#765e4e]">
                  AVAILABLE SIZES
                </p>

                <div className="flex flex-wrap gap-3">

                  {product.sizes.map((size, index) => (
                    <span
                      key={index}
                      className="border border-[#d8cabc] px-5 py-3 text-sm text-[#6b3f22]"
                    >
                      {size}
                    </span>
                  ))}

                </div>

              </div>
            )}

            <p className="mt-5 text-xs tracking-wide text-[#8a7565]">
              {stock > 0
                ? `${stock} available`
                : "Out of stock"}
            </p>

            {stock > 0 && (
              <div className="mt-7">

                <p className="mb-3 text-xs tracking-widest text-[#765e4e]">
                  QUANTITY
                </p>

                <div className="flex w-fit items-center border border-[#d8cabc]">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                    className="px-4 py-3 text-[#6b3f22] transition hover:bg-[#eee6dc] disabled:opacity-30"
                  >
                    −
                  </button>

                  <span className="px-5 text-sm text-[#3d2415]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= stock}
                    className="px-4 py-3 text-[#6b3f22] transition hover:bg-[#eee6dc] disabled:opacity-30"
                  >
                    +
                  </button>

                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                stock <= 0 || remainingStock === 0
              }
              className="mt-8 w-full bg-[#6b3f22] px-6 py-4 text-xs font-medium tracking-[0.15em] text-white transition hover:bg-[#4e2d19] disabled:cursor-not-allowed disabled:bg-[#b9aa9d]"
            >
              {stock <= 0
                ? "OUT OF STOCK"
                : remainingStock === 0
                  ? "MAXIMUM STOCK IN CART"
                  : "ADD TO CART"}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={stock <= 0}
              className="mt-4 w-full border border-[#6b3f22] px-6 py-4 text-xs font-medium tracking-[0.15em] text-[#6b3f22] transition hover:bg-[#6b3f22] hover:text-white disabled:cursor-not-allowed disabled:border-[#b9aa9d] disabled:text-[#b9aa9d]"
            >
              BUY NOW
            </button>

            <div className="mt-10 border-t border-[#e5ded4]">

              <div className="border-b border-[#e5ded4] py-5">
                <p className="text-xs tracking-wider text-[#3d2415]">
                  PRODUCT DETAILS
                </p>

                <p className="mt-3 text-sm leading-6 text-[#765e4e]">
                  Carefully selected kidswear designed with
                  comfort and everyday wear in mind.
                </p>
              </div>

              <div className="py-5">
                <p className="text-xs tracking-wider text-[#3d2415]">
                  SHIPPING & RETURNS
                </p>

                <p className="mt-3 text-sm leading-6 text-[#765e4e]">
                  Easy delivery and hassle-free returns.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
