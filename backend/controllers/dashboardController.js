const Order = require("../models/orderModel");

const getDashboardData = async (req, res) => {
  try {
    // Merr porositë e fundit
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Numri total i porosive
    const totalOrders = await Order.countDocuments();

    // Totali i shitjeve
    const salesResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" },
        },
      },
    ]);

    const totalSales =
      salesResult.length > 0 ? salesResult[0].totalSales : 0;

    res.status(200).json({
      totalOrders,
      totalSales,
      orders,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: "Failed to load dashboard data",
    });
  }
};

module.exports = {
  getDashboardData,
};