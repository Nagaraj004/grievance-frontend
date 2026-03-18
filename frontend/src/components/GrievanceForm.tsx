import { useState, FormEvent, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  submitGrievance,
  clearLastSubmitted,
} from "../store/slices/grievanceSlice";
import { Department, SubmitGrievancePayload } from "../types/grievance";
import Loader from "./Loader";
import {
  FiCheck,
  FiCopy,
  FiDownload,
  FiPrinter,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { useLang } from "../context/LangContext";
import jsPDF from "jspdf";
import OtpModal from "./OtpModal";

const DEPARTMENTS = [
  { en: "Health", ta: "சுகாதாரம்" },
  { en: "Education", ta: "கல்வி" },
  { en: "Water Supply", ta: "குடிநீர் வழங்கல்" },
  { en: "Roads & Infrastructure", ta: "சாலைகள் மற்றும் உட்கட்டமைப்பு" },
  { en: "Electricity", ta: "மின்சாரம்" },
  { en: "Revenue", ta: "வருவாய் துறை" },
  { en: "Police", ta: "காவல் துறை" },
  { en: "Agriculture", ta: "விவசாயம்" },
  { en: "Housing", ta: "வீடமைப்பு" },
  { en: "Social Welfare", ta: "சமூக நலத்துறை" },
  { en: "Other", ta: "மற்றவை" },
];

const CONSTITUENCIES = [
  { en: "Karur", ta: "கரூர்" },
  { en: "Kulithalai", ta: "குளித்தலை" },
  { en: "Aravakurichi", ta: "அரவக்குறிச்சி" },
  { en: "Krishnarayapuram", ta: "கிருஷ்ணராயபுரம்" },
];

/** Generate a random 6-digit OTP string */
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const GrievanceForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, lastSubmitted } = useSelector(
    (s: RootState) => s.grievance
  );
  const { t, lang } = useLang();

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [form, setForm] = useState<SubmitGrievancePayload>({
    name: "",
    mobile: "",
    email: "",
    address: "",
    constituency: "",
    description: "",
    department: "Health",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SubmitGrievancePayload, string>>
  >({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Unable to access camera");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      setSelectedFile(file);
    }, "image/jpeg");
    stopCamera();
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
  };

  /** Generate OTP locally and show it in the modal */
  const sendOtp = () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtp("");
    setOtpModalOpen(true);
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = t("nameRequired");
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = t("invalidMobile");
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t("invalidEmail");
    if (!form.address.trim()) e.address = t("addressRequired");
    if (!form.constituency) e.constituency = t("constituencyRequired");
    if (form.description.trim().length < 20)
      e.description = t("descTooShort");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");
    if (!file) {
      setSelectedFile(null);
      return;
    }
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only PDF, JPG, PNG, DOC, and DOCX files are allowed");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size must be less than 5MB");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
  };

  /** Compare entered OTP against the locally generated one */
  const verifyOtp = () => {
    setOtpLoading(true);
    setTimeout(() => {
      if (otp === generatedOtp) {
        setOtpVerified(true);
        setOtpModalOpen(false);
      } else {
        alert("Invalid OTP. Please try again.");
      }
      setOtpLoading(false);
    }, 500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!otpVerified) {
      sendOtp();
      return;
    }

    const payload: SubmitGrievancePayload = {
      ...form,
      attachment: selectedFile || undefined,
    };

    dispatch(submitGrievance(payload));
  };

  const handleCopy = () => {
    if (lastSubmitted) {
      navigator.clipboard.writeText(lastSubmitted.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    if (!lastSubmitted) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    doc.setFillColor(185, 28, 28);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Tamil Nadu Grievance Portal", pageWidth / 2, 18, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Grievance Submission Receipt", pageWidth / 2, 30, {
      align: "center",
    });
    yPos = 55;

    doc.setDrawColor(185, 28, 28);
    doc.setLineWidth(1);
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, "FD");
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("YOUR GRIEVANCE TOKEN", pageWidth / 2, yPos + 10, {
      align: "center",
    });
    doc.setTextColor(127, 29, 29);
    doc.setFontSize(20);
    doc.setFont("courier", "bold");
    doc.text(lastSubmitted.token, pageWidth / 2, yPos + 25, {
      align: "center",
    });

    yPos += 50;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Grievance Details", margin, yPos);
    yPos += 10;
    doc.setLineWidth(0.5);
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    const details = [
      ["Name:", lastSubmitted.name],
      ["Mobile Number:", lastSubmitted.mobile],
      ["Email:", lastSubmitted.email],
      ["Address:", lastSubmitted.address],
      ["Constituency:", lastSubmitted.constituency],
      ["Department:", lastSubmitted.department],
      ["Status:", lastSubmitted.status],
      ["Submitted Date:", new Date(lastSubmitted.createdAt).toLocaleString()],
    ];

    doc.setFontSize(10);
    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text(label, margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(value, margin + 50, yPos);
      yPos += 8;
    });

    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81);
    doc.text("Description:", margin, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    const descLines = doc.splitTextToSize(
      lastSubmitted.description,
      pageWidth - 2 * margin
    );
    doc.text(descLines, margin, yPos);

    yPos += descLines.length * 5 + 10;
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(2);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 20, "FD");
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Important: ", margin + 3, yPos + 8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Please save this token number. You will need it to track your grievance status.",
      margin + 20,
      yPos + 8
    );

    yPos += 30;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Tamil Nadu Grievance Portal", pageWidth / 2, yPos, {
      align: "center",
    });
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      pageWidth / 2,
      yPos + 5,
      { align: "center" }
    );
    doc.save(`grievance_${lastSubmitted.token}.pdf`);
  };

  const handlePrint = () => {
    if (!lastSubmitted) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const content = `<html><body>${JSON.stringify(lastSubmitted)}</body></html>`;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  if (lastSubmitted) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <FiCheck className="text-green-600" size={36} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t("successTitle")}
        </h2>
        <p className="text-gray-500 mb-6">{t("successDesc")}</p>
        <div className="bg-primary-light border-2 border-dashed border-primary rounded-2xl p-6 mb-6 max-w-sm mx-auto">
          <p className="text-sm text-primary-dark font-medium mb-2">
            {t("uniqueToken")}
          </p>
          <p className="text-3xl font-bold text-primary-dark tracking-widest font-mono">
            {lastSubmitted.token}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm text-primary-dark hover:!text-primary-dark"
            >
              {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
              {copied ? t("copied") : t("copyToken")}
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 text-sm text-primary-dark hover:!text-primary-dark"
            >
              <FiDownload size={14} /> Download PDF
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 text-sm text-primary-dark hover:!text-primary-dark"
            >
              <FiPrinter size={14} /> Print Receipt
            </button>
          </div>
        </div>
        <button
          onClick={() => dispatch(clearLastSubmitted())}
          className="btn-primary"
        >
          {t("submitAnother")}
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Name, Mobile, Email, Constituency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label>{t("fullName")}*</label>
            <input
              className={`input-field ${errors.name ? "border-primary-dark" : ""}`}
              placeholder={t("namePlaceholder")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-primary-dark text-xs">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label>{t("mobileNumber")}*</label>
            <input
              type="tel"
              className={`input-field ${errors.mobile ? "border-primary-dark" : ""}`}
              placeholder={t("mobilePlaceholder")}
              maxLength={10}
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
            {errors.mobile && (
              <p className="text-primary-dark text-xs">{errors.mobile}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label>{t("emailAddress")}*</label>
            <input
              type="email"
              className={`input-field ${errors.email ? "border-primary-dark" : ""}`}
              placeholder={t("emailPlaceholder")}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-primary-dark text-xs">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label>{t("constituency")}*</label>
            <select
              className={`input-field ${errors.constituency ? "border-primary-dark" : ""}`}
              value={form.constituency}
              onChange={(e) =>
                setForm({ ...form, constituency: e.target.value })
              }
            >
              <option value="">{t("selectConstituency")}</option>
              {CONSTITUENCIES.map((c) => (
                <option key={c.en} value={c.en}>
                  {lang === "ta" ? c.ta : c.en}
                </option>
              ))}
            </select>
            {errors.constituency && (
              <p className="text-primary-dark text-xs">{errors.constituency}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label>{t("address")}*</label>
          <textarea
            rows={3}
            className={`input-field resize-none ${errors.address ? "border-primary-dark" : ""}`}
            placeholder={t("addressPlaceholder")}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          {errors.address && (
            <p className="text-primary-dark text-xs">{errors.address}</p>
          )}
        </div>

        {/* Department */}
        <div className="flex flex-col gap-1.5">
          <label>{t("department")}</label>
          <select
            className="input-field"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value as Department })
            }
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.en} value={d.en}>
                {lang === "ta" ? d.ta : d.en}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label>{t("describeYourProblem")}*</label>
          <textarea
            className={`input-field resize-none ${errors.description ? "border-primary-dark" : ""}`}
            placeholder={t("descPlaceholder")}
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && (
            <p className="text-primary-dark text-xs">{errors.description}</p>
          )}
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-1.5">
          <label>{t("attachDocument")}</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            capture="environment"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="input-field cursor-pointer flex items-center justify-between"
          >
            <span>{selectedFile ? selectedFile.name : t("chooseFile")}</span>
            <FiUpload className="text-primary-dark" size={18} />
          </label>
          {selectedFile && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                const input = document.getElementById(
                  "file-upload"
                ) as HTMLInputElement;
                if (input) input.value = "";
              }}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-dark"
            >
              <FiX size={18} />
            </button>
          )}
          {fileError && (
            <p className="text-primary-dark text-xs">{fileError}</p>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={startCamera}
            className="flex items-center gap-2 text-sm text-primary-dark hover:text-primary"
          >
            📷 {t("openCamera")}
          </button>
        </div>

        {cameraStream && (
          <div className="mt-4 space-y-3">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg border"
            />
            <div className="flex gap-3">
              <button type="button" onClick={capturePhoto} className="btn-primary">
                {t("capturePhoto")}
              </button>
              <button type="button" onClick={stopCamera} className="text-gray-500">
                {t("cancel")}
              </button>
            </div>
          </div>
        )}

        {selectedFile && (
          <div className="relative mt-3 w-fit">
            {selectedFile.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="w-40 rounded-lg border"
              />
            ) : (
              <div className="p-3 border rounded-lg bg-gray-50 text-sm">
                {selectedFile.name}
              </div>
            )}
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="absolute -top-2 -right-2 bg-primary-dark text-white rounded-full p-1 shadow hover:bg-primary"
            >
              <FiX size={14} />
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
        >
          {loading ? <Loader size="sm" /> : t("submitBtn2")}
        </button>
      </motion.form>

      {/* ✅ OtpModal outside the form — prevents cancel/close from triggering form submit */}
      <OtpModal
        open={otpModalOpen}
        mobile={form.mobile}
        otp={otp}
        generatedOtp={generatedOtp}
        setOtp={setOtp}
        onVerify={verifyOtp}
        onClose={() => setOtpModalOpen(false)}
        loading={otpLoading}
      />
    </>
  );
};

export default GrievanceForm;