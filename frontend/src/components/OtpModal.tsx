import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import Loader from "./Loader";

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
  return (
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

            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Verify Mobile Number
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              OTP for{" "}
              <span className="font-semibold">{mobile}</span>
            </p>

            {/* Generated OTP Display */}
            {generatedOtp && (
              <div className="bg-primary-light border border-dashed border-primary rounded-xl px-4 py-3 mb-5 text-center">
                <p className="text-xs text-gray-500 mb-1">Your OTP is</p>
                <p className="text-3xl font-bold font-mono tracking-widest text-primary-dark">
                  {generatedOtp}
                </p>
              </div>
            )}

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6 digit OTP"
              className="input-field text-center tracking-widest text-lg"
            />

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
  );
};

export default OtpModal;