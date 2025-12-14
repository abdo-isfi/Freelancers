const { Op } = require("sequelize");
const { Client, Project, TimeEntry, Invoice } = require("../models");

/**
 * Get dashboard summary stats
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.userId;

    // 1. Total Clients
    const totalClients = await Client.count({
      where: { user_id: userId },
    });

    // 2. Active Projects
    const activeProjects = await Project.count({
      where: {
        user_id: userId,
        status: "active",
      },
    });

    // 3. Hours This Week
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek); // Go back to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek)); // Go forward to Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    const timeEntriesThisWeek = await TimeEntry.findAll({
      where: {
        user_id: userId,
        date: {
          [Op.between]: [startOfWeek, endOfWeek],
        },
      },
      attributes: ["duration_minutes"],
    });

    const totalMinutes = timeEntriesThisWeek.reduce(
      (sum, entry) => sum + (entry.duration_minutes || 0),
      0
    );
    const hoursThisWeek = totalMinutes / 60;

    // 4. Invoice Stats (Paid vs Unpaid)
    const invoices = await Invoice.findAll({
      where: { user_id: userId },
      attributes: ["total_ttc", "status"],
    });

    const paidAmount = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + parseFloat(inv.total_ttc || 0), 0);

    const unpaidAmount = invoices
      .filter((inv) => inv.status !== "paid")
      .reduce((sum, inv) => sum + parseFloat(inv.total_ttc || 0), 0);
    
    // Count pending (unpaid) invoices for display
    const pendingCount = invoices.filter((inv) => inv.status !== "paid").length;

    console.log("Dashboard Stats Debug:");
    console.log("Paid Amount:", paidAmount);
    console.log("Unpaid Amount:", unpaidAmount);

    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: {
        totalClients,
        activeProjects,
        hoursThisWeek,
        paidAmount,
        unpaidAmount,
        pendingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
