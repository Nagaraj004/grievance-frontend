import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchPublicStats } from "../store/slices/grievanceSlice";
import {
  FiFileText,
  FiSearch,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiKey,
  FiExternalLink,
} from "react-icons/fi";
import { useLang } from "../context/LangContext";

// ── WebP imports (compressed via Squoosh) ──────────────────────────────────
import fanLogo    from "../utils/now.webp";
import stalinLogo from "../utils/st logo.webp";

// Preload both hero logos so the browser fetches them at highest priority
// before the JS bundle finishes parsing. Drop these two <link> tags into
// your public/index.html <head> as well for the absolute earliest fetch:
//   <link rel="preload" as="image" type="image/webp" href="/src/utils/now.webp" />
//   <link rel="preload" as="image" type="image/webp" href="/src/utils/st-logo.webp" />

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const schemes = [
  {
    icon: "🧕🏼",
    name: "Magalir Urimai Thogai Scheme",
    nameTa: "மகளிர் உரிமைத் தொகை திட்டம்",
    desc: "A welfare scheme of the Tamil Nadu government that provides ₹1000 per month as financial assistance to eligible women heads of families.",
    descTa: "தகுதியான குடும்பங்களில் உள்ள பெண்மணிக்கு மாதம் ₹1000 நிதி உதவி வழங்கும் தமிழ்நாடு அரசின் நலத்திட்டம்.",
    color: "from-primary-light to-primary",
    border: "border-primary-light",
    tag: "Woman Empowerment",
    applyLink: "https://kmut.tn.gov.in/",
  },
  {
    icon: "🎓",
    name: "TAHDCO Educational Loan Scheme",
    nameTa: "TAHDCO கல்விக் கடன் திட்டம்",
    desc: "A Tamil Nadu government scheme that provides low-interest educational loans to Adi Dravidar and Tribal students for pursuing higher education.",
    descTa: "ஆதிதிராவிடர் மற்றும் பழங்குடியினர் மாணவர்களுக்கு உயர்கல்விக்காக குறைந்த வட்டியில் கல்விக் கடன் வழங்கும் தமிழ்நாடு அரசின் நலத்திட்டம்.",
    color: "from-amber-50 to-yellow-50",
    border: "border-amber-200",
    tag: "Education",
    applyLink: "https://tel.tahdco.com/#/applicant",
  },
  {
    icon: "🏭",
    name: "MSME Reservation Scheme",
    nameTa: "MSME தொழில்களுக்கு ஒதுக்கீடு",
    desc: "Reservation for Micro, Small and Medium Enterprises",
    descTa: "சிறு, குறு மற்றும் நடுத்தர தொழில்களுக்கு ஒதுக்கீடு",
    color: "from-green-50 to-emerald-50",
    border: "border-green-200",
    tag: "Reservation",
    applyLink: "https://www.msmeonline.tn.gov.in",
  },
  {
    icon: "💊",
    name: "Maruthuva Kaapetu Thittam",
    nameTa: "மருத்துவ காப்பீட்டு திட்டம்",
    desc: "A welfare scheme of the Tamil Nadu government that provides free medical treatment to eligible families.",
    descTa: "தகுதியான குடும்பங்களுக்கு இலவச மருத்துவ சிகிச்சை வழங்கும் தமிழ்நாடு அரசின் நலத்திட்டம்.",
    color: "from-blue-50 to-sky-50",
    border: "border-blue-200",
    tag: "Health",
    applyLink: "https://www.cmchistn.com",
  },
  {
    icon: "⚡",
    name: "Free Electricity Units",
    nameTa: "நெசவாளர்களுக்கான மின்சார திட்டம்",
    desc: "100 units free electricity per month for domestic consumers.",
    descTa: "கைத்தறி நெசவாளர்களுக்கு இலவச மின்சாரம் வழங்கும் தமிழ்நாடு அரசின் நலத்திட்டம்.",
    color: "from-yellow-50 to-orange-50",
    border: "border-yellow-200",
    tag: "Electricity",
    applyLink: "https://tnhandlooms.tn.gov.in/",
  },
  {
    icon: "🌾",
    name: "Farmers Welfare Department",
    nameTa: "உழவர் நலத்துறை திட்டம்",
    desc: "Financial assistance and crop insurance for farmers.",
    descTa: "விவசாயிகளுக்கு நிதி உதவி மற்றும் பயிர் காப்பீடு.",
    color: "from-lime-50 to-green-50",
    border: "border-lime-200",
    tag: "Agriculture",
    applyLink: "https://www.tnagrisnet.tn.gov.in/",
  },
];

const stepShadows = [
  {
    base: "0 4px 16px 0 rgba(99,102,241,0.18)",
    hover: "0 12px 32px 0 rgba(99,102,241,0.35)",
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    border: "border-indigo-200",
  },
  {
    base: "0 4px 16px 0 rgba(16,185,129,0.18)",
    hover: "0 12px 32px 0 rgba(16,185,129,0.35)",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    border: "border-emerald-200",
  },
  {
    base: "0 4px 16px 0 rgba(245,158,11,0.18)",
    hover: "0 12px 32px 0 rgba(245,158,11,0.35)",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-200",
  },
  {
    base: "0 4px 16px 0 rgba(239,68,68,0.18)",
    hover: "0 12px 32px 0 rgba(239,68,68,0.35)",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    border: "border-rose-200",
  },
];

// Shared style applied to every logo <img> to prevent layout thrash
// during Framer Motion animation and hint the compositor layer upfront.
const logoStyle: React.CSSProperties = {
  willChange: "transform, opacity",
  contentVisibility: "auto",
};

const Home = () => {
  const { t, lang } = useLang();
  const dispatch = useDispatch<AppDispatch>();
  const { stats } = useSelector((s: RootState) => s.grievance);

  useEffect(() => {
    dispatch(fetchPublicStats());
  }, [dispatch]);

  const fmt = (val?: number | null) =>
    val != null ? val.toLocaleString("en-IN") : "0";

  const statsCards = [
    {
      label: t("totalGrievances"),
      value: fmt(stats?.total),
      icon: FiFileText,
      color: "bg-primary-light text-primary-dark",
    },
    {
      label: t("resolved"),
      value: fmt((stats?.resolved ?? 0) + (stats?.closed ?? 0)),
      icon: FiCheckCircle,
      color: "bg-green-50 text-green-700",
    },
    {
      label: t("inProgress"),
      value: fmt(stats?.in_progress),
      icon: FiClock,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: t("citizensServed"),
      value: fmt(stats?.submitted),
      icon: FiAlertCircle,
      color: "bg-purple-50 text-purple-700",
    },
  ];

  const steps = [
    { icon: FiFileText,    title: t("step1Title"), desc: t("step1Desc"), step: "1" },
    { icon: FiKey,         title: t("step2Title"), desc: t("step2Desc"), step: "2" },
    { icon: FiClock,       title: t("step3Title"), desc: t("step3Desc"), step: "3" },
    { icon: FiCheckCircle, title: t("step4Title"), desc: t("step4Desc"), step: "4" },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="gradient-header text-gray-800 overflow-visible relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Desktop logos (xl+) */}
        <motion.img
          src={stalinLogo}
          alt="Stalin Logo"
          // Explicit dimensions prevent layout shift while image loads
          width={288}
          height={288}
          // fetchpriority tells the browser this is critical — fetch it first
          fetchPriority="high"
          // decoding="async" frees the main thread; layout is already reserved
          decoding="async"
          style={logoStyle}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden xl:block absolute left-7 top-0 bottom-0 my-auto
            xl:w-72 xl:h-72 object-contain drop-shadow-lg z-10"
        />
        <motion.img
          src={fanLogo}
          alt="Fan Logo"
          width={288}
          height={288}
          fetchPriority="high"
          decoding="async"
          style={logoStyle}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden xl:block absolute right-9 top-0 bottom-0 my-auto
            xl:w-72 xl:h-72 object-contain drop-shadow-lg z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 xl:py-14 relative">

          {/* Tablet layout (md → xl) */}
          <div className="hidden md:flex xl:hidden items-center justify-center w-full gap-4">
            <motion.img
              src={stalinLogo}
              alt="Stalin Logo"
              width={130}
              height={150}
              fetchPriority="high"
              decoding="async"
              style={logoStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex-none object-contain drop-shadow-lg"
            />
            <div className="flex flex-col items-center text-center flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-amber-100/70 rounded-full px-4 py-1.5 text-sm mb-3 text-amber-900 whitespace-nowrap"
              >
                <FiShield size={14} /> {t("officialPortal")}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-bold mb-2 leading-tight !text-amberBrown-900 whitespace-nowrap"
                style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.5rem)" }}
              >
                {t("heroTitle")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm !text-amberBrown-900 mb-3 leading-relaxed text-center"
              >
                {t("heroDesc")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-sm !text-amberBrown-900 mb-4 font-medium text-center"
              >
                {t("heroParagraph")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-row gap-3 justify-center"
              >
                <Link
                  to="/submit"
                  className="flex items-center gap-2 bg-primary-dark text-white font-bold py-2.5 px-5 rounded-2xl text-sm hover:bg-primary hover:text-gray-900 transition-all duration-300 shadow-lg hover:-translate-y-0.5"
                >
                  <FiFileText size={15} /> {t("submitBtn")}
                </Link>
                <Link
                  to="/track"
                  className="flex items-center gap-2 bg-white border-2 border-primary-dark text-primary-dark font-bold py-2.5 px-5 rounded-2xl text-sm hover:bg-primary-light hover:text-gray-900 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <FiSearch size={15} /> {t("trackBtn")}
                </Link>
              </motion.div>
            </div>
            <motion.img
              src={fanLogo}
              alt="Fan Logo"
              width={130}
              height={150}
              fetchPriority="high"
              decoding="async"
              style={logoStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex-none object-contain drop-shadow-lg"
            />
          </div>

          {/* Desktop layout (xl+) */}
          <div className="hidden xl:flex max-w-2xl mx-auto text-center flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-amber-100/70 rounded-full px-4 py-1.5 text-sm mb-5 text-amber-900"
            >
              <FiShield size={14} /> {t("officialPortal")}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-bold mb-1 leading-tight whitespace-nowrap !text-amberBrown-900"
              style={{ fontSize: "clamp(1rem, 2.4vw, 2.2rem)" }}
            >
              {t("heroTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base !text-amberBrown-900 mb-8 leading-relaxed text-center px-1"
            >
              {t("heroDesc")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-xl !text-amberBrown-900 mb-4 font-medium text-center px-1"
            >
              {t("heroParagraph")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
            >
              <Link
                to="/submit"
                className="flex items-center justify-center gap-2 bg-primary-dark text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-primary hover:text-gray-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-100"
              >
                <FiFileText size={18} /> {t("submitBtn")}
              </Link>
              <Link
                to="/track"
                className="flex items-center justify-center gap-2 bg-white border-2 border-primary-dark text-primary-dark font-bold py-4 px-8 rounded-2xl text-lg hover:bg-primary-light hover:text-gray-900 transition-all duration-300 hover:-translate-y-0.5"
              >
                <FiSearch size={18} /> {t("trackBtn")}
              </Link>
            </motion.div>
          </div>

          {/* Mobile layout (< md) */}
          <div className="md:hidden max-w-2xl mx-auto text-center flex flex-col items-center px-0 sm:px-8">
            <div className="flex w-full flex-col items-center mb-3">
              <div className="flex items-center justify-between w-full">
                <motion.img
                  src={stalinLogo}
                  alt="Stalin Logo"
                  // clamp upper bound → 70×88; give the browser the max so it
                  // reserves space and never reflows on load.
                  width={70}
                  height={88}
                  fetchPriority="high"
                  decoding="async"
                  style={logoStyle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="drop-shadow-lg flex-none"
                  // Runtime clamp kept for responsive scaling
                  // (width/height above just reserves layout space)
                  onLoad={(e) => {
                    const el = e.currentTarget;
                    el.style.width  = "clamp(44px, 11vw, 70px)";
                    el.style.height = "clamp(52px, 14vw, 88px)";
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-1 bg-amber-100/70 rounded-full px-3 py-1 text-amber-900"
                  style={{ fontSize: "clamp(0.55rem, 2.5vw, 0.75rem)", whiteSpace: "nowrap" }}
                >
                  <FiShield size={9} /> {t("officialPortal")}
                </motion.div>
                <motion.img
                  src={fanLogo}
                  alt="Fan Logo"
                  width={82}
                  height={102}
                  fetchPriority="high"
                  decoding="async"
                  style={logoStyle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="drop-shadow-lg flex-none"
                  onLoad={(e) => {
                    const el = e.currentTarget;
                    el.style.width  = "clamp(52px, 13vw, 82px)";
                    el.style.height = "clamp(62px, 16vw, 102px)";
                  }}
                />
              </div>
              <div className="flex flex-col items-center justify-center text-center w-full mt-2">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-bold leading-tight !text-amberBrown-900 mb-0 w-full"
                  style={{
                    fontSize: "clamp(0.7rem, 4vw, 1.3rem)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {t("heroTitle")}
                </motion.h1>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm !text-amberBrown-900 mb-3 sm:mb-6 leading-relaxed text-center px-1"
            >
              {t("heroDesc")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-sm sm:text-base !text-amberBrown-900 mb-4 font-medium text-center px-1"
            >
              {t("heroParagraph")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto"
            >
              <Link
                to="/submit"
                className="flex items-center justify-center gap-2 bg-primary-dark text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl text-base sm:text-lg hover:bg-primary hover:text-gray-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-100"
              >
                <FiFileText size={18} /> {t("submitBtn")}
              </Link>
              <Link
                to="/track"
                className="flex items-center justify-center gap-2 bg-white border-2 border-primary-dark text-primary-dark font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl text-base sm:text-lg hover:bg-primary-light hover:text-gray-900 transition-all duration-300 hover:-translate-y-0.5"
              >
                <FiSearch size={18} /> {t("trackBtn")}
              </Link>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsCards.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center p-4"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 ${s.color}`}>
                  <s.icon size={22} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schemes */}
      <section className="py-8 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary-dark text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
              ⭐ முதல்வரின் முகவரி
            </div>
            <h2 className="text-3xl font-bold text-gray-800">{t("schemesTitle")}</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">{t("schemesSubtitle")}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemes.map((scheme, i) => (
              <motion.div
                key={scheme.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.1)" }}
                className={`bg-gradient-to-br ${scheme.color} border ${scheme.border} rounded-2xl p-5 cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{scheme.icon}</span>
                  <span className="text-xs font-semibold bg-white/70 text-gray-600 px-2 py-1 rounded-full">
                    {scheme.tag}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-base mb-0.5">
                  {lang === "ta" ? scheme.nameTa : scheme.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {lang === "ta" ? scheme.descTa : scheme.desc}
                </p>
                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-primary-light hover:text-gray-900 hover:shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("applyNow")} <FiExternalLink size={13} />
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-5"
          >
            <a
              href="https://www.tn.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-primary-light hover:text-gray-900 hover:shadow-sm"
            >
              {t("viewAllSchemes")} <FiExternalLink size={15} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-7"
          >
            <span className="text-primary-dark font-semibold text-sm uppercase tracking-wider">
              {t("simpleProcess")}
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">{t("howItWorks")}</h2>
            <p className="text-gray-500 mt-2">{t("stepsDesc")}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`card relative transition-shadow duration-300 border ${stepShadows[i].border} ${stepShadows[i].bg}`}
                style={{ boxShadow: stepShadows[i].base }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = stepShadows[i].hover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = stepShadows[i].base)
                }
              >
                <div className={`w-12 h-12 ${stepShadows[i].iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                  <step.icon size={22} className={stepShadows[i].iconColor} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{t("haveGrievance")}</h2>
            <p className="text-gray-500 mb-5 text-lg">{t("ctaDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/submit" className="btn-primary text-lg py-4 px-10">
                {t("fileNow")}
              </Link>
              <Link to="/forgot-token" className="btn-secondary text-lg py-4 px-10">
                {t("forgotToken")}?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;