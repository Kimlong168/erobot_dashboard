import { FiCheckSquare } from "react-icons/fi";
import { motion } from "framer-motion";
import PropType from "prop-types";

const Notification = ({ text, bg }) => {
  return (
    <div className="fixed top-16 right-5 ">
      <motion.div
        layout
        initial={{ y: -15, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`p-2 flex items-start rounded gap-2 text-xs font-medium shadow-lg text-white pointer-events-auto ${bg}`}
      >
        <FiCheckSquare className=" mt-0.5" />
        <span className="capitalize">{text}</span>
      </motion.div>
    </div>
  );
};

Notification.propTypes = {
  text: PropType.string,
  bg: PropType.string,
};

export default Notification;
