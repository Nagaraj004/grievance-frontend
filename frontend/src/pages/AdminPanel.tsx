// AdminPanel.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  fetchAllGrievances,
  updateStatus,
  deleteGrievance,
} from "../store/slices/grievanceSlice";
import Loader from "../components/Loader";
import { Grievance, GrievanceStatus } from "../types/grievance";
import {
  FiEdit2,
  FiX,
  FiCheck,
  FiChevronDown,
  FiMessageCircle,
  FiPaperclip,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";
import { formatDate } from "../utils/tokenGenerator";
import { useLang } from "../context/LangContext";
import QueryModal from "../components/QueryModal";

const ALL_STATUSES: GrievanceStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const STATUS_COLORS: Record<GrievanceStatus, { bg: string; text: string }> = {
  SUBMITTED:    { bg: "bg-blue-50",   text: "text-blue-700"   },
  UNDER_REVIEW: { bg: "bg-yellow-50", text: "text-yellow-700" },
  ASSIGNED:     { bg: "bg-orange-50", text: "text-orange-700" },
  IN_PROGRESS:  { bg: "bg-purple-50", text: "text-purple-700" },
  RESOLVED:     { bg: "bg-green-50",  text: "text-green-700"  },
  CLOSED:       { bg: "bg-gray-100",  text: "text-gray-600"   },
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  grievance: Grievance;
  onClose: () => void;
  onSave: (token: string, status: GrievanceStatus, assignedTo: string, remarks: string) => void;
  saving: boolean;
}

const EditModal = ({ grievance, onClose, onSave, saving }: EditModalProps) => {
  const { t } = useLang();
  const [status, setStatus]       = useState<GrievanceStatus>(grievance.status);
  const [assignedTo, setAssignedTo] = useState(grievance.assignedTo ?? "");
  const [remarks, setRemarks]     = useState(grievance.remarks ?? "");

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="gradient-header text-gray-800 p-6 flex justify-between items-start">
          <div>
            <p className="text-primary-dark text-sm">{t("editGrievance")}</p>
            <p className="text-xl font-bold font-mono mt-0.5">{grievance.token}</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 p-1">
            <FiX size={22} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
            <strong>{grievance.department}</strong> — {grievance.description.slice(0, 100)}...
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">{t("updateStatus")}</label>
            <div className="relative">
              <select
                className="input-field appearance-none pr-8"
                value={status}
                onChange={(e) => setStatus(e.target.value as GrievanceStatus)}
              >
                {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">{t("assignTo")}</label>
            <input
              className="input-field"
              placeholder={t("assignPlaceholder")}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">{t("officialRemarks")}</label>
            <textarea
              className="input-field resize-none" rows={3}
              placeholder={t("remarksPlaceholder")}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1">{t("cancel")}</button>
            <button
              onClick={() => onSave(grievance.token, status, assignedTo, remarks)}
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving ? <Loader size="sm" /> : <><FiCheck size={16} /> {t("saveChanges")}</>}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

interface DeleteModalProps {
  grievance: Grievance;
  onClose: () => void;
  onConfirm: (token: string) => void;
  deleting: boolean;
}

const DeleteModal = ({ grievance, onClose, onConfirm, deleting }: DeleteModalProps) => {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-red-50 border-b border-red-100 p-6 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FiAlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-red-700 text-sm font-medium">Permanent Action</p>
              <p className="text-lg font-bold text-red-900 font-mono mt-0.5">{grievance.token}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 ml-2">
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            Are you sure you want to permanently delete this grievance? This will remove the
            record and any attached files. <strong className="text-red-600">This cannot be undone.</strong>
          </p>

          {/* Grievance preview */}
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1 border border-gray-100">
            <div className="flex gap-2">
              <span className="font-semibold text-gray-500 w-20 flex-shrink-0">Name</span>
              <span>{grievance.name ?? "—"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-500 w-20 flex-shrink-0">Department</span>
              <span>{grievance.department}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-500 w-20 flex-shrink-0">Status</span>
              <span className={`font-semibold ${STATUS_COLORS[grievance.status].text}`}>
                {grievance.status}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-500 w-20 flex-shrink-0">Filed on</span>
              <span>{formatDate(grievance.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="btn-secondary flex-1" disabled={deleting}>
              {t("cancel")}
            </button>
            <button
              onClick={() => onConfirm(grievance.token)}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700
                         text-white font-bold py-2.5 px-4 rounded-2xl text-sm transition-all
                         duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm
                         hover:shadow-md hover:-translate-y-0.5 active:scale-100"
            >
              {deleting
                ? <Loader size="sm" />
                : <><FiTrash2 size={14} /> Delete Permanently</>
              }
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Admin Panel ──────────────────────────────────────────────────────────────

const AdminPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { grievances, loading } = useSelector((s: RootState) => s.grievance);
  const { t } = useLang();

  const [editing, setEditing]           = useState<Grievance | null>(null);
  const [saving, setSaving]             = useState(false);
  const [deleting, setDeleting]         = useState<Grievance | null>(null);
  const [deletingToken, setDeletingToken] = useState<string | null>(null);
  const [queryGrievance, setQueryGrievance] = useState<Grievance | null>(null);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<GrievanceStatus | "ALL">("ALL");

  useEffect(() => {
    dispatch(fetchAllGrievances());
  }, [dispatch]);

  const filtered = grievances.filter((g) => {
    const matchStatus = statusFilter === "ALL" || g.status === statusFilter;
    const matchSearch =
      !search ||
      g.token.includes(search.toUpperCase()) ||
      g.name?.toLowerCase().includes(search.toLowerCase()) ||
      g.department.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleSave = async (
    token: string,
    status: GrievanceStatus,
    assignedTo: string,
    remarks: string,
  ) => {
    setSaving(true);
    await dispatch(updateStatus({ token, status, assignedTo, remarks }));
    setSaving(false);
    setEditing(null);
  };

  const handleDelete = async (token: string) => {
    setDeletingToken(token);
    await dispatch(deleteGrievance(token));
    setDeletingToken(null);
    setDeleting(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="gradient-header text-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary-dark text-sm mb-1">Admin / {t("admin")}</p>
            <h1 className="text-3xl font-bold">{t("adminPanel")}</h1>
            <p className="text-gray-600 mt-1">{t("manageGrievances")}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6 flex flex-col sm:flex-row gap-3 shadow-sm">
          <input
            className="input-field flex-1 !py-2 !text-sm"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-field !py-2 !text-sm w-full sm:w-52"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as GrievanceStatus | "ALL")}
          >
            <option value="ALL">{t("allStatuses")}</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <Loader text="Loading..." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {[
                      "Token", "Name", "Department", "Description",
                      "Status", "Date", "Assigned To", "Attachments",
                      "Queries", "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g, i) => {
                    const sc = STATUS_COLORS[g.status];
                    const isBeingDeleted = deletingToken === g.token;

                    return (
                      <motion.tr
                        key={g.token}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isBeingDeleted ? 0.4 : 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-gray-50 hover:bg-yellow-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-primary-dark text-xs">
                            {g.token}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{g.name}</td>
                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap text-xs">{g.department}</td>
                        <td className="py-3 px-4 text-gray-500 max-w-[200px]">
                          <span className="line-clamp-2 text-xs">{g.description}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`status-badge ${sc.bg} ${sc.text} text-xs`}>
                            {g.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">
                          {formatDate(g.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                          {g.assignedTo ?? "—"}
                        </td>

                        {/* Attachments */}
                        <td className="py-3 px-4 text-xs">
                          {g.attachments && g.attachments.length > 0 ? (
                            g.attachments.map((a, idx) => (
                              <a
                                key={idx}
                                href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${a.url}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-yellow-700 hover:text-yellow-900 hover:underline mb-1 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FiPaperclip size={12} /> {a.filename || "Attachment"}
                              </a>
                            ))
                          ) : g.attachment_url ? (
                            <a
                              href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${g.attachment_url}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-yellow-700 hover:text-yellow-900 hover:underline transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiPaperclip size={12} /> View
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Queries */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setQueryGrievance(g)}
                            className="flex items-center justify-center gap-1 text-xs text-yellow-800 hover:text-yellow-900 font-semibold transition-colors"
                          >
                            <FiMessageCircle size={14} /> View
                          </button>
                        </td>

                        {/* Actions: Edit + Delete */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditing(g)}
                              className="flex items-center gap-1.5 text-xs bg-primary-light hover:bg-primary text-primary-dark px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap"
                            >
                              <FiEdit2 size={12} /> {t("edit")}
                            </button>
                            <button
                              onClick={() => setDeleting(g)}
                              disabled={isBeingDeleted}
                              className="flex items-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiTrash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-gray-400">
                        No grievances found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
              {t("showing")} {filtered.length} {t("of")} {grievances.length} {t("records")}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editing && (
          <EditModal
            grievance={editing}
            onClose={() => setEditing(null)}
            onSave={handleSave}
            saving={saving}
          />
        )}
        {deleting && (
          <DeleteModal
            grievance={deleting}
            onClose={() => setDeleting(null)}
            onConfirm={handleDelete}
            deleting={deletingToken === deleting.token}
          />
        )}
        {queryGrievance && (
          <QueryModal
            grievance={queryGrievance}
            onClose={() => setQueryGrievance(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;