import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ToastComponent = ({ message }: { message: string }) => {
  const [show, setShow] = useState(true);
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={show}
      autoHideDuration={6000}
      onClose={() => setShow(false)}
      message={message}
      action={
        <>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setShow(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
};

const ToastContext = createContext<any>(undefined);

export default ToastContext;

export function ToastContextProvider({ children }: any) {
  const [toasts, setToasts] = useState<string[]>([]);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(
        () => setToasts((toasts) => toasts.slice(1)),
        6000
      );
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const addToast = useCallback(
    (toast: string) => {
      setToasts((toasts) => [...toasts, toast]);
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toasts-wrapper">
        {toasts.map((toast, i) => (
          <ToastComponent key={i} message={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
}
