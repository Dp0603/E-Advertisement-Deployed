import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Card, CardContent, Typography, CircularProgress, Container, Grid, Box } from "@mui/material";
import { CheckCircle, Close } from "@mui/icons-material";
import bgimg from "../assets/images/BookMyAd1.jpg";

const BookedAds = () => {
    const [bookedAds, setBookedAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookedAds = async () => {
            try {
                const res = await API.get("/getbookings");
                setBookedAds(res.data.data);
            } catch (error) {
                console.error("Error fetching booked ads:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookedAds();
    }, []);

    return (
        <Box
        sx={{
            minHeight: "100vh",
            backgroundImage: `url(${bgimg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            display: "flex",
            justifyContent: "center",
            py: 4,
        }}
     >
        <Container maxWidth="md">
            {/* HEADER SECTION */}
            <Box textAlign="center" my={4}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    BOOKED ADS
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Here is the list of ads you have booked.
                </Typography>
            </Box>

            {/* LOADING SPINNER */}
            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : bookedAds.length === 0 ? (
                <Typography textAlign="center" color="textSecondary">
                    No bookings found.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {bookedAds.map((booking) => (
                        <Grid item xs={12} key={booking._id}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" color="secondary">
                                        {booking.adId?.title || "Ad Title"}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" mt={1}>
                                        📅 Start: {new Date(booking.startTime).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                            🏁 End: {new Date(booking.endTime).toLocaleString()}
                                    </Typography>

                                    {/* STATUS with ICON */}
                                    <Box display="flex" alignItems="center" mt={1}>
                                            {booking.status === "confirmed" ? (
                                                <>
                                                    <CheckCircle sx={{ color: "green", mr: 1 }} />
                                                    <Typography variant="body2" fontWeight="bold" color="green">
                                                        Status: CONFIRMED
                                                    </Typography>
                                                </>
                                            ) : (
                                                <>
                                                    <Close sx={{ color: "red", mr: 1 }} />
                                                    <Typography variant="body2" fontWeight="bold" color="red">
                                                        Status: REJECTED
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
        </Box>
    );
};

export default BookedAds;
