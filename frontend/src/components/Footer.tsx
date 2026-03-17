import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiGlobe } from "react-icons/fi";
import { useLang } from "../context/LangContext";

const Footer = () => {
  const { t } = useLang();
  return (
    <footer
      className="bg-secondary text-gray-700"
      style={{
        background: "linear-gradient(135deg, #f3f4f6 0%, #fef3c7 100%)",
      }}
    >
      {/* DMK stripe */}
      <div
        className="h-1"
        style={{
          background: "linear-gradient(90deg, #fef3c7 50%, #f3f4f6 50%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center font-bold text-lg text-gray-700">
                க
              </div>
              <div>
                <p className="font-bold text-base text-gray-800">
                  {t("portalName")}
                </p>
                <p className="text-primary-dark text-xs">
                  Government of Tamil Nadu
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("heroDesc")}
            </p>
          </div>
          <div>
            <p className="font-semibold mb-3 text-base text-gray-800">
              {t("quickLinks")}
            </p>
            <div className="flex flex-col gap-2">
              {[
                ["/submit", t("submitGrievance")],
                ["/track", t("trackStatus")],
                ["/forgot-token", t("forgotToken")],
                ["/login?role=minister", t("ministerLogin")],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="text-gray-600 hover:text-primary-dark text-sm transition-colors"
                >
                  → {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-3 text-base text-gray-800">
              {t("contactUs")}
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FiPhone size={14} /> {t("helpline")}: 1800-111-555
              </span>
              <span className="flex items-center gap-2">
                <FiMail size={14} /> grievance@tn.gov.in
              </span>
              <span className="flex items-center gap-2">
                <FiGlobe size={14} /> www.grievance.tn.gov.in
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <p>{t("copyright")}</p>
          <p>{t("designed")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
