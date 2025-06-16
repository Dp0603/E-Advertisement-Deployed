import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import API from '../../../api/axios'

export const ManageBookings = () => {

    const [bookings, setBookings] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");


    useEffect(() => {
        fetchBookings();
    }, [])

    const fetchBookings = async () => {
        const res = await API.get("/getbookings");
        console.log(res.data.data);
        setBookings(res.data.data);
    }

    const updateBookingData = async () => {
        try {
            const res = await API.put(`/updatebookingstatus/${selectedBookingId}`, { status: selectedStatus });
            console.log(res.data);
            fetchBookings();
            handleCloseDialog();
        } catch (error) {
            console.log(error);
        }

    }


    const handleOpenDialog = (id) => {
        setSelectedBookingId(id);
        setOpen(true);
    }

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedBookingId(null);
        setSelectedStatus("");

    }
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0A192F",
                flexDirection: "row",
                alignItems: "center",
                padding: "20px"
            }}
        >
            <Typography sx={{ textAlign: "center", color: "white" }} variant='h4'>AD BOOKINGS</Typography>

            {bookings.length > 0 ? (

                bookings.map((detail) => (
                    <Card key={detail._id}
                        sx={{
                            width: "30vw", mt: "20px", ml: "60px",
                            borderRadius: "15px",
                            background: "linear-gradient(135deg,rgb(42, 60, 136) 0%,#0A192F 100%)",
                            color: "#fff",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                            "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.5)"
                            }
                        }}
                    >
                        <CardContent>
                            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 1 }}>
                                {detail.adId?.title}
                            </Typography>
                            <Typography sx={{ opacity: 0.9, fontSize: "0.9rem" }}>
                                {detail.adId?.description}
                            </Typography>
                            <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                                Budget: <span style={{ color: "#ffd700" }}>{detail.adId?.budget} RS</span>
                            </Typography>
                            <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
                                Location: {detail.adId?.stateId.name}, {detail.adId?.cityId.name}
                            </Typography>
                            <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
                                Client: {detail.clientId?.name} ({detail.clientId?.email})
                            </Typography>
                            <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
                                Start Time: {new Date(detail?.startTime).toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
                                End Time: {new Date(detail?.endTime).toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
                                Display Frequency: {detail?.displayFrequency}
                            </Typography>
                            {detail?.specialPlacement && (
                                <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
                                    Special Placement: {detail?.specialPlacement}
                                </Typography>
                            )}
                            {detail.contactPerson && (
                                <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
                                    Contact Person: {detail?.contactPerson}
                                </Typography>
                            )}
                            {detail.specialInstructions && (
                                <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
                                    Instructions: {detail?.specialInstructions}
                                </Typography>
                            )}
                            <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
                                Analytics Required: {detail?.analyticsRequired ? "Yes" : "No"}
                            </Typography>
                            <Typography sx={{ mt: 1, fontWeight: "bold", color: detail.status === "confirmed" ? "lightgreen" : "red" }}>
                                Status: {detail?.status}
                            </Typography>

                        </CardContent>
                        <CardActions><Button size='small' variant='outlined' onClick={() => handleOpenDialog(detail?._id)}>Update status</Button></CardActions>
                    </Card>
                ))
            ) : (
                <Typography sx={{ mt: 2, color: "gray" }}>No Bookings  available</Typography>
            )}

            <Dialog open={open} onclose={handleCloseDialog}>
                <DialogTitle>
                    <Typography>Update Ad Status</Typography>
                    <DialogContent>
                        <Typography>Select Status:</Typography>
                        <Select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="confirmed">Accept</MenuItem>
                            <MenuItem value="rejected">Reject</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>close</Button>
                        <Button onClick={updateBookingData} disabled={!selectedStatus}>Update status</Button>
                    </DialogActions>
                </DialogTitle>
            </Dialog>


        </div>

    )
}
