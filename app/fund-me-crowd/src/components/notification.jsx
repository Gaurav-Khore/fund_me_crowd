import { toast, Bounce } from 'react-toastify';

export const ToastSuccessNotification = (msg) => {
    toast.success(msg, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
        transition: Bounce,
    });
}

export const ToastErrorNotification = (msg) => {
    console.log("Hello");
    return toast.error(msg, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
        transition: Bounce,
    });
}

