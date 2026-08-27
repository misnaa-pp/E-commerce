import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct,} from "../../redux/slices/productSlice";
import ProductForm from "../components/ProductForm";

function AdminProducts() {
  const dispatch = useDispatch();

  const { products, loading, error,} = useSelector((state) => state.products);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await dispatch(
        deleteProduct(id)
      ).unwrap();
    } catch (error) {
      console.error(error);
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

  const totalPages = Math.ceil(
    products.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const currentProducts =
    products.slice(
      startIndex,
      startIndex + productsPerPage
    );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (
    loading &&
    products.length === 0
  ) {
    return (
      <div className="flex justify-center items-center py-20">
        <p>Loading products...</p>
      </div>
    );
  }

  if (
    error &&
    products.length === 0
  ) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">
          Products
        </h1>

        <p className="text-red-600 mt-4">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-[#5a3e2b]">
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your kids wear products
          </p>
        </div>

        <button
          onClick={handleAddProduct}
          className="px-5 py-3 rounded-lg bg-[#5a3e2b] text-white">
          + Add Product
        </button>

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
            No products found
          </h2>

          <p className="text-gray-500 mt-2">
            Add your first product to get started.
          </p>

          <button
            onClick={handleAddProduct}
            className="mt-5 px-5 py-2 rounded-lg bg-[#5a3e2b] text-white" >
            Add Product
          </button>

        </div>
      ) : (

        <>

          <div className="overflow-x-auto bg-white rounded-xl shadow">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b bg-gray-50">

                  <th className="p-4">
                    Product
                  </th>

                  <th className="p-4">
                    Category
                  </th>

                  <th className="p-4">
                    Price
                  </th>

                  <th className="p-4">
                    Stock
                  </th>

                  <th className="p-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>

                {currentProducts.map(
                  (product) => (

                    <tr
                      key={product.id}
                      className="border-b">

                      <td className="p-4">
                        <div className="flex items-center gap-3">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg"/>

                          <div>

                            <p className="font-medium">
                              {product.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              ID: {product.id}
                            </p>

                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {product.category}
                      </td>
                      <td className="p-4">
                        ₹{product.price}
                      </td>
                      <td className="p-4">
                        {product.stock}
                      </td>
                      <td className="p-4">

                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleEditProduct(
                                product
                              )
                            }
                            className="px-3 py-1 rounded bg-gray-200" >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                product.id
                              )
                            }
                            className="px-3 py-1 rounded bg-red-100 text-red-600">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
                className="px-4 py-2 border rounded disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() =>
                    handlePageChange(page)
                  }
                  className={`px-4 py-2 rounded ${
                    currentPage === page
                      ? "bg-[#5a3e2b] text-white"
                      : "border" }`} >
                  {page}
                </button>
              ))}

              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
                className="px-4 py-2 border rounded disabled:opacity-40">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminProducts;