import { motion } from "framer-motion";
import GrievanceForm from "../components/GrievanceForm";
import { useLang } from "../context/LangContext";

const SubmitGrievance = () => {
  const { t } = useLang();
  return (
    <div>
      <div className="gradient-header text-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-primary-dark text-sm mb-1">
              Home / {t("submitGrievance")}
            </p>
            <h1 className="text-3xl font-bold">{t("fileGrievance")}</h1>
            <p className="text-gray-600 mt-1">{t("processedIn")}</p>
          </motion.div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <GrievanceForm />
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitGrievance;
