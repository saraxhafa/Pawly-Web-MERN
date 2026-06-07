import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../store/slices/orderSlice";

function Dashboard() {
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.orders);
  const user = useSelector((state) => state.user.user);

  // ⏰ LIVE DATE & TIME
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 📦 fetch orders nga DB
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // 📊 total mujor
  const monthlyTotal = orders?.reduce((acc, o) => acc + o.total, 0) || 0;

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>🐾 Welcome, {user?.name}</h1>
          <p className="subtitle">Dashboard Overview</p>
        </div>

        {/* DATE + TIME */}
        <div className="datetime-card">
          <p className="date">{now.toLocaleDateString()}</p>
          <h2 className="time">{now.toLocaleTimeString()}</h2>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="card">
          <h3>📦 Orders</h3>
          <p>{orders?.length || 0}</p>
        </div>

        <div className="card">
          <h3>💰 Monthly Total</h3>
          <p>{monthlyTotal}€</p>
        </div>
      </div>

      {/* ORDERS */}
      <div className="orders-section">
        <h2>📦 Last Orders</h2>

        {orders?.length === 0 ? (
          <div className="empty">
            ❌ Nuk ka porosi të fundit
          </div>
        ) : (
          orders.map((o) => {
            const date = new Date(o.createdAt);

            return (
              <div key={o._id} className="order-card">
                <div className="left">
                  <h4>{o.productName}</h4>
                  <small>
                    📅 {date.toLocaleDateString()} • ⏰{" "}
                    {date.toLocaleTimeString()}
                  </small>
                </div>

                <div className="right">
                  <p>💰 {o.price}€</p>
                  <p>🔢 Qty: {o.quantity}</p>
                  <p className="total">🧾 {o.total}€</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Dashboard;