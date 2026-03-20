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
      // Auto-dismiss banner after 12s
      const dismiss = setTimeout(() => setShowSmsBanner(false), 13200);
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

  // Lock body scroll on mobile when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleBannerTap = () => {
    if (generatedOtp) {
      setOtp(generatedOtp);
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
            // Responsive: safe margins on all screen sizes
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]
                       w-[calc(100vw-2rem)] max-w-sm cursor-pointer select-none"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl
                            border border-gray-100 px-3 py-2.5 sm:px-4 sm:py-3
                            flex items-start gap-2.5 sm:gap-3">
              {/* App icon */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-green-500
                              flex items-center justify-center shrink-0 mt-0.5 shadow">
                <FiMessageSquare className="text-white" size={18} />
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
                className="text-gray-300 hover:text-gray-500 shrink-0 mt-0.5 p-1"
              >
                <FiX size={14} />
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              className="h-0.5 bg-primary rounded-full mt-1 mx-1"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 12, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OTP Modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            // Mobile: bottom-sheet. sm+: centered modal
            className="fixed inset-0 bg-black/40 flex items-end sm:items-center
                       justify-center z-50 p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              // Slide up from bottom on mobile, scale in on desktop
              initial={{ y: "100%", opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white w-full sm:max-w-md
                         rounded-t-3xl sm:rounded-2xl
                         shadow-xl px-5 pt-4 pb-8 sm:p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle pill — visible on mobile only */}
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-700
                           p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10
                                flex items-center justify-center shrink-0">
                  <FiMessageSquare className="text-primary-dark" size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
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
                  className="bg-amber-50 border border-amber-200 rounded-xl
                             px-4 py-2.5 mb-4 text-xs text-amber-700
                             flex items-center gap-2"
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
                className="btn-primary w-full mt-5 flex items-center justify-center
                           gap-2 py-3.5 sm:py-3"
              >
                {loading ? <Loader size="sm" /> : "Verify OTP"}
              </button>

              <button
                onClick={onClose}
                disabled={loading}
                className="w-full mt-2 py-3 sm:py-2 text-sm text-gray-500
                           hover:text-gray-700 transition-colors"
              >
                Cancel
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

/** Segmented 6-box OTP input — responsive sizing via clamp */
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

  // Handle paste — fills all 6 boxes at once (important for SMS autofill on mobile)
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted.padEnd(value.length, value.slice(pasted.length)).slice(0, 6));
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs[nextIdx][0]?.focus();
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
    <div className="flex gap-2 sm:gap-2.5 justify-center">
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
          onPaste={i === 0 ? handlePaste : undefined}
          // clamp ensures 6 boxes always fit on any screen width
          style={{
            width: "clamp(36px, 13vw, 48px)",
            height: "clamp(40px, 12vw, 52px)",
          }}
          className={`text-center text-lg font-bold rounded-xl border-2 outline-none transition-all
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