import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  fetchGrievancesByMobile,
  clearMobileGrievances,
  clearError,
} from "../store/slices/grievanceSlice";
import GrievanceCard from "../components/GrievanceCard";
import Loader from "../components/Loader";
import { FiPhone } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";

const ForgotToken = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { mobileGrievances, loading, error } = useSelector(
    (s: RootState) => s.grievance,
  );
  const { t } = useLang();
  const [mobile, setMobile] = useState("");
  const [mobileErr, setMobileErr] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileErr(t("invalidMobile"));
      return;
    }
    setMobileErr("");
    dispatch(fetchGrievancesByMobile(mobile));
  };

  return (
    <div>
      <div className="gradient-header text-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-primary-dark text-sm mb-1">
              Home / {t("forgotToken")}
            </p>
            <h1 className="text-3xl font-bold">{t("recoverToken")}</h1>
            <p className="text-gray-600 mt-1">{t("recoverDesc")}</p>
          </motion.div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <FiPhone className="text-primary-dark" /> {t("regMobile")}
          </h2>
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                type="tel"
                className={`input-field ${mobileErr ? "border-primary-dark" : ""}`}
                placeholder={t("mobilePlaceholder")}
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              {mobileErr && (
                <p className="text-primary-dark text-xs mt-1">{mobileErr}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary whitespace-nowrap"
            >
              {loading ? <Loader size="sm" /> : t("findTokens")}
            </button>
          </form>
        </motion.div>

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary-light border border-primary text-primary-dark rounded-2xl p-4 flex justify-between"
          >
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-xl text-primary-dark hover:text-primary transition-colors"
            >
              ×
            </button>
          </motion.div>
        )}

        {mobileGrievances.length > 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold text-gray-700">
                {mobileGrievances.length} {t("grievancesFound")}
              </p>
              <button
                onClick={() => dispatch(clearMobileGrievances())}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                {t("clear")}
              </button>
            </div>
            <div className="space-y-4">
              {mobileGrievances.map((g, i) => (
                <motion.div
                  key={g.token}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <GrievanceCard
                    grievance={g}
                    compact
                    onClick={() => navigate(`/track?token=${g.token}`)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="bg-primary-light rounded-2xl p-4 text-sm text-primary-dark">
          <strong>Demo:</strong> Try{" "}
          <span className="font-mono font-bold">9876543210</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotToken;
