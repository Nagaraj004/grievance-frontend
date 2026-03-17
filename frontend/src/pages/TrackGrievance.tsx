import { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  fetchGrievanceByToken,
  clearCurrentGrievance,
  clearError,
} from "../store/slices/grievanceSlice";
import Loader from "../components/Loader";
import StatusTimeline from "../components/StatusTimeline";
import GrievanceCard from "../components/GrievanceCard";
import { FiSearch } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { useLang } from "../context/LangContext";
import apiClient from "../services/apiClient";

const TrackGrievance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentGrievance, loading, error } = useSelector(
    (s: RootState) => s.grievance,
  );
  const [searchParams] = useSearchParams();
  const { t } = useLang();

  const [token, setToken] = useState("");
  const [tokenErr, setTokenErr] = useState("");

  // Query state
  const [userQuery, setUserQuery] = useState("");
  const [sendingQuery, setSendingQuery] = useState(false);
  const [querySuccess, setQuerySuccess] = useState(false);
  const [queryError, setQueryError] = useState("");

  const [queries, setQueries] = useState<any[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(false);

  // Auto-fetch token from URL
  useEffect(() => {
    const q = searchParams.get("token");
    if (q) {
      setToken(q.toUpperCase());
      dispatch(fetchGrievanceByToken(q.toUpperCase()));
    }
  }, [searchParams, dispatch]);

  // Load queries
  useEffect(() => {
    const loadQueries = async () => {
      if (!currentGrievance) return;

      try {
        setLoadingQueries(true);

        const res = await apiClient.get(
          `/grievances/${currentGrievance.token}/queries`
        );

        setQueries(res.data || []);
      } catch (err) {
        console.error("Query fetch failed", err);
      } finally {
        setLoadingQueries(false);
      }
    };

    loadQueries();
  }, [currentGrievance]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setTokenErr(t("enterToken"));
      return;
    }
    setTokenErr("");
    dispatch(fetchGrievanceByToken(token.trim().toUpperCase()));
  };

  const handleReset = () => {
    dispatch(clearCurrentGrievance());
    dispatch(clearError());
    setToken("");
    setTokenErr("");
  };

  const handleSendQuery = async () => {
    if (!userQuery.trim() || !currentGrievance) return;

    try {
      setSendingQuery(true);
      setQuerySuccess(false);
      setQueryError("");

      await apiClient.post(`/grievances/${currentGrievance.token}/queries`, {
        message: userQuery.trim(),
        sender: "user",
      });

      const res = await apiClient.get(
        `/grievances/${currentGrievance.token}/queries`
      );

      setQueries(res.data || []);

      setQuerySuccess(true);
      setUserQuery("");
    } catch (err: any) {
      console.error("Backend response:", err?.response?.data);
      setQueryError(
        err?.response?.data?.detail?.[0]?.msg || "Failed to send message",
      );
    } finally {
      setSendingQuery(false);
    }
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
              Home / {t("trackStatus")}
            </p>
            <h1 className="text-3xl font-bold">{t("trackGrievance")}</h1>
            <p className="text-gray-600 mt-1">{t("enterTokenDesc")}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <FiSearch className="text-primary-dark" /> {t("grievanceToken")}
          </h2>

          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                className={`input-field font-mono uppercase ${
                  tokenErr ? "border-primary-dark" : ""
                }`}
                placeholder={t("tokenPlaceholder")}
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
              />
              {tokenErr && (
                <p className="text-primary-dark text-xs mt-1">{tokenErr}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary whitespace-nowrap"
            >
              {loading ? <Loader size="sm" /> : t("trackBtnLabel")}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-3">
            {t("dontHaveToken")}{" "}
            <Link
              to="/forgot-token"
              className="text-primary-dark hover:underline font-medium"
            >
              {t("forgotTokenLink")}
            </Link>
          </p>
        </motion.div>

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary-light border border-primary text-primary-dark rounded-2xl p-4 flex items-center justify-between"
          >
            <span>{error}</span>
            <button
              onClick={handleReset}
              className="text-xl text-primary-dark hover:text-primary transition-colors"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Grievance Result */}
        {currentGrievance && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <GrievanceCard grievance={currentGrievance} />

            <div className="card">
              <StatusTimeline status={currentGrievance.status} />
            </div>

            {/* Conversation */}
            <div className="card max-h-64 overflow-y-auto">
              <h3 className="font-bold text-gray-800 mb-3">
                Grievance Communication Log
              </h3>

              {loadingQueries && (
                <p className="text-sm text-gray-400">Loading messages...</p>
              )}

              {!loadingQueries && queries.length === 0 && (
                <p className="text-sm text-gray-400">No messages yet.</p>
              )}

              <div className="flex flex-col gap-2">
                {queries.slice(-4).map((q) => {
                  const isAdmin = q.sender === "admin";

                  const formattedDate = q.createdAt
                    ? new Date(q.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "";

                  return (
                    <div
                      key={q.id}
                      className={`flex ${
                        isAdmin ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                          isAdmin
                            ? "bg-gray-100 text-gray-800"
                            : "bg-primary-dark text-white"
                        }`}
                      >
                        <p className="text-xs font-semibold mb-1">
                          {isAdmin ? "Department" : "You"}
                        </p>

                        <p>{q.message}</p>

                        <p className="text-[10px] opacity-70 mt-1">
                          {formattedDate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Send Query */}
            <div className="card">
              <h3 className="font-bold text-gray-800 mb-2">
                Send a Query About This Grievance
              </h3>

              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Type your message to the department..."
                rows={4}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
              />

              <button
                onClick={handleSendQuery}
                className="mt-3 btn-primary"
                disabled={!userQuery.trim() || sendingQuery}
              >
                {sendingQuery ? "Sending..." : "Send Message"}
              </button>

              {querySuccess && (
                <p className="text-green-600 text-sm mt-2">
                  Your message has been sent successfully.
                </p>
              )}

              {queryError && (
                <p className="text-primary-dark text-sm mt-2">{queryError}</p>
              )}
            </div>
          </motion.div>
        )}

        {!currentGrievance && !loading && (
          <div className="bg-primary-light rounded-2xl p-4 text-sm text-primary-dark">
            <strong>Demo:</strong> Try token{" "}
            <span className="font-mono font-bold">GRV25DEMO01</span> or{" "}
            <span className="font-mono font-bold">GRV25DEMO04</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackGrievance;