/// <reference types="vite/client" />

import { motion } from "framer-motion";
import { Grievance, GrievanceStatus } from "../types/grievance";
import {
  FiCalendar,
  FiTag,
  FiBookmark,
  FiUser,
  FiPaperclip,
} from "react-icons/fi";
import { formatDate } from "../utils/tokenGenerator";
import { useLang } from "../context/LangContext";

const statusConfig: Record<
  GrievanceStatus,
  { bg: string; text: string; dot: string; bar: string }
> = {
  SUBMITTED: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
  },
  UNDER_REVIEW: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
    bar: "bg-yellow-500",
  },
  ASSIGNED: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
    bar: "bg-orange-500",
  },
  IN_PROGRESS: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
    bar: "bg-purple-500",
  },
  RESOLVED: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
    bar: "bg-green-500",
  },
  CLOSED: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    bar: "bg-gray-400",
  },
};

interface Props {
  grievance: Grievance;
  onClick?: () => void;
  compact?: boolean;
}

const GrievanceCard = ({ grievance, onClick, compact = false }: Props) => {
  const { t } = useLang();

  const sc = statusConfig[grievance.status] ?? {
    bg: "bg-gray-50",
    text: "text-gray-500",
    dot: "bg-gray-400",
    bar: "bg-gray-400",
  };

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className={`h-1.5 ${sc.bar}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary-light p-2 rounded-lg">
              <FiBookmark className="text-primary-dark" size={16} />
            </div>

            <div>
              <p className="font-bold text-gray-900 text-sm font-mono tracking-wide">
                {grievance.token}
              </p>

              {grievance.name && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <FiUser size={11} /> {grievance.name}
                </p>
              )}
            </div>
          </div>

          <span
            className={`status-badge ${sc.bg} ${sc.text} text-xs whitespace-nowrap flex items-center gap-1`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {grievance.status.replace(/_/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <FiTag size={12} />
          <span className="font-medium">{grievance.department}</span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {grievance.description}
        </p>

        {grievance.attachment_url && (
          <a
            href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${grievance.attachment_url}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary-dark hover:text-primary font-medium transition-colors"
          >
            <FiPaperclip size={12} />
            View Attachment
          </a>
        )}

        {!compact && grievance.remarks && (
          <div className="mt-3 p-3 bg-green-50 rounded-xl">
            <p className="text-xs font-semibold text-green-700 mb-0.5">
              {t("officialRemark")}
            </p>
            <p className="text-xs text-green-600">{grievance.remarks}</p>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FiCalendar size={11} />
            {formatDate(grievance.createdAt)}
          </span>

          {grievance.assignedTo && (
            <span className="text-primary-dark font-medium">
              → {grievance.assignedTo}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GrievanceCard;
