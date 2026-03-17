import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiSearch,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiKey,
  FiExternalLink,
} from "react-icons/fi";
import { useLang } from "../context/LangContext";
import fanLogo from "../utils/now.png";
import stalinLogo from "../utils/st logo.png";

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
    icon: "🏠",
    name: "Kalaignar Veedu Vaazhga",
    nameTa: "கலைஞர் வீடு வாழ்க",
    desc: "Free houses for homeless families in Tamil Nadu.",
    descTa: "தமிழகத்தில் வீடற்ற குடும்பங்களுக்கு இலவச வீடுகள்.",
    color: "from-primary-light to-primary",
    border: "border-primary-light",
    tag: "Housing",
  },
  {
    icon: "🎓",
    name: "Pudhumai Penn Thittam",
    nameTa: "புதுமைப் பெண் திட்டம்",
    desc: "₹1000/month scholarship for govt school girls in higher education.",
    descTa: "உயர் கல்வி படிக்கும் அரசுப் பள்ளி மாணவிகளுக்கு மாதம் ₹1000.",
    color: "from-amber-50 to-yellow-50",
    border: "border-amber-200",
    tag: "Education",
  },
  {
    icon: "🚌",
    name: "Free Bus Travel for Women",
    nameTa: "பெண்களுக்கு இலவச பேருந்து",
    desc: "Free travel for all women in Tamil Nadu government buses.",
    descTa: "தமிழகத்தில் அனைத்து பெண்களுக்கும் அரசு பேருந்தில் இலவச பயணம்.",
    color: "from-green-50 to-emerald-50",
    border: "border-green-200",
    tag: "Transport",
  },
  {
    icon: "💊",
    name: "Innuyir Kaakka Thittam",
    nameTa: "இன்னுயிர் காக்க திட்டம்",
    desc: "Free dialysis for kidney patients across all government hospitals.",
    descTa:
      "அனைத்து அரசு மருத்துவமனைகளிலும் சிறுநீரக நோயாளிகளுக்கு இலவச டயாலிசிஸ்.",
    color: "from-blue-50 to-sky-50",
    border: "border-blue-200",
    tag: "Health",
  },
  {
    icon: "⚡",
    name: "Free Electricity Units",
    nameTa: "இலவச மின்சாரம்",
    desc: "100 units free electricity per month for domestic consumers.",
    descTa: "குடும்ப நுகர்வோருக்கு மாதம் 100 யூனிட் மின்சாரம் இலவசம்.",
    color: "from-yellow-50 to-orange-50",
    border: "border-yellow-200",
    tag: "Electricity",
  },
  {
    icon: "🌾",
    name: "Uzhavar Pasanam",
    nameTa: "உழவர் பசணம்",
    desc: "Financial assistance and crop insurance for farmers.",
    descTa: "விவசாயிகளுக்கு நிதி உதவி மற்றும் பயிர் காப்பீடு.",
    color: "from-lime-50 to-green-50",
    border: "border-lime-200",
    tag: "Agriculture",
  },
];

const Home = () => {
  const { t, lang } = useLang();

  const stats = [
    {
      label: t("totalGrievances"),
      value: "1,24,856",
      icon: FiFileText,
      color: "bg-primary-light text-primary-dark",
    },
    {
      label: t("resolved"),
      value: "98,432",
      icon: FiCheckCircle,
      color: "bg-green-50 text-green-700",
    },
    {
      label: t("inProgress"),
      value: "18,246",
      icon: FiClock,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: t("citizensServed"),
      value: `2.4 ${t("lakh")}`,
      icon: FiUsers,
      color: "bg-purple-50 text-purple-700",
    },
  ];

  const steps = [
    {
      icon: FiFileText,
      title: t("step1Title"),
      desc: t("step1Desc"),
      step: "1",
    },
    {
      icon: FiKey,
      title: t("step2Title"),
      desc: t("step2Desc"),
      step: "2",
    },
    {
      icon: FiClock,
      title: t("step3Title"),
      desc: t("step3Desc"),
      step: "3",
    },
    {
      icon: FiCheckCircle,
      title: t("step4Title"),
      desc: t("step4Desc"),
      step: "4",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="gradient-header text-gray-800 overflow-visible relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Desktop: Stalin logo - pinned to left (md and above only) */}
        <motion.img
          src={stalinLogo}
          alt="Stalin Logo"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block absolute left-7 top-0 bottom-0 my-auto
            w-40 h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 xl:w-72 xl:h-72
            object-contain drop-shadow-lg z-10"
        />

        {/* Desktop: Fan logo - pinned to right (md and above only) */}
        <motion.img
          src={fanLogo}
          alt="Fan Logo"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block absolute right-9 top-0 bottom-0 my-auto
            w-40 h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 xl:w-72 xl:h-72
            object-contain drop-shadow-lg z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center px-0 sm:px-32 md:px-44 lg:px-0">

            {/* ── Mobile hero: images flank the title/subtitle (xs and sm only) ── */}
            <div className="flex md:hidden w-full items-center justify-between gap-1 mb-4 overflow-hidden">

              {/* Left image */}
              <motion.img
                src={stalinLogo}
                alt="Stalin Logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex-shrink-0 drop-shadow-lg"
                style={{
                  width: "clamp(72px, 20vw, 112px)",
                  height: "clamp(90px, 26vw, 144px)",
                  objectFit: "contain",
                  objectPosition: "left center",
                }}
              />

              {/* Center content */}
              <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-1">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-1 bg-amber-100/70 rounded-full px-2 py-1 text-xs mb-2 text-amber-900 whitespace-nowrap"
                >
                  <FiShield size={11} /> {t("officialPortal")}
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-bold leading-tight !text-amberBrown-900 mb-1 whitespace-nowrap"
                  style={{ fontSize: "clamp(0.6rem, 3vw, 1.15rem)" }}
                >
                  {t("heroTitle")}
                </motion.h1>
                
              </div>

              {/* Right image */}
              <motion.img
                src={fanLogo}
                alt="Fan Logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex-shrink-0 drop-shadow-lg"
                style={{
                  width: "clamp(72px, 20vw, 112px)",
                  height: "clamp(90px, 26vw, 144px)",
                  objectFit: "contain",
                  objectPosition: "right center",
                }}
              />
            </div>

            {/* ── Desktop: badge + title + subtitle (md and above) ── */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:inline-flex items-center gap-2 bg-amber-100/70 rounded-full px-4 py-1.5 text-sm mb-5 text-amber-900"
            >
              <FiShield size={14} /> {t("officialPortal")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden md:block font-bold mb-1 leading-tight whitespace-nowrap !text-amberBrown-900"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)" }}
            >
              {t("heroTitle")}
            </motion.h1>

            

            {/* ── Shared: description + paragraph + buttons (all screen sizes) ── */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base !text-amberBrown-900 mb-4 sm:mb-8 leading-relaxed text-center px-1"
            >
              {t("heroDesc")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-base sm:text-xl !text-amberBrown-900 mb-4 font-medium text-center px-1"
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
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center p-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 ${s.color}`}
                >
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
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary-dark text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
              ⭐ முதல்வரின் முகவரி
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {t("schemesTitle")}
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              {t("schemesSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  href="https://www.tn.gov.in"
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
            className="text-center mt-8"
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="text-primary-dark font-semibold text-sm uppercase tracking-wider">
              {t("simpleProcess")}
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {t("howItWorks")}
            </h2>
            <p className="text-gray-500 mt-2">{t("stepsDesc")}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="card relative"
              >
                <div
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
                  style={{
                    background: "linear-gradient(135deg, #1f2937, #fef3c7)",
                  }}
                >
                  {step.step}
                </div>
                <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center mb-4">
                  <step.icon size={22} className="text-primary-dark" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t("haveGrievance")}
            </h2>
            <p className="text-gray-500 mb-8 text-lg">{t("ctaDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/submit" className="btn-primary text-lg py-4 px-10">
                {t("fileNow")}
              </Link>
              <Link
                to="/forgot-token"
                className="btn-secondary text-lg py-4 px-10"
              >
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