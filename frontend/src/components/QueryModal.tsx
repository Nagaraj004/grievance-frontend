import { useState, useEffect, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend } from "react-icons/fi";
import { Grievance } from "../types/grievance";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { fetchQueries, sendQuery } from "../store/slices/grievanceSlice";

interface QueryModalProps {
  grievance: Grievance;
  onClose: () => void;
}

const QueryModal: FC<QueryModalProps> = ({ grievance, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [queries, setQueries] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadQueries = async () => {
      try {
        const res = await dispatch(fetchQueries(grievance.token)).unwrap();
        setQueries(res);
      } catch (err) {
        console.error("Query load failed", err);
      }
    };

    loadQueries();
  }, [dispatch, grievance.token]);

  const handleSend = async () => {
    if (!reply.trim()) return;

    setSending(true);

    try {
      await dispatch(
        sendQuery({
          token: grievance.token,
          message: reply.trim(),
          sender: "admin",
        }),
      );

      const res = await dispatch(fetchQueries(grievance.token)).unwrap();
      setQueries(res);

      setReply("");
    } catch (err) {
      console.error(err);
    }

    setSending(false);
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
        <motion.div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b">
            <div>
              <p className="text-sm text-gray-500">Queries</p>
              <p className="font-bold">{grievance.token}</p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="p-5 max-h-80 overflow-y-auto flex flex-col gap-3">
            {queries.length === 0 && (
              <p className="text-gray-400 text-center text-sm">
                No queries yet
              </p>
            )}

            {queries.map((q) => {
              const isAdmin = q.sender === "admin";

              const rawDate = q.createdAt;

              const formattedDate = rawDate
                ? new Date(rawDate).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "";

              return (
                <div
                  key={q.id}
                  className={`flex ${
                    isAdmin ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl text-sm max-w-[75%]
        ${
          isAdmin
            ? "bg-primary-dark text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
                  >
                    <p className="text-xs font-semibold mb-1">
                      {isAdmin ? "Admin" : "Citizen"}
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

          {/* Reply */}
          <div className="p-5 border-t">
            <textarea
              rows={3}
              className="w-full border rounded-lg p-2 text-sm resize-none"
              placeholder="Reply to citizen..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />

            <button
              onClick={handleSend}
              disabled={sending || !reply.trim()}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-primary-dark hover:bg-primary text-white py-2 rounded-lg transition-colors"
            >
              <FiSend />
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QueryModal;