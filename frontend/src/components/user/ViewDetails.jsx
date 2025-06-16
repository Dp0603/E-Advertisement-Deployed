import { Typography, Box, Button, Card, CardContent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from "../../api/axios";
import ViewDetailsBg from "../assets/images/BookMyAd1.jpg"

export const ViewDetails = () => {
    const { id } = useParams();
    const [ad, setAd] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const handleBooking = () => {
        navigate(`/bookings/${id}`);
    }

    useEffect(() => {
        fetchAdDetails();
    }, [id]);

    const fetchAdDetails = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/ad/${id}`);
            console.log("API Response:", res.data);
            setAd(res.data);
        } catch (error) {
            console.log("Error fetching ad details:", error);
        } finally {
            setLoading(false);
        }
    };


    if (loading)
        return <Typography>Loading...</Typography>;
    if (!ad)
        return <Typography>No ad details found.</Typography>;
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(${ViewDetailsBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                padding: "40px",
                textAlign: "center"
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: "bold",
                    color: "#333",
                    background: "rgba(255, 255, 255, 0.5)", // Soft glass effect
                    padding: "10px 20px",
                    borderRadius: "8px"
                }}>
                {ad.title}
            </Typography>

            {/* Image - Centered with a Shadow Effect */}
            <Box sx={{ margin: "20px 0" }}>
                <img
                    src={ad.adUrl}
                    alt={ad.title}
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                        borderRadius: "12px",
                        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)"
                    }}
                />
            </Box>

            {/* Details Section */}
            <Box sx={{
                background: "rgba(255, 255, 255, 0.4)", // Light transparent background
                padding: "20px",
                borderRadius: "8px",
                maxWidth: "600px"
            }}>
                <Typography variant="body1">
                    <strong>Location:</strong> {ad.cityId?.name || "N/A"}, {ad.areaId?.name || "N/A"}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                    <strong>Description:</strong> {ad.description}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                    <strong>Ad Type:</strong> {ad.adType || "N/A"}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                    <strong>Dimensions:</strong> {ad.adDimensions || "N/A"}
                </Typography>
                {ad.adDuration && (
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                    <strong>Duration:</strong> {ad.adDuration} days
                </Typography>
                )}
                <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: 2, color: "#1976D2" }}>
                    Price: ₹{ad.budget}
                </Typography>
            </Box>

            {/* Book Now Button */}
            <Button
                variant="contained"
                sx={{
                    marginTop: 3,
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    backgroundColor: "#1976D2",
                    "&:hover": { backgroundColor: "#1558A0" }
                }}
                onClick={handleBooking}
            >
                Book Now
            </Button>
        </Box>

    );
};
