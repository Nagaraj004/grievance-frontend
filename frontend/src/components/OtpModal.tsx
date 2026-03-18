import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMessageSquare } from "react-icons/fi";
import Loader from "./Loader";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  mobile: string;
  otp: string;
  generatedOtp: string | null;
  setOtp: (v: string) => void;
  onVerify: () => void;
  onClose: () => void;
  loading: boolean;
};

const OtpModal = ({
  open,
  mobile,
  otp,
  generatedOtp,
  setOtp,
  onVerify,
  onClose,
  loading,
}: Props) => {
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Trigger SMS banner 1.2s after modal opens
  useEffect(() => {
    if (open && generatedOtp) {
      setBannerDismissed(false);
      const timer = setTimeout(() => setShowSmsBanner(true), 1200);
      // Auto-dismiss banner after 6s
      const dismiss = setTimeout(() => setShowSmsBanner(false), 7200);
      return () => {
        clearTimeout(timer);
        clearTimeout(dismiss);
      };
    }
  }, [open, generatedOtp]);

  // Reset banner state when modal closes
  useEffect(() => {
    if (!open) {
      setShowSmsBanner(false);
      setBannerDismissed(false);
    }
  }, [open]);

  const handleBannerTap = () => {
    if (generatedOtp) {
      setOtp(generatedOtp); // auto-fill OTP
    }
    setShowSmsBanner(false);
    setBannerDismissed(true);
  };

  const handleDismissBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSmsBanner(false);
    setBannerDismissed(true);
  };

  return (
    <>
      {/* ── SMS Notification Banner ── */}
      <AnimatePresence>
        {showSmsBanner && generatedOtp && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={handleBannerTap}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-sm cursor-pointer select-none"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 px-4 py-3 flex items-start gap-3">
              {/* App icon */}
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0 mt-0.5 shadow">
                <FiMessageSquare className="text-white" size={20} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-gray-800 tracking-wide uppercase">
                    Messages
                  </span>
                  <span className="text-[10px] text-gray-400">now</span>
                </div>
                <p className="text-xs font-medium text-gray-700 leading-snug truncate">
                  TN-GRIEVANCE
                </p>
                <p className="text-xs text-gray-500 leading-snug mt-0.5">
                  Your OTP is{" "}
                  <span className="font-bold text-gray-800 tracking-widest">
                    {generatedOtp}
                  </span>
                  . Valid for 10 mins. Do not share.
                </p>
                <p className="text-[10px] text-primary mt-1 font-medium">
                  Tap to autofill →
                </p>
              </div>

              {/* Dismiss */}
              <button
                onClick={handleDismissBanner}
                className="text-gray-300 hover:text-gray-500 shrink-0 mt-0.5"
              >
                <FiX size={15} />
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              className="h-0.5 bg-primary rounded-full mt-1 mx-1"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OTP Modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FiMessageSquare className="text-primary-dark" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Verify Mobile Number
                </h2>
              </div>

              <p className="text-sm text-gray-500 mb-5 ml-[52px]">
                OTP sent to{" "}
                <span className="font-semibold text-gray-700">
                  +91 {mobile}
                </span>
              </p>

              {/* Hint if banner was dismissed without autofill */}
              {bannerDismissed && !otp && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-amber-700 flex items-center gap-2"
                >
                  <span>💡</span>
                  <span>
                    Missed the notification? Check your SMS inbox or{" "}
                    <button
                      type="button"
                      className="underline font-semibold"
                      onClick={() => generatedOtp && setOtp(generatedOtp)}
                    >
                      tap here to autofill
                    </button>
                    .
                  </span>
                </motion.div>
              )}

              {/* OTP input boxes */}
              <OtpInputBoxes value={otp} onChange={setOtp} />

              <button
                onClick={onVerify}
                disabled={loading || otp.length !== 6}
                className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
              >
                {loading ? <Loader size="sm" /> : "Verify OTP"}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Please verify your mobile number before submitting the grievance
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/** Segmented 6-box OTP input */
const OtpInputBoxes = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const inputRefs = Array.from({ length: 6 }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState<HTMLInputElement | null>(null)
  );

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);
    const arr = value.split("");
    arr[index] = digit;
    onChange(arr.slice(0, 6).join("").replace(/[^0-9]/g, ""));

    if (digit && index < 5) {
      inputRefs[index + 1][0]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const arr = value.split("");
      if (arr[index]) {
        arr[index] = "";
        onChange(arr.join(""));
      } else if (index > 0) {
        inputRefs[index - 1][0]?.focus();
      }
    }
  };

  // When value is set programmatically (autofill), focus last filled box
  useEffect(() => {
    if (value.length === 6) {
      inputRefs[5][0]?.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          ref={(el) => { inputRefs[i][1](el); }}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-11 h-12 text-center text-lg font-bold rounded-xl border-2 outline-none transition-all
            ${value[i]
              ? "border-primary bg-primary/5 text-primary-dark"
              : "border-gray-200 text-gray-800"
            }
            focus:border-primary focus:bg-primary/5`}
        />
      ))}
    </div>
  );
};

export default OtpModal;