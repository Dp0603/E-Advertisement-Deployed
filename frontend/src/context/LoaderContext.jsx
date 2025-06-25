import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  Fade,
} from "@mui/material";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded"; // Optional icon

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loader, setLoader] = useState({ open: false, message: "" });

  const showLoader = useCallback((message = "") => {
    setLoader({ open: true, message });
  }, []);

  const hideLoader = useCallback(() => {
    setLoader({ open: false, message: "" });
  }, []);

  const contextValue = useMemo(
    () => ({ showLoader, hideLoader }),
    [showLoader, hideLoader]
  );

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      <Backdrop
        open={loader.open}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 999,
          flexDirection: "column",
          backdropFilter: "blur(0.6px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Fade in={loader.open}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            sx={{
              animation: loader.message ? "pulse 1.5s infinite" : "none",
              "@keyframes pulse": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.3 },
                "100%": { opacity: 1 },
              },
            }}
          >
            <CircularProgress size={60} thickness={4} color="inherit" />
            {loader.message && (
              <Box display="flex" alignItems="center" gap={1}>
                <HourglassTopRoundedIcon fontSize="medium" />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    fontWeight: 500,
                    letterSpacing: 1,
                  }}
                >
                  {loader.message}
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Backdrop>
    </LoaderContext.Provider>
  );
};
