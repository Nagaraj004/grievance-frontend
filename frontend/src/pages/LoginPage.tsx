import { useState, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { FiLock, FiUser, FiShield } from "react-icons/fi";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const roleHint =
    (searchParams.get("role") as "admin" | "minister") || "admin";
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(username, password);
    setLoading(false);
    if (result.ok) {
      // Navigate based on actual role from API response
      const role = localStorage.getItem("tn_role");
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError(result.error || t("loginError"));
    }
  };

  const isAdmin = roleHint === "admin";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-stone-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div
          className={`rounded-t-3xl p-8 text-gray-800 text-center ${isAdmin ? "bg-gradient-to-br from-secondary via-primary-light to-secondary" : "bg-gradient-to-br from-primary-light via-primary to-primary-light"}`}
        >
          <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiShield size={30} className="text-gray-700" />
          </div>
          <h1 className="text-2xl font-bold">
            {isAdmin ? t("adminLogin") : t("ministerLogin")}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Karur Grievance Portal
          </p>
        </div>

        <div className="bg-white rounded-b-3xl shadow-xl p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                {t("username")}
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  className="input-field pl-9"
                  placeholder={isAdmin ? "admin" : "minister"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                {t("password")}
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="password"
                  className="input-field pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-primary-dark text-sm bg-primary-light px-3 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-gray-900 font-bold text-base transition-all hover:opacity-90 active:scale-95 shadow-md"
              style={{
                background: isAdmin
                  ? "linear-gradient(135deg, #fcd34d, #f59e0b)"
                  : "linear-gradient(135deg, #fde68a, #f59e0b)",
              }}
            >
              {loading ? "Verifying..." : t("loginBtn")}
            </button>
          </form>

          

          <p className="text-center text-sm text-gray-500">
            {isAdmin ? (
              <a
                href="/login?role=minister"
                className="text-primary-dark hover:underline font-medium"
              >
                Minister Login →
              </a>
            ) : (
              <a
                href="/login?role=admin"
                className="text-gray-700 hover:underline font-medium"
              >
                Admin Login →
              </a>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
