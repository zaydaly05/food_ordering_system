import { motion } from "framer-motion";

export default function WhatsAppButton({ phone = "+1234567890" }) {
  const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi! I have a question about my order.")}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fixed right-4 bottom-6 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg flex items-center gap-2"
      aria-label="Chat on WhatsApp"
      whileHover={{ y: -8, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 18 }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.09 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.9.38 1.77.78 2.57a2 2 0 0 1-.45 2.11L8.91 9.91a16 16 0 0 0 6 6l1.51-1.51a2 2 0 0 1 2.11-.45c.8.4 1.67.66 2.57.78A2 2 0 0 1 22 16.92z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </motion.a>
  );
}
