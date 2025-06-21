import React, { createContext, useContext, useState, useCallback } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = useCallback(() => setLoading(true), []);
  const hideLoader = useCallback((delay = 800) => {
    setTimeout(() => setLoading(false), delay);
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoaderContext.Provider>
  );
};
