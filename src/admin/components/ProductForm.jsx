import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct, } from "../../redux/slices/productSlice";
import toast from "react-hot-toast"

function ProductForm({ product, onClose }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    discount: "",
    description: "",
    stock: "",
    sizes: "",
    colors: "",
    images: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        originalPrice:
          product.originalPrice || "",
        discount: product.discount || "",
        description:
          product.description || "",
        stock: product.stock || "",
        sizes:
          product.sizes?.join(", ") || "",
        colors:
          product.colors?.join(", ") || "",
        images:
          product.images?.join(", ") ||
          product.image ||
          "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        discount: "",
        description: "",
        stock: "",
        sizes: "",
        colors: "",
        images: "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      discount: Number(formData.discount),
      description: formData.description,
      stock: Number(formData.stock),
      sizes: formData.sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      colors: formData.colors
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      images: formData.images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

        
    };

    try {
      setSaving(true);

      if (product) {
        await dispatch(
          updateProduct({
            id: product.id,
            product: productData,
          })
        ).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await dispatch(addProduct(productData)).unwrap();
        toast.success("Product added successfully!");
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        product
          ? "Failed to update product"
          : "Failed to add product"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-semibold text-[#5a3e2b]">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 text-xl" >
          ×
        </button>

      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[150px_1fr] gap-x-1 gap-y-3">

        <label
          htmlFor="name"
          className="block mb-2 font-medium text-gray-700">
          Product Name</label>
        <input
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg" />

           <label
            htmlFor="category"
            className="block mb-2 font-medium text-gray-700">
            Category</label>
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg" />

          <label
            htmlFor="price"
            className="block mb-2 font-medium text-gray-700">
            Price</label>
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg" />

           <label
            htmlFor="originalPrice"
            className="block mb-2 font-medium text-gray-700">
            Original Price</label>
        <input
          name="originalPrice"
          type="number"
          placeholder="Original Price"
          value={formData.originalPrice}
          onChange={handleChange}
          className="border p-3 rounded-lg" />

          <label
            htmlFor="discount"
            className="block mb-2 font-medium text-gray-700">
            Discount (%) </label>
        <input
          name="discount"
          type="number"
          placeholder="Discount %"
          value={formData.discount}
          onChange={handleChange}
          className="border p-3 rounded-lg" />

          <label
            htmlFor="stock"
            className="block mb-2 font-medium text-gray-700">
            Stock </label>
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg" />

          <label
            htmlFor="sizes"
            className="block mb-2 font-medium text-gray-700">
            Sizes</label>
        <input
          name="sizes"
          placeholder="Sizes: 2Y, 4Y, 6Y"
          value={formData.sizes}
          onChange={handleChange}
          className="border p-3 rounded-lg" />

          <label
            htmlFor="colors"
            className="block mb-2 font-medium text-gray-700">
            Colors</label>
        <input
          name="colors"
          placeholder="Colors: Brown, White"
          value={formData.colors}
          onChange={handleChange}
          className="border p-3 rounded-lg" />

           <label
            htmlFor="images"
            className="block mb-2 font-medium text-gray-700">
            Product Image URLs</label>
        <input
          name="images"
          placeholder="Image URLs separated by comma"
          value={formData.images}
          onChange={handleChange}
          className="border p-3 rounded-lg md:col-span-2" />

          <label
            htmlFor="description"
            className="block mb-2 font-medium text-gray-700">
            Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="border p-3 rounded-lg md:col-span-2" />

        <div className="md:col-span-2 flex gap-3">

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-[#5a3e2b] text-white disabled:opacity-50">
            {saving
              ? "Saving..."
              : product
                ? "Update Product"
                : "Add Product"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg bg-gray-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;