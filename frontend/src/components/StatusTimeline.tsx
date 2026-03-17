// import { motion } from 'framer-motion';
// import { GrievanceStatus } from '../types/grievance';
// import { FiCheck, FiClock } from 'react-icons/fi';
// import { useLang } from '../context/LangContext';

// const STAGES: GrievanceStatus[] = ['SUBMITTED','UNDER REVIEW','ASSIGNED','IN PROGRESS','RESOLVED','CLOSED'];

// const stageColors: Record<GrievanceStatus, string> = {
//   SUBMITTED: 'bg-blue-600',
//   'UNDER REVIEW': 'bg-yellow-500',
//   ASSIGNED: 'bg-orange-500',
//   'IN PROGRESS': 'bg-purple-600',
//   RESOLVED: 'bg-green-600',
//   CLOSED: 'bg-gray-400',
// };

// const stageTextColors: Record<GrievanceStatus, string> = {
//   SUBMITTED: 'text-blue-700',
//   'UNDER REVIEW': 'text-yellow-700',
//   ASSIGNED: 'text-orange-700',
//   'IN PROGRESS': 'text-purple-700',
//   RESOLVED: 'text-green-700',
//   CLOSED: 'text-gray-500',
// };

// interface Props { status: GrievanceStatus; }

// const StatusTimeline = ({ status }: Props) => {
//   const { t } = useLang();
//   const currentIdx = STAGES.indexOf(status);

//   const stageLabel: Record<GrievanceStatus, string> = {
//     SUBMITTED: t('submitted'),
//     'UNDER REVIEW': t('underReview'),
//     ASSIGNED: t('assigned'),
//     'IN PROGRESS': t('inProgressLabel'),
//     RESOLVED: t('resolvedLabel'),
//     CLOSED: t('closed'),
//   };
//   const stageDesc: Record<GrievanceStatus, string> = {
//     SUBMITTED: t('submittedDesc'),
//     'UNDER REVIEW': t('underReviewDesc'),
//     ASSIGNED: t('assignedDesc'),
//     'IN PROGRESS': t('inProgressDesc'),
//     RESOLVED: t('resolvedDesc'),
//     CLOSED: t('closedDesc'),
//   };

//   return (
//     <div className="w-full">
//       <h3 className="text-base font-semibold text-gray-700 mb-5">{t('grievanceProgress')}</h3>
//       <div className="relative">
//         {STAGES.map((stage, idx) => {
//           const isDone = idx <= currentIdx;
//           const isCurrent = idx === currentIdx;
//           const isLast = idx === STAGES.length - 1;
//           const bg = isDone ? stageColors[stage] : 'bg-gray-200';
//           const tc = isDone ? stageTextColors[stage] : 'text-gray-400';
//           return (
//             <div key={stage} className="flex gap-4 relative">
//               {!isLast && (
//                 <div className="absolute left-4 top-8 w-0.5 h-full -translate-x-0.5">
//                   <div className={`w-full h-full ${idx < currentIdx ? stageColors[STAGES[idx]] : 'bg-gray-200'}`} />
//                 </div>
//               )}
//               <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: idx * 0.1 }} className="relative z-10 flex-shrink-0">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 transition-all duration-300 ${bg} ${isCurrent ? 'ring-red-200 ring-8' : 'ring-gray-100'}`}>
//                   {isDone ? <FiCheck className="text-white" size={14} strokeWidth={3} /> : <FiClock className="text-gray-400" size={13} />}
//                 </div>
//               </motion.div>
//               <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 + 0.05 }} className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
//                 <p className={`font-semibold text-sm ${tc}`}>
//                   {stageLabel[stage]}
//                   {isCurrent && <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${bg} text-white`}>{t('current')}</span>}
//                 </p>
//                 <p className={`text-xs mt-0.5 ${isDone ? 'text-gray-500' : 'text-gray-300'}`}>{stageDesc[stage]}</p>
//               </motion.div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default StatusTimeline;

import { motion } from "framer-motion";
import { GrievanceStatus } from "../types/grievance";
import { FiCheck, FiClock } from "react-icons/fi";
import { useLang } from "../context/LangContext";

// Define all stages
const STAGES: GrievanceStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

// Colors for each stage
const stageColors: Record<GrievanceStatus, string> = {
  SUBMITTED: "bg-blue-600",
  UNDER_REVIEW: "bg-yellow-500",
  ASSIGNED: "bg-orange-500",
  IN_PROGRESS: "bg-purple-600",
  RESOLVED: "bg-green-600",
  CLOSED: "bg-gray-400",
};

// Text colors
const stageTextColors: Record<GrievanceStatus, string> = {
  SUBMITTED: "text-blue-700",
  UNDER_REVIEW: "text-yellow-700",
  ASSIGNED: "text-orange-700",
  IN_PROGRESS: "text-purple-700",
  RESOLVED: "text-green-700",
  CLOSED: "text-gray-500",
};

interface Props {
  status: GrievanceStatus;
}

const StatusTimeline = ({ status }: Props) => {
  const { t } = useLang();
  const currentIdx = STAGES.indexOf(status);

  // Labels and descriptions (can be localized using t())
  const stageLabel: Record<GrievanceStatus, string> = {
    SUBMITTED: t("submitted"),
    UNDER_REVIEW: t("underReview"),
    ASSIGNED: t("assigned"),
    IN_PROGRESS: t("inProgressLabel"),
    RESOLVED: t("resolvedLabel"),
    CLOSED: t("closed"),
  };

  const stageDesc: Record<GrievanceStatus, string> = {
    SUBMITTED: t("submittedDesc"),
    UNDER_REVIEW: t("underReviewDesc"),
    ASSIGNED: t("assignedDesc"),
    IN_PROGRESS: t("inProgressDesc"),
    RESOLVED: t("resolvedDesc"),
    CLOSED: t("closedDesc"),
  };

  return (
    <div className="w-full">
      <h3 className="text-base font-semibold text-gray-700 mb-5">
        {t("grievanceProgress")}
      </h3>
      <div className="relative">
        {STAGES.map((stage, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const isLast = idx === STAGES.length - 1;
          const bg = isDone ? stageColors[stage] : "bg-gray-200";
          const tc = isDone ? stageTextColors[stage] : "text-gray-400";

          return (
            <div key={stage} className="flex gap-4 relative">
              {/* Vertical line */}
              {!isLast && (
                <div className="absolute left-4 top-8 w-0.5 h-full -translate-x-0.5">
                  <div
                    className={`w-full h-full ${idx < currentIdx ? stageColors[STAGES[idx]] : "bg-gray-200"}`}
                  />
                </div>
              )}

              {/* Stage icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10 flex-shrink-0"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 transition-all duration-300 ${bg} ${
                    isCurrent ? "ring-red-200 ring-8" : "ring-gray-100"
                  }`}
                >
                  {isDone ? (
                    <FiCheck className="text-white" size={14} strokeWidth={3} />
                  ) : (
                    <FiClock className="text-gray-400" size={13} />
                  )}
                </div>
              </motion.div>

              {/* Stage text */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.05 }}
                className={`pb-6 ${isLast ? "pb-0" : ""}`}
              >
                <p className={`font-semibold text-sm ${tc}`}>
                  {stageLabel[stage]}
                  {isCurrent && (
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${bg} text-white`}
                    >
                      {t("current")}
                    </span>
                  )}
                </p>
                <p
                  className={`text-xs mt-0.5 ${isDone ? "text-gray-500" : "text-gray-300"}`}
                >
                  {stageDesc[stage]}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;
