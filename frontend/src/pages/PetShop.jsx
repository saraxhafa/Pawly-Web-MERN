
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App1.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import {
  addToCart,
  removeFromCart,
  clearCart,
} from "../store/slices/cardSlice";

import { useCreateOrderMutation } from "../store/api/ordersApi";
import { useGetProductsQuery } from "../store/api/productsApi";

function PetShop() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const {
    data: productsData = [],
    isLoading,
    isError,
    error,
  } = useGetProductsQuery();

  const cart = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector(
    (state) => state.user.isAuthenticated
  );

  // PAYMENT AND SHOP STATE
  const [payment, setPayment] = useState("CASH");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  // TEMPORARY PAYMENT FORM STATE
  // Full card number and CVV are never sent to the backend.
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [walletProvider, setWalletProvider] = useState("PayPal");
  const [walletEmail, setWalletEmail] = useState("");

  // CHECK LOGIN
  const requireLogin = () => {
    if (!isAuthenticated || !user?.token) {
      toast.info(
        "Please log in or create an account to use the shopping cart."
      );
      navigate("/login");
      return false;
    }

    return true;
  };

  // RESET PAYMENT FORM WHEN PAYMENT METHOD CHANGES
  const handlePaymentChange = (e) => {
    setPayment(e.target.value);

    setCardHolder("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setWalletProvider("PayPal");
    setWalletEmail("");
  };

  // KEEP ONLY DIGITS IN CARD NUMBER
  const handleCardNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 19);
    setCardNumber(digits);
  };

  // FORMAT CARD NUMBER VISUALLY IN GROUPS OF FOUR
  const formatCardNumber = (value) => {
    return value.replace(/(.{4})/g, "$1 ").trim();
  };

  // FORMAT EXPIRY DATE AS MM/YYYY
  const handleExpiryDateChange = (e) => {
    const input = e.target.value;

    // Keep only digits and limit the input to 6 digits.
    const digits = input.replace(/\D/g, "").slice(0, 6);

    let formattedValue = digits;

    // Automatically insert "/" after the month.
    if (digits.length > 2) {
      formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    setExpiryDate(formattedValue);
  };

  // VALIDATE EXPIRY DATE IN MM/YYYY FORMAT
  const isValidExpiryDate = (value) => {
    const match = value.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);

    if (!match) {
      return false;
    }

    const month = Number(match[1]);
    const year = Number(match[2]);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // The card must not be expired.
    return (
      year > currentYear ||
      (year === currentYear && month >= currentMonth)
    );
  };

  // RESET PAYMENT FORM
  const resetPaymentForm = () => {
    setCardHolder("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setWalletProvider("PayPal");
    setWalletEmail("");
  };

  // FILTER PRODUCTS
  const filteredProducts = productsData.filter((product) => {
    return (
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "ALL" || product.category === filter)
    );
  });

  // ADD TO CART
  const handleAdd = (product) => {
    if (!requireLogin()) return;

    dispatch(addToCart(product));
  };

  // REMOVE FROM CART
  const handleRemove = (productId) => {
    if (!requireLogin()) return;

    dispatch(removeFromCart(productId));
  };

  // CALCULATE TOTAL
  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // VALIDATE PAYMENT FORM AND PREPARE SAFE PAYMENT METADATA
  const getPaymentDetails = () => {
    if (payment === "CASH") {
      return {};
    }

    if (payment === "DEBIT" || payment === "CREDIT") {
      const cleanCardNumber = cardNumber.replace(/\D/g, "");
      const cleanCardHolder = cardHolder.trim();

      if (cleanCardHolder.length < 2) {
        toast.error("Please enter the cardholder's name.");
        return null;
      }

      if (
        cleanCardNumber.length < 13 ||
        cleanCardNumber.length > 19
      ) {
        toast.error("Please enter a valid card number.");
        return null;
      }

      if (!isValidExpiryDate(expiryDate)) {
        toast.error(
          "Please enter a valid expiry date (MM/YYYY)."
        );
        return null;
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        toast.error("Please enter a valid CVV.");
        return null;
      }

      // ONLY THE LAST FOUR DIGITS ARE RETAINED.
      // Full card number and CVV are NOT sent to the backend.
      const maskedCardNumber =
        "*".repeat(cleanCardNumber.length - 4) +
        cleanCardNumber.slice(-4);

      return {
        cardHolder: cleanCardHolder,
        maskedCardNumber,
      };
    }

    if (payment === "WALLET") {
      const cleanEmail = walletEmail.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(cleanEmail)) {
        toast.error("Please enter a valid wallet email address.");
        return null;
      }

      return {
        walletProvider,
        walletEmail: cleanEmail,
      };
    }

    return null;
  };

  // CREATE ORDER
  const handlePayment = async () => {
    if (!requireLogin()) return;

    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    const paymentDetails = getPaymentDetails();

    if (paymentDetails === null) {
      return;
    }

    const orderData = {
      products: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      paymentMethod: payment,
      paymentDetails,
    };

    try {
      await createOrder(orderData).unwrap();

      dispatch(clearCart());
      resetPaymentForm();
      setPayment("CASH");
      setShowModal(true);

      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(
        err?.data?.message || "Order failed! Please try again."
      );
    }
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="shop-container">
        <div className="shop-header">
          <h1>🐾 Pawly Pet Shop</h1>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (isError) {
    console.error("Products loading error:", error);

    return (
      <div className="shop-container">
        <div className="shop-header">
          <h1>🐾 Pawly Pet Shop</h1>
          <p>Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      {/* HEADER */}
      <div className="shop-header">
        <h1>🐾 Pawly Pet Shop</h1>
        <p>Everything your pet needs in one place</p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="shop-tools">
        <input
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-buttons">
          {["ALL", "Accessories", "Food", "Personal Care", "Toys"].map(
            (cat) => (
              <button
                key={cat}
                className={filter === cat ? "active" : ""}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* SHOP LAYOUT */}
      <div className="shop-layout">
        {/* PRODUCTS */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => {
              const cartItem = cart.find(
                (c) => c._id === product._id
              );

              return (
                <div className="product-card" key={product._id}>
                  <img src={product.image} alt={product.name} />

                  <div className="product-content">
                    <span className="category-badge">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <span className="price">
                      ${product.price}
                    </span>

                    <button
                      className="add-btn"
                      onClick={() => handleAdd(product)}
                    >
                      Add To Cart
                    </button>

                    {isAuthenticated && cartItem && (
                      <div className="quantity">
                        <button
                          onClick={() => handleRemove(product._id)}
                        >
                          -
                        </button>

                        <span>{cartItem.quantity}</span>

                        <button
                          onClick={() => handleAdd(product)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* CART AND CHECKOUT */}
        <aside className="cart-sidebar">
          <h2>🛒 Cart</h2>

          {!isAuthenticated || !user?.token ? (
            <div>
              <p>
                Please log in to access your shopping cart.
              </p>

              <button
                className="checkout-btn"
                onClick={() => navigate("/login")}
              >
                Login / Register
              </button>
            </div>
          ) : cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li key={item._id}>
                    {item.name} x {item.quantity} = $
                    {item.price * item.quantity}
                  </li>
                ))}
              </ul>

              <h3>Total: ${total.toFixed(2)}</h3>

              {/* PAYMENT METHOD */}
              <div className="payment-section">
                <label htmlFor="payment-method">
                  Payment Method
                </label>

                <select
                  id="payment-method"
                  value={payment}
                  onChange={handlePaymentChange}
                >
                  <option value="CASH">Cash 💵</option>
                  <option value="DEBIT">Debit Card 💳</option>
                  <option value="CREDIT">Credit Card 💳</option>
                  <option value="WALLET">Digital Wallet 📱</option>
                </select>

                {/* DEBIT / CREDIT CARD FORM */}
                {(payment === "DEBIT" || payment === "CREDIT") && (
                  <div className="payment-form">
                    <h3>
                      {payment === "DEBIT"
                        ? "Debit Card Details"
                        : "Credit Card Details"}
                    </h3>

                    <div className="payment-field">
                      <label htmlFor="card-holder">
                        Cardholder Name
                      </label>

                      <input
                        id="card-holder"
                        type="text"
                        placeholder="Name on card"
                        value={cardHolder}
                        onChange={(e) =>
                          setCardHolder(e.target.value)
                        }
                        autoComplete="cc-name"
                        maxLength={80}
                      />
                    </div>

                    <div className="payment-field">
                      <label htmlFor="card-number">
                        Card Number
                      </label>

                      <input
                        id="card-number"
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        value={formatCardNumber(cardNumber)}
                        onChange={handleCardNumberChange}
                        autoComplete="cc-number"
                        maxLength={23}
                      />
                    </div>

                    <div className="payment-row">
                      {/* EXPIRY DATE */}
                      <div className="payment-field">
                        <label htmlFor="expiry-date">
                          Expiry Date
                        </label>

                        <input
                          id="expiry-date"
                          type="text"
                          inputMode="numeric"
                          placeholder="MM/YYYY"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          autoComplete="off"
                          maxLength={7}
                        />
                      </div>

                      {/* CVV */}
                      <div className="payment-field">
                        <label htmlFor="cvv">CVV</label>

                        <input
                          id="cvv"
                          type="password"
                          inputMode="numeric"
                          placeholder="***"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4)
                            )
                          }
                          autoComplete="off"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <p className="payment-note">
                      This is a simulated payment. No real transaction
                      will be made. Your full card number and CVV will
                      not be saved.
                    </p>
                  </div>
                )}

                {/* DIGITAL WALLET FORM */}
                {payment === "WALLET" && (
                  <div className="payment-form">
                    <h3>Digital Wallet Details</h3>

                    <div className="payment-field">
                      <label htmlFor="wallet-provider">
                        Wallet Provider
                      </label>

                      <select
                        id="wallet-provider"
                        value={walletProvider}
                        onChange={(e) =>
                          setWalletProvider(e.target.value)
                        }
                      >
                        <option value="PayPal">PayPal</option>
                        <option value="Google Pay">Google Pay</option>
                        <option value="Apple Pay">Apple Pay</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="payment-field">
                      <label htmlFor="wallet-email">
                        Wallet Email
                      </label>

                      <input
                        id="wallet-email"
                        type="email"
                        placeholder="example@email.com"
                        value={walletEmail}
                        onChange={(e) =>
                          setWalletEmail(e.target.value)
                        }
                        autoComplete="email"
                      />
                    </div>

                    <p className="payment-note">
                      This is a simulated wallet payment. No real
                      transaction will be made.
                    </p>
                  </div>
                )}
              </div>

              <button
                className="checkout-btn"
                onClick={handlePayment}
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? "Processing..." : "Place Order"}
              </button>
            </>
          )}
        </aside>
      </div>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>🎉 Order Successful!</h2>

            <p>
              Your order has been placed successfully.
              This was a simulated payment. No real payment was made.
            </p>

            <button onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetShop;

