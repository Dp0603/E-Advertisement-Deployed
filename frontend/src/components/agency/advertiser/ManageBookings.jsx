import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
  Box,
  Grid,
  Chip,
  Tooltip,
  Fade,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import API from "../../../api/axios";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext"; // (optional, if you want to use global toast)
import { useLoader } from "../../../context/LoaderContext"; // (optional, if you want to use global loader)

export const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Optional: Use global toast context if available
  const { showToast } = useToast(); // <-- Use the hook if you have a global toast context
  const { showLoader, hideLoader } = useLoader();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const advertiserId = user?._id || user?.id || localStorage.getItem("userId"); // fallback to userId from localStorage

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    showLoader();
    try {
      const res = await API.get("/getbookings");
      setBookings(res.data.data);
    } catch (error) {
      showToast("Failed to fetch bookings", "error");
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  const updateBookingData = async () => {
    try {
      await API.put(`/updatebookingstatus/${selectedBookingId}`, {
        status: selectedStatus,
      });
      showToast("Booking status updated!", "success");
      fetchBookings();
      handleCloseDialog();
    } catch (error) {
      showToast("Failed to update booking status", "error");
    }
  };

  const handleOpenDialog = (id) => {
    setSelectedBookingId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedBookingId(null);
    setSelectedStatus("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
        py: 5,
        px: { xs: 1, md: 4 },
      }}
    >
      {/* Back/Home Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 3,
          borderRadius: "30px",
          fontWeight: 600,
          letterSpacing: 1,
          borderColor: "#21cbf3",
          color: "#21cbf3",
          "&:hover": {
            borderColor: "#1976d2",
            background: "#e3f2fd",
            color: "#1976d2",
          },
        }}
        onClick={() => {
          if (advertiserId) {
            navigate(`/advertiser/dashboard/${advertiserId}`);
          } else {
            navigate("/login");
          }
        }}
      >
        Back to Dashboard
      </Button>

      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          color: "#21cbf3",
          fontWeight: "bold",
          letterSpacing: 1,
          mb: 4,
          textTransform: "uppercase",
        }}
      >
        <EventAvailableIcon
          sx={{ mr: 1, fontSize: 36, verticalAlign: "middle" }}
        />
        AD BOOKINGS
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {bookings.length > 0 ? (
          bookings.map((detail) => (
            <Grid item xs={12} sm={10} md={6} lg={4} key={detail._id}>
              <Fade in>
                <Card
                  sx={{
                    borderRadius: 4,
                    background:
                      "linear-gradient(135deg, #112240 60%, #17375E 100%)",
                    color: "#fff",
                    boxShadow: 6,
                    minHeight: 340,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: 12,
                      borderColor: "#21cbf3",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        mb: 1,
                        color: "#21cbf3",
                        letterSpacing: 1,
                      }}
                    >
                      {detail.adId?.title}
                    </Typography>
                    <Typography
                      sx={{ opacity: 0.9, fontSize: "0.98rem", mb: 1 }}
                    >
                      {detail.adId?.description}
                    </Typography>
                    <Divider sx={{ mb: 1, borderColor: "#21cbf3" }} />
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Chip
                        icon={<MonetizationOnIcon />}
                        label={`${detail.adId?.budget} Rs`}
                        color="success"
                        size="small"
                      />
                      <Chip
                        icon={<LocationOnIcon />}
                        label={`${detail.adId?.stateId?.name}, ${detail.adId?.cityId?.name}`}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={`Start: ${new Date(
                          detail?.startTime
                        ).toLocaleString()}`}
                        color="info"
                        size="small"
                      />
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={`End: ${new Date(
                          detail?.endTime
                        ).toLocaleString()}`}
                        color="info"
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Chip
                        icon={<PersonIcon />}
                        label={`Client: ${detail.clientId?.name || ""}`}
                        color="secondary"
                        size="small"
                      />
                      <Chip
                        icon={<InfoIcon />}
                        label={
                          detail?.displayFrequency
                            ? `Display: ${detail.displayFrequency}`
                            : ""
                        }
                        color="default"
                        size="small"
                      />
                      {detail?.specialPlacement && (
                        <Chip
                          icon={<InfoIcon />}
                          label={`Special: ${detail.specialPlacement}`}
                          color="warning"
                          size="small"
                        />
                      )}
                      {detail.contactPerson && (
                        <Chip
                          icon={<PersonIcon />}
                          label={`Contact: ${detail.contactPerson}`}
                          color="secondary"
                          size="small"
                        />
                      )}
                      {detail.specialInstructions && (
                        <Chip
                          icon={<InfoIcon />}
                          label={`Instructions: ${detail.specialInstructions}`}
                          color="info"
                          size="small"
                        />
                      )}
                      <Chip
                        icon={<InfoIcon />}
                        label={`Analytics: ${
                          detail?.analyticsRequired ? "Yes" : "No"
                        }`}
                        color={
                          detail?.analyticsRequired ? "success" : "default"
                        }
                        size="small"
                      />
                    </Box>
                    <Divider sx={{ my: 1, borderColor: "#21cbf3" }} />
                    <Typography
                      sx={{
                        mt: 1,
                        fontWeight: "bold",
                        color:
                          detail.status === "confirmed"
                            ? "lightgreen"
                            : detail.status === "rejected"
                            ? "#ff5252"
                            : "#ffd700",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: "1.1rem",
                      }}
                    >
                      Status:
                      {detail.status === "confirmed" ? (
                        <AssignmentTurnedInIcon sx={{ color: "lightgreen" }} />
                      ) : detail.status === "rejected" ? (
                        <CancelIcon sx={{ color: "#ff5252" }} />
                      ) : (
                        <InfoIcon sx={{ color: "#ffd700" }} />
                      )}
                      {detail?.status?.toUpperCase()}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ justifyContent: "flex-end", pb: 2, pr: 2 }}
                  >
                    <Tooltip title="Update Status" arrow>
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        sx={{
                          borderRadius: "20px",
                          fontWeight: 600,
                          letterSpacing: 1,
                          borderColor: "#21cbf3",
                          color: "#21cbf3",
                          "&:hover": {
                            borderColor: "#1976d2",
                            background: "#e3f2fd",
                            color: "#1976d2",
                          },
                        }}
                        onClick={() => handleOpenDialog(detail?._id)}
                      >
                        Update Status
                      </Button>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography
              sx={{
                mt: 2,
                color: "#ccc",
                textAlign: "center",
                fontSize: "1.1rem",
              }}
            >
              No bookings available at the moment.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            letterSpacing: 1,
            textAlign: "center",
          }}
        >
          Update Ad Status
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1 }}>Select Status:</Typography>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              color: "#1976d2",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#21cbf3" },
            }}
          >
            <MenuItem value="confirmed">
              <AssignmentTurnedInIcon sx={{ color: "green", mr: 1 }} />
              Accept
            </MenuItem>
            <MenuItem value="rejected">
              <CancelIcon sx={{ color: "#ff5252", mr: 1 }} />
              Reject
            </MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            variant="outlined"
          >
            Close
          </Button>
          <Button
            onClick={updateBookingData}
            disabled={!selectedStatus}
            variant="contained"
            color="primary"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
