
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/App1.css";

import { useGetOrdersQuery } from "../store/api/ordersApi";

function Dashboard() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector(
    (state) => state.user.isAuthenticated
  );

  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useGetOrdersQuery(undefined, {
    skip: !user?.token,
    pollingInterval: 15000,
    refetchOnMountOrArgChange: true,
  });

  const [now, setNow] = useState(new Date());

  // Filter input values
  const [selectedProduct, setSelectedProduct] = useState("ALL");
  const [selectedPeriod, setSelectedPeriod] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filters applied only after clicking Search
  const [appliedFilters, setAppliedFilters] = useState({
    product: "ALL",
    period: "ALL",
    startDate: "",
    endDate: "",
  });

  const [hasSearched, setHasSearched] = useState(false);

  // Live date and time
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated || !user?.token) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Helper: get product ID whether populated or not
  const getProductId = (product) => {
    const id = product?.productId;

    if (id && typeof id === "object") {
      return String(id._id || id.id || product.name || "");
    }

    return String(id || product?.name || "");
  };

  // Get customer information saved with the order
  const getOrderCustomer = (order) => {
    // Preferred source: customer snapshot saved at purchase time
    if (order?.customerSnapshot) {
      return {
        name: order.customerSnapshot.name || "Name unavailable",
        email: order.customerSnapshot.email || "Email unavailable",
      };
    }

    // Fallback for older orders if the user reference is populated
    if (
      order?.user &&
      typeof order.user === "object"
    ) {
      return {
        name: order.user.name || "Name unavailable",
        email: order.user.email || "Email unavailable",
      };
    }

    // Do not use the current profile as historical order data
    return {
      name: "Historical information unavailable",
      email: "Not recorded with this order",
    };
  };

  // Get unique products from all orders
  const availableProducts = useMemo(() => {
    const products = new Map();

    orders.forEach((order) => {
      order.products?.forEach((product) => {
        const name =
          product.name ||
          product.productName ||
          "Unnamed product";

        const id = getProductId(product);

        if (!products.has(id)) {
          products.set(id, {
            id,
            name,
          });
        }
      });
    });

    return Array.from(products.values());
  }, [orders]);

  // Apply filters when Search is clicked
  const handleSearch = () => {
    if (
      selectedPeriod === "CUSTOM" &&
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      toast.error(
        "The start date cannot be after the end date."
      );
      return;
    }

    setAppliedFilters({
      product: selectedProduct,
      period: selectedPeriod,
      startDate,
      endDate,
    });

    setHasSearched(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedProduct("ALL");
    setSelectedPeriod("ALL");
    setStartDate("");
    setEndDate("");

    setAppliedFilters({
      product: "ALL",
      period: "ALL",
      startDate: "",
      endDate: "",
    });

    setHasSearched(false);
  };

  // Filter orders by product and date
  const filteredOrders = useMemo(() => {
    const currentDate = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      if (Number.isNaN(orderDate.getTime())) {
        return false;
      }

      // Product filter
      const matchesProduct =
        appliedFilters.product === "ALL" ||
        order.products?.some(
          (product) =>
            getProductId(product) === appliedFilters.product
        );

      // Period filter
      let matchesPeriod = true;

      if (
        appliedFilters.period !== "ALL" &&
        appliedFilters.period !== "CUSTOM"
      ) {
        const days = Number(appliedFilters.period);
        const cutoffDate = new Date(currentDate);

        cutoffDate.setDate(cutoffDate.getDate() - days);

        matchesPeriod = orderDate >= cutoffDate;
      }

      // Custom date range
      if (appliedFilters.period === "CUSTOM") {
        if (appliedFilters.startDate) {
          const from = new Date(
            `${appliedFilters.startDate}T00:00:00`
          );

          matchesPeriod =
            matchesPeriod && orderDate >= from;
        }

        if (appliedFilters.endDate) {
          const to = new Date(
            `${appliedFilters.endDate}T23:59:59.999`
          );

          matchesPeriod =
            matchesPeriod && orderDate <= to;
        }
      }

      return matchesProduct && matchesPeriod;
    });
  }, [orders, appliedFilters]);

  // Total value of filtered orders
  const totalSpent = filteredOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  // Format date
  const formatDate = (dateValue) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString();
  };

  // Format time
  const formatTime = (dateValue) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Order status styling
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "pending";

      case "completed":
        return "completed";

      case "cancelled":
        return "cancelled";

      case "processing":
        return "processing";

      default:
        return "default";
    }
  };

  if (!isAuthenticated || !user?.token) {
    return null;
  }

  return (
    <div className="dashboard-container">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>🐾 Welcome, {user?.name}</h1>
          <p className="subtitle">Dashboard Overview</p>
        </div>

        <div className="header-actions">
          <div className="datetime-card">
            <p className="date">
              {now.toLocaleDateString()}
            </p>

            <h2 className="time">
              {now.toLocaleTimeString()}
            </h2>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats">
        <div className="card">
          <h3>📦 Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="card">
          <h3>🔎 Filtered Orders</h3>
          <p>{filteredOrders.length}</p>
        </div>

        <div className="card">
          <h3>💰 Total Spent</h3>
          <p>{totalSpent.toFixed(2)}€</p>
        </div>
      </div>

      {/* Orders Section */}
      <section className="orders-section">
        <div className="orders-heading">
          <div>
            <h2>📦 My Orders</h2>
            <p>View and filter your purchase history.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="orders-toolbar">

          {/* Product Filter */}
          <div className="filter-field">
            <label htmlFor="productFilter">
              Filter by product
            </label>

            <select
              id="productFilter"
              value={selectedProduct}
              onChange={(e) =>
                setSelectedProduct(e.target.value)
              }
            >
              <option value="ALL">All products</option>

              {availableProducts.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period Filter */}
          <div className="filter-field">
            <label htmlFor="periodFilter">
              Filter by period
            </label>

            <select
              id="periodFilter"
              value={selectedPeriod}
              onChange={(e) =>
                setSelectedPeriod(e.target.value)
              }
            >
              <option value="ALL">All time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
              <option value="CUSTOM">
                Custom date range
              </option>
            </select>
          </div>

          {/* Custom Date Range */}
          {selectedPeriod === "CUSTOM" && (
            <>
              <div className="filter-field">
                <label htmlFor="startDate">From</label>

                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                />
              </div>

              <div className="filter-field">
                <label htmlFor="endDate">To</label>

                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                />
              </div>
            </>
          )}

          {/* Filter Buttons */}
          <div className="filter-actions">
            <button
              type="button"
              className="search-filter-btn"
              onClick={handleSearch}
            >
              🔍 Search
            </button>

            <button
              type="button"
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Order Results */}
        {isLoading ? (
          <div className="orders-message">
            Loading your orders...
          </div>
        ) : isError ? (
          <div className="orders-message">
            <p>Unable to load your orders.</p>

            <button
              type="button"
              onClick={refetch}
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-message">
            <span>🔍</span>

            <h3>
              {orders.length === 0
                ? "No orders available"
                : hasSearched
                  ? "No orders found"
                  : "No orders available"}
            </h3>

            <p>
              {orders.length === 0
                ? "You have no orders yet."
                : hasSearched
                  ? "No orders found matching your search criteria."
                  : "You have no orders yet."}
            </p>
          </div>
        ) : (

          /* Scrollable Orders List */
          <div className="orders-list-scroll">
            <div className="orders-list">

              {filteredOrders.map((order) => {
                const customer = getOrderCustomer(order);

                return (
                  <article
                    className="dash-order-card"
                    key={order._id}
                  >

                    {/* Order Header */}
                    <div className="dash-order-header">
                      <div>
                        <span className="order-number">
                          ORDER #
                          {order._id
                            .slice(-6)
                            .toUpperCase()}
                        </span>

                        <p className="order-date">
                          📅 {formatDate(order.createdAt)}
                          {" · "}
                          {formatTime(order.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`order-status ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </div>

                    {/* Customer Information */}
                    <div className="dash-order-customer">
                      <h4>👤 Customer Information</h4>

                      <p>
                        <strong>Name:</strong>{" "}
                        {customer.name}
                      </p>

                      <p>
                        <strong>Email:</strong>{" "}
                        {customer.email}
                      </p>
                    </div>

                    {/* Order Products */}
                    <div className="dash-order-products">
                      {order.products?.map((product, index) => (
                        <div
                          className="dash-order-product"
                          key={
                            product.productId?._id ||
                            product.productId ||
                            index
                          }
                        >
                          <div className="product-details">
                            <h4>
                              {product.name ||
                                product.productName ||
                                "Unnamed product"}
                            </h4>

                            <p>
                              Quantity: {product.quantity}
                            </p>
                          </div>

                          <div className="product-price">
                            {Number(
                              product.priceAtPurchase || 0
                            ).toFixed(2)}
                            €

                            <small>per item</small>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="dash-order-footer">
                      <div>
                        <span>Payment method</span>

                        <strong>
                          {order.paymentMethod ||
                            "Not specified"}
                        </strong>
                      </div>

                      <div className="order-total">
                        <span>Order Total</span>

                        <strong>
                          {Number(
                            order.total || 0
                          ).toFixed(2)}
                          €
                        </strong>
                      </div>
                    </div>

                  </article>
                );
              })}

            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;

