import { motion } from "framer-motion";

interface BackdropProps {
  children: React.ReactNode;
  onClick: () => void;
}

export default function Backdrop({ children, onClick }: BackdropProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
