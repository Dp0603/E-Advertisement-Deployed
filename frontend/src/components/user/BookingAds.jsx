import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import API from "../../api/axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RAZORPAY_KEY_ID = "rzp_test_GDBH9Rf7wvZ3R6"; // Replace with your Razorpay key

export const BookingAds = () => {
  const { id: adId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [adDetails, setAdDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const res = await API.get(`/ad/${adId}`);
        setAdDetails(res.data);
      } catch (err) {
        setError("Failed to load ad details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdDetails();
  }, [adId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (formData) => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }
    setError("");
    setProcessingPayment(true);

    try {
      const amount = adDetails?.calculatedPrice || adDetails?.budget || 100;
      // 1. Create order on backend
      const orderRes = await API.post("/createorder", {
        amount,
        currency: "INR",
        receipt: `receipt_${adId}_${Date.now()}`,
      });
      const order = orderRes.data.order || orderRes.data;

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setProcessingPayment(false);
        toast.error("Failed to load payment gateway.");
        return;
      }

      // 3. Open Razorpay modal
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: adDetails.title,
        description: "Ad Booking Payment",
        order_id: order.id,
        handler: async function (response) {
          // 4. Verify payment on backend
          try {
            const verifyRes = await API.post("/verifyorder", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.status === "success") {
              await submitBooking(
                formData,
                response,
                order.amount,
                order.currency
              );
            } else {
              setProcessingPayment(false);
              toast.error("Payment verification failed.");
            }
          } catch {
            setProcessingPayment(false);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: formData.contactPerson || "",
          email: localStorage.getItem("email") || "",
        },
        theme: { color: "#21cbf3" },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            toast.info("Payment cancelled.");
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setProcessingPayment(false);
      toast.error("Failed to initiate payment.");
    }
  };

  const submitBooking = async (formData, paymentResponse, amount, currency) => {
    try {
      const bookingPayload = {
        startTime: startDate ? new Date(startDate).toISOString() : null,
        endTime: endDate ? new Date(endDate).toISOString() : null,
        displayFrequency: formData.displayFrequency || "standard",
        specialPlacement: formData.specialPlacement || "",
        contactPerson: formData.contactPerson || "",
        specialInstructions: formData.specialInstructions || "",
        analyticsRequired: !!formData.analyticsRequired,
        payment: {
          orderId: paymentResponse.razorpay_order_id,
          paymentId: paymentResponse.razorpay_payment_id,
          signature: paymentResponse.razorpay_signature,
          amount,
          currency,
        },
      };
      await API.post(`/bookads/${adId}`, bookingPayload);
      setProcessingPayment(false);
      toast.success("Booking successful!");
      navigate("/screenings2"); // Redirect to user's bookings or desired page
    } catch (err) {
      setProcessingPayment(false);
      toast.error(
        err?.response?.data?.message || "Booking failed. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#21cbf3" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: { xs: 4, md: 8 },
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: 5,
            background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
            border: "2px solid #21cbf3",
            boxShadow: 8,
            color: "#fff",
          }}
        >
          {adDetails && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{ mb: 1, fontWeight: "bold", color: "#21cbf3" }}
              >
                {adDetails.title}
              </Typography>
              <Typography variant="body2" color="#e3f2fd" sx={{ mb: 2 }}>
                {adDetails.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Type:</strong> {adDetails?.adType}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Dimensions:</strong>{" "}
                    {adDetails?.adDimensions || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Duration:</strong> {adDetails?.adDuration}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Budget:</strong> ₹{adDetails?.budget}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
            border: "2px solid #21cbf3",
            boxShadow: 8,
            color: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                textAlign: "center",
                fontWeight: "bold",
                color: "#21cbf3",
              }}
            >
              BOOK ADVERTISEMENT
            </Typography>

            <form
              onSubmit={handleSubmit(initiatePayment)}
              style={{ width: "100%" }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Required Information
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: "#21cbf3" }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        sx: { background: "#fff", borderRadius: 2 },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        sx: { background: "#fff", borderRadius: 2 },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Additional Options
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: "#21cbf3" }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Display Frequency</InputLabel>
                    <Select
                      label="Display Frequency"
                      defaultValue="standard"
                      {...register("displayFrequency")}
                      sx={{ background: "#fff", borderRadius: 2 }}
                    >
                      <MenuItem value="low">Low (1-3 times daily)</MenuItem>
                      <MenuItem value="standard">
                        Standard (4-8 times daily)
                      </MenuItem>
                      <MenuItem value="high">High (9-15 times daily)</MenuItem>
                      <MenuItem value="premium">
                        Premium (16+ times daily)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Special Placement Requests"
                    placeholder="E.g., Top of page, Near related content"
                    {...register("specialPlacement")}
                    fullWidth
                    variant="outlined"
                    sx={{ background: "#fff", borderRadius: 2 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Contact Person for Ad Communications"
                    placeholder="Name and contact information"
                    {...register("contactPerson")}
                    fullWidth
                    variant="outlined"
                    sx={{ background: "#fff", borderRadius: 2 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register("analyticsRequired")}
                        sx={{ color: "#21cbf3" }}
                      />
                    }
                    label="Receive performance analytics for this ad campaign"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Special Instructions"
                    placeholder="Any additional information about your booking"
                    {...register("specialInstructions")}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    sx={{ background: "#fff", borderRadius: 2 }}
                  />
                </Grid>

                {error && (
                  <Grid item xs={12}>
                    <Typography color="error" sx={{ textAlign: "center" }}>
                      {error}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={processingPayment}
                      sx={{
                        minWidth: 200,
                        background:
                          "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        borderRadius: "30px",
                        boxShadow: "0 4px 20px rgba(25,118,210,0.10)",
                        letterSpacing: 1,
                        py: 1.3,
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                        },
                      }}
                    >
                      {processingPayment
                        ? "Processing..."
                        : "Proceed to Payment"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingAds;
