import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchAllGrievances, fetchStats } from "../store/slices/grievanceSlice";
import GrievanceCard from "../components/GrievanceCard";
import Loader from "../components/Loader";
import { Grievance, GrievanceStatus, Department } from "../types/grievance";
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiFilter,
} from "react-icons/fi";
import { useLang } from "../context/LangContext";


import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

const ALL_STATUSES: GrievanceStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const DEPARTMENTS = [
  { en: "Health", ta: "சுகாதாரம்" },
  { en: "Education", ta: "கல்வி" },
  { en: "Water Supply", ta: "குடிநீர் வழங்கல்" },
  { en: "Roads & Infrastructure", ta: "சாலைகள் மற்றும் உட்கட்டமைப்பு" },
  { en: "Electricity", ta: "மின்சாரம்" },
  { en: "Revenue", ta: "வருவாய் துறை" },
  { en: "Police", ta: "காவல் துறை" },
  { en: "Agriculture", ta: "விவசாயம்" },
  { en: "Housing", ta: "வீடமைப்பு" },
  { en: "Social Welfare", ta: "சமூக நலத்துறை" },
  { en: "Other", ta: "மற்றவை" },
];

const COLORS = [
  "#f59e0b",
  "#fbbf24",
  "#06b6d4",
  "#10b981",
  "#6366f1",
  "#9ca3af",
];

const MinisterDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { grievances, loading, stats, total } = useSelector(
    (s: RootState) => s.grievance,
  );

  const { t, lang } = useLang();
  

  const [statusFilter] = useState<GrievanceStatus | "ALL">("ALL");
  const [deptFilter, setDeptFilter] = useState<Department | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const loadData = () => {
    dispatch(fetchAllGrievances({ limit: 500 }));
    dispatch(fetchStats());
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const filtered = grievances.filter((g) => {
    const matchStatus = statusFilter === "ALL" || g.status === statusFilter;
    const matchDept = deptFilter === "ALL" || g.department === deptFilter;
    const matchSearch =
      !search ||
      g.token.includes(search.toUpperCase()) ||
      g.name?.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchDept && matchSearch;
  });

  const statusChartData = ALL_STATUSES.map((s) => ({
    name: s,
    value: grievances.filter((g) => g.status === s).length,
  }));

  const departmentChartData = DEPARTMENTS.map((d) => ({
    name: d.en,
    value: grievances.filter((g) => g.department === d.en).length,
  }));

  const trendData = [
    { name: "Submitted", value: stats?.submitted || 0 },
    { name: "In Progress", value: stats?.in_progress || 0 },
    { name: "Resolved", value: stats?.resolved || 0 },
    { name: "Closed", value: stats?.closed || 0 },
  ];

  const statCards = [
    {
      label: t("totalGrievancesCard"),
      value: stats?.total ?? total,
      icon: FiFileText,
      color: "from-yellow-400 to-amber-500",
    },
    {
      label: t("pendingReview"),
      value: stats?.submitted ?? 0,
      icon: FiAlertCircle,
      color: "from-orange-400 to-amber-500",
    },
    {
      label: t("inProgress"),
      value: stats?.in_progress ?? 0,
      icon: FiClock,
      color: "from-cyan-400 to-blue-500",
    },
    {
      label: t("resolved"),
      value: (stats?.resolved ?? 0) + (stats?.closed ?? 0),
      icon: FiCheckCircle,
      color: "from-emerald-400 to-green-500",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="gradient-header py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-white/80 backdrop-blur-lg border border-gray-100 shadow-xl rounded-2xl p-6"
          >
            <p className="text-sm text-gray-600">Minister / {t("dashboard")}</p>
            <h1 className="text-3xl font-bold mt-2">
              {t("grievanceDashboard")}
            </h1>
            <p className="text-gray-600 mt-1">{t("overview")}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-gradient-to-br ${s.color} rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className="bg-white/30 backdrop-blur-md p-3 rounded-xl shadow-sm">
                  <s.icon size={18} />
                </div>
                <span className="text-2xl font-bold">{s.value}</span>
              </div>
              <p className="text-sm mt-3 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Status Distribution */}
          <div className="card bg-white rounded-2xl shadow-md border border-gray-100 p-5 outline-none focus:outline-none">
            <h3 className="font-semibold text-gray-700 text-sm mb-4">
              Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart style={{ outline: "none" }} tabIndex={-1}>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  style={{ outline: "none" }}
                  tabIndex={-1}
                >
                  {statusChartData.map((_entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Department Complaints */}
          <div className="card bg-white rounded-2xl shadow-md border border-gray-100 p-5 outline-none focus:outline-none">
            <h3 className="font-semibold text-gray-700 text-sm mb-4">
              Department Complaints
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={departmentChartData}
                style={{ outline: "none" }}
                tabIndex={-1}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis
                  allowDecimals={false}
                  tabIndex={-1}
                  style={{ outline: "none" }}
                />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#fbbf24"
                  radius={[8, 8, 0, 0]}
                  tabIndex={-1}
                  style={{ outline: "none" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grievance Trend */}
          <div className="card bg-white rounded-2xl shadow-md border border-gray-100 p-5 outline-none focus:outline-none">
            <h3 className="font-semibold text-gray-700 text-sm mb-4">
              Grievance Trend
            </h3>
            <ResponsiveContainer
              width="100%"
              height={250}
              style={{ outline: "none" }}
            >
              <AreaChart
                data={trendData}
                style={{ outline: "none" }}
                tabIndex={-1}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  style={{ outline: "none" }}
                  tabIndex={-1}
                />
                <YAxis
                  allowDecimals={false}
                  tabIndex={-1}
                  style={{ outline: "none" }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  fill="#fbbf24"
                  fillOpacity={0.3}
                  style={{ outline: "none" }}
                  tabIndex={-1}
                  activeDot={{
                    tabIndex: -1,
                    style: { outline: "none", boxShadow: "none" },
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="accent-panel mb-8 flex flex-col sm:flex-row gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <FiFilter className="text-gray-400 mt-3" />
          <input
            className="input-field flex-1 !py-2 !text-sm"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-field !py-2 !text-sm w-full sm:w-48"
            value={deptFilter}
            onChange={(e) =>
              setDeptFilter(e.target.value as Department | "ALL")
            }
          >
            <option value="ALL">{t("allDepartments")}</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.en} value={d.en}>
                {lang === "ta" ? d.ta : d.en}
              </option>
            ))}
          </select>
        </div>

        {/* Grievances */}
        {loading ? (
          <Loader text="Loading..." />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {t("showing")} <strong>{filtered.length}</strong> {t("of")}{" "}
              <strong>{grievances.length}</strong> {t("grievances")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((g: Grievance, i) => (
                <motion.div
                  key={g.token}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <GrievanceCard grievance={g} />
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16 text-gray-400">
                  <FiFileText size={40} className="mx-auto mb-3 opacity-40" />
                  <p className="text-lg font-medium text-gray-500">
                    No grievances match your filters
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Global style — removes all Recharts focus outlines */}
      <style>{`
        .recharts-wrapper,
        .recharts-wrapper:focus,
        .recharts-wrapper:focus-visible,
        .recharts-surface,
        .recharts-surface:focus,
        .recharts-surface:focus-visible,
        .recharts-bar-rectangle,
        .recharts-bar-rectangle:focus,
        .recharts-bar-rectangle:focus-visible,
        .recharts-area:focus,
        .recharts-area:focus-visible,
        .recharts-area-area,
        .recharts-area-area:focus,
        .recharts-area-curve,
        .recharts-area-curve:focus,
        .recharts-curve:focus,
        .recharts-curve:focus-visible,
        .recharts-layer,
        .recharts-layer:focus,
        .recharts-layer:focus-visible,
        .recharts-bar:focus,
        .recharts-bar:focus-visible,
        .recharts-dot:focus,
        .recharts-dot:focus-visible,
        .recharts-active-dot:focus,
        .recharts-active-dot:focus-visible,
        svg:focus,
        svg:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};

export default MinisterDashboard;
