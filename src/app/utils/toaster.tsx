import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastError = (msg: string) => {
  toast.error(msg);
};

export const toastSuccess = (msg: string) => {
  toast.success(msg);
};

export const Toaster = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </div>
  );
};


export const ToasterCenter = () => {
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </div>
  );
};

export const alertToaster = () => {
  return new Promise((resolve) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this item?</p>
        <button
          onClick={() => {
            resolve(true); 
          }}
          className="btn btn-primary"
        >
          Confirm
        </button>
        <button
          onClick={() => {
            resolve(false); // Resolve the promise with 'false' for cancellation
          }}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      },
    );
  });
};

