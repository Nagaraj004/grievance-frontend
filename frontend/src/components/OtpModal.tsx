import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMessageSquare } from "react-icons/fi";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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

  useEffect(() => {
    if (open && generatedOtp) {
      setBannerDismissed(false);
      const timer   = setTimeout(() => setShowSmsBanner(true), 1200);
      const dismiss = setTimeout(() => setShowSmsBanner(false), 13200);
      return () => {
        clearTimeout(timer);
        clearTimeout(dismiss);
      };
    }
  }, [open, generatedOtp]);

  useEffect(() => {
    if (!open) {
      setShowSmsBanner(false);
      setBannerDismissed(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  const handleBannerTap = () => {
    if (generatedOtp) setOtp(generatedOtp);
    setShowSmsBanner(false);
    setBannerDismissed(true);
  };

  const handleDismissBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSmsBanner(false);
    setBannerDismissed(true);
  };

  return createPortal(
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
              style={{
                position: "fixed",
                top: 12,
                left: 0,
                right: 0,
                margin: "0 auto",
                width: "calc(100% - 1.5rem)", // FIXED
                maxWidth: 384,
                zIndex: 9999,
                cursor: "pointer",
                userSelect: "none",
              }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl
                            border border-gray-100 px-3 py-2.5
                            flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-green-500
                              flex items-center justify-center shrink-0 mt-0.5 shadow">
                <FiMessageSquare className="text-white" size={17} />
              </div>
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
              <button
                onClick={handleDismissBanner}
                className="text-gray-300 hover:text-gray-500 shrink-0 mt-0.5 p-1"
              >
                <FiX size={14} />
              </button>
            </div>
            <motion.div
              className="h-0.5 bg-primary rounded-full mt-1 mx-1"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 12, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OTP Modal Backdrop ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 50,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: "1rem",
              boxSizing: "border-box",
            }}
          >
            {/* ── Modal Card ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 400,
                boxSizing: "border-box",
                background: "#fff",
                borderRadius: "24px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                position: "relative",
                padding: "24px 20px 32px",
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                style={{ position: "absolute", top: 16, right: 12 }}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={18} />
              </button>

              {/* ── Header block — fully centered ── */}
              <div className="flex flex-col items-center text-center w-full mb-5 px-6">
                <div className="flex items-center justify-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FiMessageSquare className="text-primary-dark" size={18} />
                  </div>
                  <h2 className="text-sm sm:text-xl font-bold text-gray-800 leading-tight">
                    Verify Mobile Number
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  OTP sent to{" "}
                  <span className="font-semibold text-gray-700">+91 {mobile}</span>
                </p>
              </div>

              {/* Hint banner */}
              {bannerDismissed && !otp && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-xl
                             px-3 py-2 mb-4 text-xs text-amber-700
                             flex items-start gap-2"
                >
                  <span className="mt-0.5">💡</span>
                  <span>
                    Missed the notification? Check your SMS or{" "}
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

              {/* OTP boxes */}
              <OtpInputBoxes value={otp} onChange={setOtp} />

              {/* Verify button */}
              <button
                onClick={onVerify}
                disabled={loading || otp.length !== 6}
                className="btn-primary w-full mt-5 flex items-center justify-center
                           gap-2 py-3.5 text-sm sm:text-base
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                
                {loading ? <Loader size="sm" /> : "Verify OTP"}
              </button>

              {/* Cancel */}
              <button
                onClick={onClose}
                disabled={loading}
                className="w-full mt-2 py-2.5 text-sm text-gray-500
                           hover:text-gray-700 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              {/* Footer note */}
              <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-3 leading-relaxed">
                Please verify your mobile number before submitting the grievance
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};

// ── Segmented 6-box OTP input ─────────────────────────────────────────────────

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
    if (digit && index < 5) inputRefs[index + 1][0]?.focus();
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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted.padEnd(value.length, value.slice(pasted.length)).slice(0, 6));
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs[nextIdx][0]?.focus();
    }
  };

  useEffect(() => {
    if (value.length === 6) inputRefs[5][0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
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
          style={{
            flex: "1 1 0",
            minWidth: 0,
            maxWidth: 52,
            height: "clamp(44px, 11vw, 56px)",
            fontSize: "clamp(16px, 4vw, 22px)",
            textAlign: "center",
            fontWeight: 700,
            borderRadius: 12,
            border: `2px solid ${value[i] ? "var(--color-primary, #f59e0b)" : "#e5e7eb"}`,
            background: value[i] ? "rgba(245,158,11,0.05)" : "#fff",
            color: value[i] ? "var(--color-primary-dark, #92400e)" : "#1f2937",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s, background 0.15s",
          }}
        />
      ))}
    </div>
  );
};

export default OtpModal;