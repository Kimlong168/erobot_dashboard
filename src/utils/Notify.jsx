import { toast } from "react-toastify";
//   fll all required fields alert
const notify = () =>
  toast.error("Fill all required fields!", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

export default notify;
