import { useState } from "react";
import "../styles/App1.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import {
  addToCart,
  removeFromCart,
  clearCart,
} from "../store/slices/cardSlice";

import { useCreateOrderMutation } from "../store/api/ordersApi";

// 📦 PRODUCTS
const productsData = [
  {
    _id: "64a1b2c3d4e5f6",
    name: "Dog Leash",
    price: 15,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
  },
  {
    _id: "64a1b2c3d4e5f7",
    name: "Cat Food Premium",
    price: 25,
    category: "Food",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
  },
  {
    _id: "64a1b2c3d4e5f8",
    name: "Pet Shampoo",
    price: 10,
    category: "Personal Care",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
  },
{
    _id: "64a1b2c3d4e5f9",
    name: "Ball Pets",
    price: 10,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97",
  },

  {
    _id: "64a1b2c3d4e5f10",
    name: " Set of hair Brush For Pets",
    price: 20,
    category: "Personal Care",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
  },

  {
    _id: "64a1b2c3d4e5f11",
    name: "Retractable Leash",
    price: 20,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
  },

];

function PetShop() {
  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();

  const cart = useSelector((state) => state.cart.items || []);

  const [payment, setPayment] = useState("CASH");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  // 🔍 FILTER PRODUCTS
  const filteredProducts = productsData.filter((product) => {
    return (
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "ALL" || product.category === filter)
    );
  });

  // 🛒 ADD
  const handleAdd = (product) => {
    dispatch(addToCart(product));
  };

  // ❌ REMOVE
  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // 💰 TOTAL
  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // 🚀 PAYMENT
  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    const orderData = {
      products: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      total,
      paymentMethod: payment,
    };

    try {
      await createOrder(orderData).unwrap();

      dispatch(clearCart());
      setShowModal(true);
    } catch (err) {
      toast.error("Order failed!");
    }
  };

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

      {/* LAYOUT */}
      <div className="shop-layout">

        {/* PRODUCTS */}
        <div className="products-grid">
          {filteredProducts.map((product) => {
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

                  <span className="price">${product.price}</span>

                  <button
                    className="add-btn"
                    onClick={() => handleAdd(product)}
                  >
                    Add To Cart
                  </button>

                  {cartItem && (
                    <div className="quantity">
                      <button onClick={() => handleRemove(product._id)}>
                        -
                      </button>

                      <span>{cartItem.quantity}</span>

                      <button onClick={() => handleAdd(product)}>
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CART */}
        <aside className="cart-sidebar">
          <h2>🛒 Cart</h2>

          {cart.length === 0 ? (
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

              <h3>Total: ${total}</h3>

              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="CASH">Cash 💵</option>
                <option value="DEBIT">Debit 💳</option>
                <option value="CREDIT">Credit 💳</option>
                <option value="WALLET">Wallet 📱</option>
              </select>

              <button
                className="checkout-btn"
                onClick={handlePayment}
              >
                Pay Now
              </button>
            </>
          )}
        </aside>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>🎉 Order Successful!</h2>
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