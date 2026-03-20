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
  { en: "Health",                 ta: "சுகாதாரம்" },
  { en: "Education",              ta: "கல்வி" },
  { en: "Water Supply",           ta: "குடிநீர் வழங்கல்" },
  { en: "Roads & Infrastructure", ta: "சாலைகள் மற்றும் உட்கட்டமைப்பு" },
  { en: "Electricity",            ta: "மின்சாரம்" },
  { en: "Revenue",                ta: "வருவாய் துறை" },
  { en: "Police",                 ta: "காவல் துறை" },
  { en: "Agriculture",            ta: "விவசாயம்" },
  { en: "Housing",                ta: "வீடமைப்பு" },
  { en: "Social Welfare",         ta: "சமூக நலத்துறை" },
  { en: "Other",                  ta: "மற்றவை" },
];

const CONSTITUENCIES = [
  { en: "Karur",            ta: "கரூர்" },
  { en: "Kulithalai",       ta: "குளித்தலை" },
  { en: "Aravakurichi",     ta: "அரவக்குறிச்சி" },
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

  const [otpModalOpen,  setOtpModalOpen]  = useState(false);
  const [otp,           setOtp]           = useState("");
  const [generatedOtp,  setGeneratedOtp]  = useState<string | null>(null);
  const [otpLoading,    setOtpLoading]    = useState(false);
  const [otpVerified,   setOtpVerified]   = useState(false);

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
  const [fileError,    setFileError]    = useState<string>("");
  const [copied,       setCopied]       = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Camera helpers ──────────────────────────────────────────────────────────
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
    canvas.width  = videoRef.current.videoWidth;
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

  // ── OTP helpers ─────────────────────────────────────────────────────────────
  const sendOtp = () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtp("");
    setOtpModalOpen(true);
  };

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

  // ── Form validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim())                    e.name         = t("nameRequired");
    if (!/^[6-9]\d{9}$/.test(form.mobile))   e.mobile       = t("invalidMobile");
    if (!/\S+@\S+\.\S+/.test(form.email))    e.email        = t("invalidEmail");
    if (!form.address.trim())                 e.address      = t("addressRequired");
    if (!form.constituency)                   e.constituency = t("constituencyRequired");
    if (form.description.trim().length < 20) e.description  = t("descTooShort");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");
    if (!file) { setSelectedFile(null); return; }
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!otpVerified) { sendOtp(); return; }
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

  // ── PDF DOWNLOAD ─────────────────────────────────────────────────────────────
  // Header is drawn on an off-screen canvas so Tamil text is rendered by the
  // browser (which supports Tamil fonts) and then embedded as a PNG image.
  // jsPDF's built-in fonts cannot render Tamil script natively.
  // ─────────────────────────────────────────────────────────────────────────────
  const handleDownloadPDF = () => {
    if (!lastSubmitted) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
    const margin = 16;
    let yPos = 0;

    // ── STEP 1: Draw homepage header on an off-screen canvas ──────────────────
    const SCALE       = 3;           // 3× for retina-sharp output
    const A4_PX_W     = 794 * SCALE; // A4 at 96 dpi × scale
    const HEADER_PX_H = 160 * SCALE; // header height (no images, no buttons)

    const hCanvas  = document.createElement("canvas");
    hCanvas.width  = A4_PX_W;
    hCanvas.height = HEADER_PX_H;
    const ctx      = hCanvas.getContext("2d")!;

    // ① Golden gradient — matches homepage gradient-header
    const grad = ctx.createLinearGradient(0, 0, A4_PX_W, HEADER_PX_H);
    grad.addColorStop(0,    "#fbbf24"); // amber-400
    grad.addColorStop(0.45, "#fcd34d"); // amber-300 bright centre
    grad.addColorStop(1,    "#f59e0b"); // amber-500
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, A4_PX_W, HEADER_PX_H);

    // ② Subtle dot pattern overlay — mirrors CSS radial-gradient dots
    ctx.fillStyle = "rgba(255,255,255,0.09)";
    for (let x = 0; x < A4_PX_W; x += 50 * SCALE) {
      for (let y = 0; y < HEADER_PX_H; y += 50 * SCALE) {
        ctx.beginPath();
        ctx.arc(x, y, 2 * SCALE, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ③ Shield badge pill — top centre
    const badgeText  = "🛡  நமது முயற்சி.. கரூர் வளர்ச்சி..";
    ctx.font         = `${13 * SCALE}px 'Noto Sans Tamil', 'Latha', Arial, sans-serif`;
    const badgeTextW = ctx.measureText(badgeText).width;
    const pillW      = badgeTextW + 30 * SCALE;
    const pillH      = 24 * SCALE;
    const pillX      = (A4_PX_W - pillW) / 2;
    const pillY      = 15 * SCALE;
    ctx.fillStyle    = "rgba(251,243,199,0.80)";
    ctx.beginPath();
    // @ts-ignore — roundRect is available in all modern browsers
    ctx.roundRect(pillX, pillY, pillW, pillH, 12 * SCALE);
    ctx.fill();
    ctx.fillStyle    = "#92400e";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, A4_PX_W / 2, pillY + pillH / 2);

    // ④ Main Tamil heading
    ctx.fillStyle    = "#78350f";
    ctx.textAlign    = "center";
    ctx.textBaseline = "alphabetic";
    ctx.font = `bold ${28 * SCALE}px 'Noto Sans Tamil', 'Latha', Arial, sans-serif`;
    ctx.fillText(
      "கரூர் மாவட்ட மக்களின் குறைதீர் தளம்.!",
      A4_PX_W / 2,
      72 * SCALE
    );

    // ⑤ Description — 2 lines (heroDesc)
    ctx.fillStyle = "#92400e";
    ctx.font = `${12 * SCALE}px 'Noto Sans Tamil', 'Latha', Arial, sans-serif`;
    ctx.fillText(
      "கரூர் மக்களின் குறைகளை தீர்க்க உங்கள் சகோதரர் V.செந்தில் பாலாஜி",
      A4_PX_W / 2,
      100 * SCALE
    );
    ctx.fillText(
      "அவர்களால் ஏற்படுத்தப்பட்ட இணையதள புகார்தளம்.",
      A4_PX_W / 2,
      118 * SCALE
    );

    // ⑥ Tagline — heroParagraph
    ctx.fillStyle = "#78350f";
    ctx.font = `500 ${14 * SCALE}px 'Noto Sans Tamil', 'Latha', Arial, sans-serif`;
    ctx.fillText(
      "உங்களுக்காக உங்களுடன் எப்போதும் உறுதுணையாக இருப்போம்.",
      A4_PX_W / 2,
      145 * SCALE
    );

    // ── STEP 2: Embed canvas header into PDF at full A4 width ─────────────────
    const headerDataUrl = hCanvas.toDataURL("image/png");
    const headerMM      = (HEADER_PX_H / SCALE / 96) * 25.4; // px → mm
    doc.addImage(headerDataUrl, "PNG", 0, 0, pageWidth, headerMM);
    yPos = headerMM + 8;

    // ── TOKEN BOX — yellow / amber theme ──────────────────────────────────────
    doc.setDrawColor(217, 119, 6);   // amber-600 border
    doc.setLineWidth(1);
    doc.setFillColor(254, 243, 199); // amber-100 fill
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 34, 4, 4, "FD");

    // Label
    doc.setTextColor(146, 64, 14);   // amber-900
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("YOUR GRIEVANCE TOKEN", pageWidth / 2, yPos + 10, {
      align: "center",
    });

    // Token value
    doc.setTextColor(120, 53, 15);   // amber-950
    doc.setFontSize(20);
    doc.setFont("courier", "bold");
    doc.text(lastSubmitted.token, pageWidth / 2, yPos + 25, {
      align: "center",
    });
    yPos += 42;

    // ── GRIEVANCE DETAILS ──────────────────────────────────────────────────────
    // Section heading bar
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 9, 2, 2, "FD");
    doc.setTextColor(120, 53, 15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Grievance Details", margin + 4, yPos + 6.2);
    yPos += 14;

    const details: [string, string][] = [
      ["Name",         lastSubmitted.name],
      ["Mobile",       lastSubmitted.mobile],
      ["Email",        lastSubmitted.email],
      ["Address",      lastSubmitted.address],
      ["Constituency", lastSubmitted.constituency],
      ["Department",   lastSubmitted.department],
      ["Status",       lastSubmitted.status],
      ["Submitted",    new Date(lastSubmitted.createdAt).toLocaleString()],
    ];

    // Each row: padded card with alternating background
    details.forEach(([label, value], index) => {
      const isEven  = index % 2 === 0;
      const rowBg   = isEven ? [255, 255, 255] : [249, 250, 251];
      const valueW  = pageWidth - margin - 60;
      const wrapped = doc.splitTextToSize(value || "-", valueW);
      const rowH    = wrapped.length > 1 ? wrapped.length * 5 + 6 : 11;

      doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.rect(margin, yPos, pageWidth - 2 * margin, rowH, "FD");

      // Label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      doc.text(label, margin + 4, yPos + 7);

      // Colon
      doc.setFont("helvetica", "normal");
      doc.setTextColor(156, 163, 175);
      doc.text(":", margin + 38, yPos + 7);

      // Value
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(31, 41, 55);
      doc.text(wrapped, margin + 44, yPos + 7);

      yPos += rowH;
    });

    // Description — full card below rows
    yPos += 3;
    const descLines = doc.splitTextToSize(
      lastSubmitted.description,
      pageWidth - 2 * margin - 8
    );
    const descBoxH = descLines.length * 5 + 16;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPos, pageWidth - 2 * margin, descBoxH, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text("Description", margin + 4, yPos + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(156, 163, 175);
    doc.text(":", margin + 38, yPos + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(31, 41, 55);
    doc.text(descLines, margin + 4, yPos + 15);

    yPos += descBoxH + 8;

    // ── WARNING BOX ────────────────────────────────────────────────────────────
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(1.5);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 16, 2, 2, "FD");
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text("Important: ", margin + 3, yPos + 7);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Save this token to track your grievance status at any time.",
      margin + 22,
      yPos + 7
    );
    yPos += 24;

    // ── FOOTER — rendered via canvas so Tamil text displays correctly ──────────
    const footerCanvas  = document.createElement("canvas");
    const F_SCALE       = 3;
    footerCanvas.width  = A4_PX_W;
    footerCanvas.height = 30 * F_SCALE;
    const fCtx          = footerCanvas.getContext("2d")!;

    fCtx.fillStyle = "#ffffff";
    fCtx.fillRect(0, 0, footerCanvas.width, footerCanvas.height);

    // Divider line
    fCtx.strokeStyle = "#e5e7eb";
    fCtx.lineWidth   = 1 * F_SCALE;
    fCtx.beginPath();
    fCtx.moveTo(0, 2 * F_SCALE);
    fCtx.lineTo(footerCanvas.width, 2 * F_SCALE);
    fCtx.stroke();

    // Portal name line (Tamil rendered by browser)
    fCtx.fillStyle    = "#9ca3af";
    fCtx.textAlign    = "center";
    fCtx.textBaseline = "middle";
    fCtx.font = `${9 * F_SCALE}px 'Noto Sans Tamil', 'Latha', Arial, sans-serif`;
    fCtx.fillText(
      "Karur Public Grievance Portal  |  \u0B95\u0BB0\u0BC2\u0BB0\u0BCD \u0BAE\u0B95\u0BCD\u0B95\u0BB3\u0BBF\u0BA9\u0BCD \u0B95\u0BC1\u0BB1\u0BC8\u0BA4\u0BC0\u0BB0\u0BCD \u0BA4\u0BB3\u0BAE\u0BCD",
      footerCanvas.width / 2,
      12 * F_SCALE
    );

    // Generated date
    fCtx.font = `${8 * F_SCALE}px Arial, sans-serif`;
    fCtx.fillText(
      `Generated on ${new Date().toLocaleString()}`,
      footerCanvas.width / 2,
      23 * F_SCALE
    );

    const footerDataUrl = footerCanvas.toDataURL("image/png");
    const footerMM      = (footerCanvas.height / F_SCALE / 96) * 25.4;
    doc.addImage(footerDataUrl, "PNG", 0, yPos, pageWidth, footerMM);

    doc.save(`grievance_${lastSubmitted.token}.pdf`);
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const handlePrint = () => {
    if (!lastSubmitted) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rows: [string, string][] = [
      ["Name",         lastSubmitted.name],
      ["Mobile",       lastSubmitted.mobile],
      ["Email",        lastSubmitted.email],
      ["Address",      lastSubmitted.address],
      ["Constituency", lastSubmitted.constituency],
      ["Department",   lastSubmitted.department],
      ["Status",       lastSubmitted.status],
      ["Submitted",    new Date(lastSubmitted.createdAt).toLocaleString()],
      ["Description",  lastSubmitted.description],
    ];

    const rowsHtml = rows.map(([label, value], i) => `
      <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f9fafb"}">
        <td style="
          padding: 9px 12px;
          font-weight: 600;
          color: #4b5563;
          font-size: 13px;
          border: 1px solid #e5e7eb;
          width: 130px;
          white-space: nowrap;
          vertical-align: top;
        ">${label}</td>
        <td style="
          padding: 9px 12px;
          color: #1f2937;
          font-size: 13px;
          border: 1px solid #e5e7eb;
          word-break: break-word;
        ">${value || "-"}</td>
      </tr>
    `).join("");

    const content = `
      <!DOCTYPE html>
      <html lang="ta">
      <head>
        <meta charset="UTF-8" />
        <title>Grievance Receipt - ${lastSubmitted.token}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Noto Sans Tamil', 'Latha', Arial, sans-serif;
            background: #fff;
            color: #1f2937;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>

        <!-- HEADER -->
        <div style="
          background: linear-gradient(135deg, #fbbf24 0%, #fcd34d 50%, #f59e0b 100%);
          padding: 28px 24px 24px;
          text-align: center;
          position: relative;
        ">
          <!-- Dot pattern overlay -->
          <div style="
            position: absolute; inset: 0;
            background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
            background-size: 28px 28px;
          "></div>

          <!-- Badge pill -->
          <div style="
            display: inline-block;
            background: rgba(251,243,199,0.80);
            border-radius: 20px;
            padding: 4px 16px;
            font-size: 12px;
            color: #92400e;
            margin-bottom: 12px;
            position: relative;
          ">🛡&nbsp; நமது முயற்சி.. கரூர் வளர்ச்சி..</div>

          <!-- Main heading -->
          <h1 style="
            font-size: 26px;
            font-weight: 800;
            color: #78350f;
            margin-bottom: 8px;
            position: relative;
          ">கரூர் மாவட்ட மக்களின் குறைதீர் தளம்.!</h1>

          <!-- Description -->
          <p style="font-size: 13px; color: #92400e; margin-bottom: 4px; position: relative;">
            கரூர் மக்களின் குறைகளை தீர்க்க உங்கள் சகோதரர் V.செந்தில் பாலாஜி
          </p>
          <p style="font-size: 13px; color: #92400e; margin-bottom: 10px; position: relative;">
            அவர்களால் ஏற்படுத்தப்பட்ட இணையதள புகார்தளம்.
          </p>

          <!-- Tagline -->
          <p style="font-size: 14px; font-weight: 600; color: #78350f; position: relative;">
            உங்களுக்காக உங்களுடன் எப்போதும் உறுதுணையாக இருப்போம்.
          </p>
        </div>

        <!-- TOKEN BOX -->
        <div style="
          margin: 20px 24px 0;
          background: #fef3c7;
          border: 1.5px solid #d97706;
          border-radius: 8px;
          padding: 14px;
          text-align: center;
        ">
          <p style="
            font-size: 11px;
            font-weight: 700;
            color: #92400e;
            letter-spacing: 1.5px;
            margin-bottom: 6px;
          ">YOUR GRIEVANCE TOKEN</p>
          <p style="
            font-size: 26px;
            font-weight: 800;
            color: #78350f;
            font-family: 'Courier New', monospace;
            letter-spacing: 4px;
          ">${lastSubmitted.token}</p>
        </div>

        <!-- DETAILS TABLE -->
        <div style="margin: 18px 24px 0;">
          <div style="
            background: #fef3c7;
            border: 1px solid #d97706;
            border-radius: 6px 6px 0 0;
            padding: 7px 12px;
          ">
            <span style="font-size: 13px; font-weight: 700; color: #78350f;">
              Grievance Details
            </span>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            ${rowsHtml}
          </table>
        </div>

        <!-- WARNING BOX -->
        <div style="
          margin: 18px 24px 0;
          background: #fef3c7;
          border: 1.5px solid #f59e0b;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 12px;
          color: #92400e;
        ">
          <strong>Important:</strong>
          Save this token number. You will need it to track your grievance status at any time.
        </div>

        <!-- FOOTER -->
        <div style="
          margin: 20px 24px 24px;
          border-top: 1px solid #e5e7eb;
          padding-top: 10px;
          text-align: center;
          color: #9ca3af;
          font-size: 11px;
        ">
          <p>Karur Public Grievance Portal &nbsp;|&nbsp; கரூர் மக்களின் குறைதீர் தளம்</p>
          <p style="margin-top: 3px;">Generated on ${new Date().toLocaleString()}</p>
        </div>

        <!-- Auto-trigger print -->
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  // ── SUCCESS SCREEN ───────────────────────────────────────────────────────────
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

  // ── GRIEVANCE FORM ───────────────────────────────────────────────────────────
  return (
    <>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Row 1: Name · Mobile · Email · Constituency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Full Name */}
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

          {/* Mobile */}
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

          {/* Email */}
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

          {/* Constituency */}
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
              <p className="text-primary-dark text-xs">
                {errors.constituency}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label>{t("address")}*</label>
          <textarea
            rows={3}
            className={`input-field resize-none ${
              errors.address ? "border-primary-dark" : ""
            }`}
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
            className={`input-field resize-none ${
              errors.description ? "border-primary-dark" : ""
            }`}
            placeholder={t("descPlaceholder")}
            rows={5}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
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
            <span>
              {selectedFile ? selectedFile.name : t("chooseFile")}
            </span>
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

        {/* Open Camera */}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={startCamera}
            className="flex items-center gap-2 text-sm text-primary-dark hover:text-primary"
          >
            📷 {t("openCamera")}
          </button>
        </div>

        {/* Camera stream preview */}
        {cameraStream && (
          <div className="mt-4 space-y-3">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg border"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="btn-primary"
              >
                {t("capturePhoto")}
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="text-gray-500"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        )}

        {/* File / photo preview */}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
        >
          {loading ? <Loader size="sm" /> : t("submitBtn2")}
        </button>
      </motion.form>

      {/* OtpModal is outside the <form> — prevents accidental form submission */}
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