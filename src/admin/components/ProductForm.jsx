
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    addAdminProduct,
    updateAdminProduct
} from "../../services/adminService";

function ProductForm({ product, onClose }) {
    const [saving, setSaving] = useState(false);

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
        images: ""
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                category: product.category || "",
                price: product.price ?? "",
                originalPrice: product.originalPrice ?? "",
                discount: product.discount ?? "",
                description: product.description || "",
                stock: product.stock ?? "",
                sizes: product.sizes?.join(", ") || "",
                colors: product.colors?.join(", ") || "",
                images: product.images?.join(", ") || ""
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
                images: ""
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const price = Number(formData.price);
        const originalPrice = Number(formData.originalPrice);
        const discount = Number(formData.discount);

        if (originalPrice < price) {
            toast.error("Original price cannot be less than selling price.");
            return;
        }

        const expectedDiscount = originalPrice > 0
            ? Number((((originalPrice - price) / originalPrice) * 100).toFixed(2))
            : 0;

        if (Math.abs(discount - expectedDiscount) > 0.01) {
            toast.error(
                `Discount should be ${expectedDiscount}% based on the prices.`
            );
            return;
        }

        const productData = {
            name: formData.name,
            category: formData.category,
            price,
            originalPrice,
            discount,
            description: formData.description,
            stock: Number(formData.stock),
            sizes: formData.sizes.split(",").map(item => item.trim()).filter(Boolean),
            colors: formData.colors.split(",").map(item => item.trim()).filter(Boolean),
            images: formData.images.split(",").map(item => item.trim()).filter(Boolean)
        };

        try {
            setSaving(true);

            if (product) {
                await updateAdminProduct(product.productId, productData);
                toast.success("Product updated successfully!");
            } else {
                await addAdminProduct(productData);
                toast.success("Product added successfully!");
            }

            onClose();
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                (product
                    ? "Failed to update product."
                    : "Failed to add product.")
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
                    className="text-gray-500 text-xl"
                >
                    ×
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-[150px_1fr] gap-x-1 gap-y-3"
            >
                <label>Product Name</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Product name"
                    className="border p-3 rounded-lg"
                />

                <label>Category</label>
                <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    placeholder="Category"
                    className="border p-3 rounded-lg"
                />

                <label>Price</label>
                <input
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="border p-3 rounded-lg"
                />

                <label>Original Price</label>
                <input
                    name="originalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    required
                    className="border p-3 rounded-lg"
                />

                <label>Discount (%)</label>
                <input
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleChange}
                    required
                    className="border p-3 rounded-lg"
                />

                <label>Stock</label>
                <input
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="border p-3 rounded-lg"
                />

                <label>Sizes</label>
                <input
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleChange}
                    placeholder="2Y, 4Y, 6Y"
                    className="border p-3 rounded-lg"
                />

                <label>Colors</label>
                <input
                    name="colors"
                    value={formData.colors}
                    onChange={handleChange}
                    placeholder="Brown, White"
                    className="border p-3 rounded-lg"
                />

                <label>Product Image URLs</label>
                <input
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    placeholder="Image URLs separated by commas"
                    className="border p-3 rounded-lg"
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={1000}
                    rows="4"
                    className="border p-3 rounded-lg"
                />

                <div className="col-span-2 flex gap-3 mt-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 rounded-lg bg-[#5a3e2b] text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : product
                                ? "Update Product"
                                : "Add Product"}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-lg bg-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;
