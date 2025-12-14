import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "@/components/Common/Button";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import RevenueChart from "@/components/Widgets/RevenueChart";
import TimeByProjectChart from "@/components/Widgets/TimeByProjectChart";
import RecentActivity from "@/components/Widgets/RecentActivity";
import { fetchClients } from "@/store/clientsSlice";
import { fetchProjects } from "@/store/projectsSlice";
import { fetchTimeEntries } from "@/store/timeEntriesSlice";
import { fetchInvoices } from "@/store/invoicesSlice";
import { formatDecimalHours } from "@/utils/formatTime";
import * as dashboardAPI from "@/api/dashboardAPI";
import { AnimatedText } from "@/components/ui/animated-shiny-text";

function DashboardPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { items: clients } = useSelector((state) => state.clients);
  const { items: projects } = useSelector((state) => state.projects);
  const { items: timeEntries } = useSelector((state) => state.timeEntries);
  const { items: invoices } = useSelector((state) => state.invoices);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data
        await Promise.all([
          dispatch(fetchClients()),
          dispatch(fetchProjects()),
          dispatch(fetchTimeEntries()),
          dispatch(fetchInvoices()),
        ]);

        // Fetch dashboard stats from API
        try {
          const response = await dashboardAPI.getDashboardStats();
          setStats(response.data);
        } catch (error) {
          console.error("Failed to fetch dashboard stats:", error);
          // Calculate stats locally if API fails
          calculateLocalStats();
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const calculateLocalStats = () => {
    const activeProjects = projects.filter((p) => p.status === "active").length;
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    const hoursThisWeek = timeEntries
      .filter((entry) => new Date(entry.date) >= thisWeekStart)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const paidAmount = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const unpaidAmount = invoices
      .filter((inv) => inv.status !== "paid")
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const pendingCount = invoices.filter((inv) => inv.status !== "paid").length;

    setStats({
      totalClients: clients.length,
      activeProjects,
      hoursThisWeek,
      paidAmount,
      unpaidAmount,
      pendingCount,
    });
  };

  // Prepare chart data
  const prepareRevenueData = () => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      last6Months.push(d);
    }

    return last6Months.map((date) => {
      const monthName = date.toLocaleString("default", { month: "short" });
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      const monthRevenue = invoices
        .filter((inv) => {
          const invDate = new Date(inv.issueDate);
          return (
            invDate.getMonth() === monthIndex &&
            invDate.getFullYear() === year &&
            inv.status === "paid"
          );
        })
        .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
      return { month: monthName, revenue: monthRevenue };
    });
  };

  const prepareTimeByProjectData = () => {
    const projectHours = {};
    timeEntries.forEach((entry) => {
      const project = projects.find((p) => p.id === entry.projectId);
      if (project) {
        projectHours[project.name] =
          (projectHours[project.name] || 0) + (entry.duration || 0);
      }
    });

    return Object.entries(projectHours)
      .map(([name, hours]) => ({ name, hours: parseFloat(hours.toFixed(1)) }))
      .slice(0, 6); // Top 6 projects
  };

  const prepareRecentActivities = () => {
    const activities = [];

    // Recent time entries
    timeEntries.slice(0, 3).forEach((entry) => {
      const project = projects.find((p) => p.id === entry.projectId);
      activities.push({
        type: "time_entry",
        title: t("timeTracked"),
        description: t("timeTrackedDesc", {
          duration: formatDecimalHours(entry.duration || 0),
          project: project?.name || t("unknownProject"),
        }),
        timestamp: entry.date,
      });
    });

    // Recent invoices
    invoices.slice(0, 2).forEach((invoice) => {
      activities.push({
        type: "invoice",
        title: t("invoiceCreated"),
        description: t("invoiceCreatedDesc", {
          number: invoice.invoiceNumber,
          amount: invoice.totalAmount?.toFixed(2),
        }),
        timestamp: invoice.issueDate,
      });
    });

    // Sort by timestamp
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6 mt-8 text-center">
        <AnimatedText
          text={t("dashboard")}
          textClassName="text-5xl font-bold text-foreground"
          className="justify-center py-2"
        />
        <p className="mt-2 text-muted-foreground">{t("welcome")}</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid mb-8">
        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">
            {t("totalClients")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {stats?.totalClients || clients.length}
          </p>
          <p className="mt-1 text-sm text-green-500">
            {clients.length > 0
              ? `+${Math.min(2, clients.length)} this month`
              : t("noClientsYet")}
          </p>
        </div>

        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">
            {t("activeProjects")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {stats?.activeProjects ||
              projects.filter((p) => p.status === "active").length}
          </p>
          <p className="mt-1 text-sm text-blue-500">{t("noActiveProjects")}</p>
        </div>

        <div className="card">
          <p className="text-sm font-medium text-muted-foreground">
            {t("hoursThisWeek")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {formatDecimalHours(stats?.hoursThisWeek || 0)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Target: 40h</p>
        </div>

        <div className="card hover:shadow-lg transition-shadow duration-300">
          <p className="text-sm font-medium text-muted-foreground mb-4">
            {t("unbilledAmount")}
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-green-500 font-medium">Paid</span>
              <span className="text-2xl font-bold text-green-600">
                ${stats?.paidAmount?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex flex-col">
              <span className="text-sm text-red-500 font-medium">Unpaid</span>
              <span className="text-2xl font-bold text-red-600">
                ${stats?.unpaidAmount?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-muted-foreground">
            {stats?.pendingCount || 0} {t("invoicesPending")}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">
          {t("quickActions")}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => navigate("/clients")}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("newClient")}
          </Button>
          <Button variant="primary" onClick={() => navigate("/projects")}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("newProject")}
          </Button>
          <Button variant="primary" onClick={() => navigate("/invoices")}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("newInvoice")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/time-tracking")}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("trackTime")}
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid mb-8">
        <div className="card">
          <h2 className="text-lg font-medium text-foreground mb-4">
            {t("revenueOverview")}
          </h2>
          <RevenueChart data={prepareRevenueData()} />
        </div>

        <div className="card">
          <h2 className="text-lg font-medium text-foreground mb-4">
            {t("timeByProject")}
          </h2>
          <TimeByProjectChart data={prepareTimeByProjectData()} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-medium text-foreground mb-4">
          {t("recentActivity")}
        </h2>
        <RecentActivity activities={prepareRecentActivities()} />
      </div>
    </div>
  );
}

export default DashboardPage;
