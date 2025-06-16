import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    TextField,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Divider,
    Grid,
    Paper
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../api/axios";

export const BookingAds = () => {
    const { register, handleSubmit } = useForm();
    const adId = useParams().id;
    const navigate = useNavigate();
    const [adDetails, setAdDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookingData, setBookingData] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        const fetchAdDetails = async () => {
            try {
                const res = await API.get(`/ad/${adId}`);
                setAdDetails(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch ad details:", error);
                toast.error("Failed to load advertisement details");
                setLoading(false);
            }
        };

        fetchAdDetails();
    }, [adId]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const initiatePayment = async (formData) => {
        try {
            setProcessingPayment(true);


            const amount = 100;


            // const receipt = `booking-${adId}-${Date.now()}`;


            const orderResponse = await API.post("/createorder", {
                amount: amount,
                currency: "INR",
                receipt: "receipt_order_123"
            });

            // const orderData = orderResponse.data;
            const orderData = orderResponse.data.order || orderResponse.data;

        
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setProcessingPayment(false);
                toast.error("Failed to load payment gateway. Please check your internet connection.");
                return;
            }


            setBookingData({
                ...formData,
                amount: amount,
                currency: "INR"
            });

            // Configure Razorpay options
            const options = {
                // key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_QHSpqK630bLb7U",
                key: "rzp_test_uI9hi6mNzicqly",
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Ad Booking",
                description: `Booking for ${adDetails.title}`,
                order_id: orderData.id,
                handler: async function (response) {
                    handlePaymentSuccess(response, orderData);
                },
                prefill: {
                    name: formData.contactPerson || "contactPerson",
                    email: localStorage.getItem("email") || "",
                    // contact: localStorage.getItem("userPhone") || ""
                },
                theme: {
                    color: "#3f51b5"
                },
                modal: {
                    ondismiss: function () {
                        setProcessingPayment(false);
                        toast.info("Payment cancelled. Your booking was not processed.");
                    }
                }
            };


            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            setProcessingPayment(false);
            console.error("Payment initiation failed:", error);
            toast.error("Failed to initiate payment. Please try again.");
        }
    };

    const handlePaymentSuccess = async (paymentResponse, orderData) => {
        try {
            // Verify payment with backend
            const verificationResponse = await API.post("/verifyorder", {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature
            });

            if (verificationResponse.data.status === "success") {

                await submitBooking(paymentResponse, orderData);
            } else {
                setProcessingPayment(false);
                toast.error("Payment verification failed. Please contact support.");
            }
        } catch (error) {
            setProcessingPayment(false);
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed. Please try again.");
        }
    };

    const submitBooking = async (paymentDetails, orderData) => {
        if (!bookingData) {
            setProcessingPayment(false);
            toast.error("Booking data not found. Please try again.");
            return;
        }

        try {

            const finalBookingData = {
                // Booking details
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                displayFrequency: bookingData.displayFrequency || "standard",
                specialPlacement: bookingData.specialPlacement || "",
                contactPerson: bookingData.contactPerson || "",
                specialInstructions: bookingData.specialInstructions || "",
                analyticsRequired: bookingData.analyticsRequired || false,

                // Payment details
                payment: {
                    orderId: paymentDetails.razorpay_order_id,
                    paymentId: paymentDetails.razorpay_payment_id,
                    signature: paymentDetails.razorpay_signature,
                    amount: bookingData.amount,
                    currency: bookingData.currency
                }
            };


            const res = await API.post(`/bookads/${adId}`, finalBookingData);

            setProcessingPayment(false);
            toast.success("Booking successful! 🎉");


            setBookingData(null);


        } catch (error) {
            setProcessingPayment(false);
            console.error("Booking failed:", error);
            toast.error("Booking failed. Please try again.");
        }
    };

    const validateAndProceed = (data) => {
        if (new Date(data.endTime) < new Date(data.startTime)) {
            setError("End date must be after the start date.");
            toast.error("End date must be after the start date.");
            return;
        }
        setError("");

        // Proceed to payment
        initiatePayment(data);
    };

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
                    <Typography>Loading advertisement details...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                {adDetails && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                            {adDetails.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {adDetails.description}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Type:</strong> {adDetails?.adType}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Dimensions:</strong> {adDetails?.adDimensions || "N/A"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                    <strong>Duration:</strong> {adDetails?.adDuration}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Budget:</strong> ${adDetails?.budget}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>

            <Paper elevation={3}>
                <Box sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                }}>
                    <Typography variant="h5" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
                        BOOK ADVERTISEMENT
                    </Typography>

                    <form onSubmit={handleSubmit(validateAndProceed)} style={{ width: "100%" }}>
                        <Grid container spacing={3}>
                            {/* Required Booking Fields */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 1 }}>Required Information</Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    type="date"
                                    label="Start Date"
                                    InputLabelProps={{ shrink: true }}
                                    {...register("startTime")}
                                    required
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    type="date"
                                    label="End Date"
                                    InputLabelProps={{ shrink: true }}
                                    {...register("endTime")}
                                    required
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>

                            {/* Optional Booking Fields */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Additional Options</Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Display Frequency</InputLabel>
                                    <Select
                                        label="Display Frequency"
                                        defaultValue="standard"
                                        {...register("displayFrequency")}
                                    >
                                        <MenuItem value="low">Low (1-3 times daily)</MenuItem>
                                        <MenuItem value="standard">Standard (4-8 times daily)</MenuItem>
                                        <MenuItem value="high">High (9-15 times daily)</MenuItem>
                                        <MenuItem value="premium">Premium (16+ times daily)</MenuItem>
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
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Contact Person for Ad Communications"
                                    placeholder="Name and contact information"
                                    {...register("contactPerson")}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...register("analyticsRequired")}
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
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={processingPayment}
                                        sx={{ minWidth: 200 }}
                                    >
                                        {processingPayment ? "Processing..." : "Proceed to Payment"}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
};