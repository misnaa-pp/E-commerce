function OrderDetails({ order, orderNumber, onClose, }) {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-[#5a3e2b]">
              Order #{orderNumber}
            </h2>

            <p className="text-sm text-gray-500">
              {order.createdAt || ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500">
            ×
          </button>

        </div>

        <div className="p-6 border-b">

          <h3 className="font-semibold mb-3">
            Customer Information
          </h3>

          <p>
            <strong>Name:</strong>{" "}
            {order.customer.name || "customer"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {order.customer.email || "N/A"}
          </p>

        </div>

        <div className="p-6 border-b">

          <h3 className="font-semibold mb-4">
            Order Items
          </h3>

          <div className="space-y-4">

            {order.items?.map(
             (item) => (

                <div
                  key={item.id}
                  className="flex items-center gap-4">

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg" />
                  )}

                  <div className="flex-1">

                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Size: {item.size}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <p className="font-medium">
                    ₹
                    {item.price *
                      item.quantity}
                  </p>

                </div>
              )
            )}
          </div>
        </div>

        <div className="p-6">

          <div className="flex justify-between text-lg font-semibold">

            <span>
              Total Amount
            </span>

            <span>
              ₹
              {order.totalAmount ??
                order.total ??
                0}
            </span>

          </div>

        </div>

        <div className="p-6 pt-0">

          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-[#5a3e2b] text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;