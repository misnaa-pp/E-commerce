
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {addToWishlist,removeFromWishlist,} from "../redux/slices/wishlistSlice";
import getImageUrl from "../utils/imageUrl";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );
  
  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const stock = Number(product.stock) || 0;

  const productName =
    product.name || product.title || "Kidswear";

  const productImage =
    product.images?.[0] ||
    product.image ||
    product.images;

  
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
    <article className="group">

  
      <div className="relative overflow-hidden bg-[#eee6dc]">

        <Link to={`/products/${product.id}`}>
          <img
            src={getImageUrl(productImage)}
            alt={productName}
            className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#fffdf9]/90 text-xl text-[#6b3f22] shadow-sm transition hover:bg-[#6b3f22] hover:text-white"
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

      </div>

      <div className="pt-4">

        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm text-[#3d2415] transition hover:text-[#765039]">
            {productName}
          </h3>
        </Link>

        <p className="mt-1 text-sm text-[#765e4e]">
          ₹{product.price}
        </p>

        <p className="mt-1 text-xs text-[#8a7565]">
          {stock > 0
            ? `${stock} available`
            : "Out of stock"}
        </p>

      </div>
    </article>
  );
}

export default ProductCard;
