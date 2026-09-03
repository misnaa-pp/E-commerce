import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToWishlist, removeFromWishlist, } from "../redux/slices/wishlistSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.items);

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
        />
        <h3>{product.name}</h3>
      </Link>

      <p>₹{product.price}</p>
      <p>{product.category}</p>

      {product.stock > 0 ? (
        <p>In Stock</p>
      ) : (
        <p>Out of Stock</p>
      )}

      <button onClick={handleWishlist}>
        {isWishlisted ? "❤️" : "♡"}
      </button>
    </div>
  );
}

export default ProductCard;