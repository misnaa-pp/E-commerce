
import { useEffect, useState } from "react";
import {
    getAdminProducts,
    deleteAdminProduct
} from "../../services/adminService";
import ProductForm from "../components/ProductForm";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const productsPerPage = 8;

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAdminProducts({
                pageNumber: currentPage,
                pageSize: productsPerPage,
                search: searchTerm
            });

            setProducts(response.items);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [currentPage, searchTerm]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            await deleteAdminProduct(id);
            alert("Product deleted successfully!");
            loadProducts();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to delete product."
            );
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingProduct(null);
        loadProducts();
    };

    if (loading) {
        return <p className="text-center py-20">Loading products...</p>;
    }

    if (error) {
        return (
            <div>
                <h1 className="text-2xl font-semibold">Products</h1>
                <p className="text-red-600 mt-4">{error}</p>
                <button onClick={loadProducts} className="mt-3 underline">
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#5a3e2b]">
                        Products
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your kids wear products
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search products..."
                        className="w-full sm:w-64 px-4 py-3 border rounded-lg outline-none"
                    />

                    <button
                        onClick={handleAddProduct}
                        className="px-5 py-3 rounded-lg bg-[#5a3e2b] text-white"
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="mb-8">
                    <ProductForm
                        product={editingProduct}
                        onClose={handleFormClose}
                    />
                </div>
            )}

            {products.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center shadow">
                    <h2 className="text-xl font-semibold">
                        {searchTerm ? "No products found" : "No products available"}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {searchTerm
                            ? "Try a different search term."
                            : "Add your first product to get started."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-4">Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr key={product.productId} className="border-b">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.images?.[0]}
                                                alt={product.name}
                                                className="w-14 h-14 object-cover rounded-lg"
                                            />
                                            <div>
                                                <p className="font-medium">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    ID: {product.productId}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">{product.category}</td>
                                    <td className="p-4">₹{product.price}</td>
                                    <td className="p-4">{product.stock}</td>

                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="px-3 py-1 rounded bg-gray-200"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(product.productId)}
                                                className="px-3 py-1 rounded bg-red-100 text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-4 py-2 border rounded disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <span>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-4 py-2 border rounded disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
