import { motion } from "framer-motion";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

const Loader = ({ size = "md", text, fullPage = false }: LoaderProps) => {
  const sizes = { sm: 24, md: 40, lg: 64 };
  const px = sizes[size];
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="rounded-full border-4 border-primary-light border-t-primary-dark"
        style={{ width: px, height: px }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      />
      {text && <p className="text-primary-dark font-medium text-sm">{text}</p>}
    </div>
  );
  if (fullPage)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  return <div className="flex justify-center py-8">{spinner}</div>;
};

export default Loader;
