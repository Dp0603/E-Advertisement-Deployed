import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback((message, severity = "success") => {
    setToast({ open: true, message, severity });
  }, []);

  const handleClose = () => setToast((prev) => ({ ...prev, open: false }));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
            fontWeight: 600,
            fontSize: "1rem",
            background:
              toast.severity === "success"
                ? "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)"
                : "linear-gradient(90deg, #d32f2f 60%, #ff7961 100%)",
            color: "#fff",
            letterSpacing: 0.5,
            boxShadow: 3,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};