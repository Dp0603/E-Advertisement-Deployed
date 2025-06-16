import React, { useEffect, useState } from "react";
import {  Container, Card, CardHeader, CardContent, IconButton, Typography, Avatar, MenuItem, Select, FormControl, InputLabel, Box, CardMedia, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, FormHelperText } from "@mui/material";
import API from "../../../api/axios";
import { jwtDecode } from "jwt-decode";
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";



export const Screens2 = () => {
    const [ads, setAds] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedAd, setSelectedAd] = useState(null);
    const [filterActive, setFilterActive] = useState(false);
    const [specificAd, setSpecificAds] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const token = localStorage.getItem("token");
    const decodedtoken = jwtDecode(token);
    const advertiserId = decodedtoken.id;

    useEffect(() => {

        fetchAds();
        getStates();
    }, [advertiserId]);

    const fetchAds = async () => {
        try {
            console.log("Current user:", advertiserId);
            const res = await API.get(`/ads/${advertiserId}`);
            console.log(res);
            console.log(res.data);
            console.log(token);
            setAds(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditOpen = (adId) => {
        const adToEdit = ads.find(ad => ad._id === adId);
        setSelectedAd(adToEdit);
        if (adToEdit) {
            setValue("title", adToEdit.title);
            setValue("description", adToEdit.description);
            setValue("targetAudience", adToEdit.targetAudience);
            setValue("longitude_latitude", adToEdit.longitude_latitude);
            setValue("adType", adToEdit.adType);
            setValue("adDimensions", adToEdit.adDimensions);
            setValue("adDuration", adToEdit.adDuration);
            setValue("budget", adToEdit.budget);
            if (adToEdit.stateId) setValue("stateId", adToEdit.stateId._id);
            if (adToEdit.cityId) setValue("cityId", adToEdit.cityId._id);
            if (adToEdit.areaId) setValue("areaId", adToEdit.areaId._id)
        }

        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        reset();
    };

    const handleViewOpen = (adId) => {
        if (!viewOpen) {
            const adToView = ads.find(ad => ad._id === adId);
            setSelectedAd(adToView);
            setViewOpen(true);
        }
    };


    const handleViewCLose = () => {
        setViewOpen(false);
        // setSelectedAd(null);
        reset();
    }

    const getStates = async () => {
        try {
            const res = await API.get("/getstates");
            console.log(res.data);
            setStates(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCityByStateId = async (id) => {
        if (!id) {
            setCities([]);
            return;
        }

        try {
            const res = await API.get(`/getcitybystateid/${id}`);
            console.log("City Response:", res.data);
            setCities(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAdsByCity = async (id) => {
        if (!id) {
            setSpecificAds([]);
            setFilterActive(false);
            return;
        }

        try {
            const res = await API.get(`/ads/city/${id}`);
            console.log(res.data);
            setSpecificAds(res.data.ads);
            setFilterActive(true);
        } catch (error) {
            console.log(error);
        }
    };

    const getAreaByCityId = async (id) => {
        if (!id) {
            setAreas([]);
            return;
        }

        try {
            const res = await API.get(`/getareabycity/${id}`);
            console.log("Areas:", res.data);
            setAreas(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const submitHandler = async (data) => {
        if (!selectedAd) {
            console.error("No ad selected for update");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("targetAudience", data.targetAudience);
            formData.append("longitude_latitude", data.longitude_latitude);
            formData.append("adType", data.adType);
            formData.append("adDimensions", data.adDimensions);
            formData.append("adDuration", data.adDuration);
            formData.append("budget", data.budget);
            formData.append("stateId", data.stateId);
            formData.append("cityId", data.cityId);
            formData.append("areaId", data.areaId);
            formData.append("advertiserId", advertiserId);


            if (data.image && data.image[0]) {
                formData.append("image", data.image[0]);
            }

            const res = await API.put(`/advertiser/updateadswithfile/${selectedAd._id}`, formData);
            console.log("Update response:", res.data);
            handleEditClose();
            await fetchAds();
            toast.success("Ad details updated successfully!");


        } catch (error) {
            console.log(error);
            toast.error("Failed to update ad details");

        }
    };

    const validations = {
        titleValidation: {
            required: {
                value: true,
                message: "Title is required"
            },
            minLength: {
                value: 3,
                message: "Title should contain at least 3 characters"
            }
        },
        descriptionValidation: {
            required: {
                value: true,
                message: "Description is required"
            },
            minLength: {
                value: 10,
                message: "Should contain at least 10 characters"
            }
        },
        targetValidation: {
            required: {
                value: true,
                message: "This field is required"
            }
        },
        cityValidation: {
            required: {
                value: true,
                message: "Field is required"
            }
        },
        adTypeValidation: {
            required: {
                value: true,
                message: "Field is required"
            }
        },
        adDurationValidation: {
            required: {
                value: true,
                message: "Duration is required"
            }
        },
        budgetValidation: {
            required: {
                value: true,
                message: "Budget is required"
            }
        }
    };

    const displayAds = filterActive ? specificAd : ads;

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h5" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
                Screens:
            </Typography>

            <Box sx={{ display: "flex", gap: 2, ml: 4 }}>
                <FormControl sx={{ minWidth: 120 }} >
                    <InputLabel>State</InputLabel>
                    <Select
                        onChange={(e) => { getCityByStateId(e.target.value); }}
                        label="State"
                    >
                        <MenuItem value="">All</MenuItem>
                        {states?.map((state) => (
                            <MenuItem key={state._id} value={state._id}>{state.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120, mr: 2 }}  >
                    <InputLabel>City</InputLabel>
                    <Select
                        onChange={(e) => {
                            fetchAdsByCity(e.target.value);
                        }}
                        label="City"
                    >
                        <MenuItem value="">All</MenuItem>
                        {cities?.map((city) => (
                            <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
                justifyItems: "center",
                alignItems: "start",
                padding: "20px",
            }}>
                {displayAds && displayAds.length > 0 ? (
                    displayAds.map((ad) => (
                        <Card key={ad._id} sx={{
                            width: "100%",
                            maxWidth: 330,
                            minHeight: "150px",
                            backgroundColor: "#fff",
                            color: "#000",
                            borderRadius: "12px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": { transform: "scale(1.05)", boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" },
                        }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewOpen(ad._id);
                            }}
                        >
                            <CardHeader
                                avatar={<Avatar sx={{ bgcolor: "red" }}>{ad.title[0]}</Avatar>}
                                title={ad.title}
                                subheader={` ${ad.cityId?.name || "Cityname not available"}, ${ad.areaId?.name || "areaname not available"}`}
                                action={
                                    <IconButton onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditOpen(ad._id);
                                    }} sx={{ color: "primary.main" }}>
                                        <EditIcon />
                                    </IconButton>
                                }
                            />
                            <CardMedia
                                component="img"
                                height="300"
                                image={ad.adUrl}
                                alt={ad.title}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" >
                                    {ad.description}
                                </Typography>
                            </CardContent >
                            <Dialog
                                open={viewOpen}
                                onClose={handleViewCLose}
                                maxWidth="md"
                                fullWidth
                            >
                                <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
                                    {selectedAd?.title}
                                </DialogTitle>

                                <DialogContent dividers sx={{ p: 3 }}>
                                    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>

                                        <Box flex="0 0 45%" display="flex" justifyContent="center">
                                            <CardMedia
                                                component="img"
                                                image={selectedAd?.adUrl}
                                                alt={selectedAd?.title}
                                                sx={{ width: "100%", maxHeight: 350, objectFit: "cover", borderRadius: "12px", boxShadow: 3 }}
                                            />
                                        </Box>


                                        <Box flex="1" display="flex" flexDirection="column" gap={2}>
                                            {[
                                                { label: "City", value: selectedAd?.cityId?.name },
                                                { label: "Area", value: selectedAd?.areaId?.name },
                                                { label: "Ad Type", value: selectedAd?.adType, color: "green" },
                                                { label: "Target Audience", value: selectedAd?.targetAudience, color: "blue" },
                                                { label: "Duration", value: selectedAd?.adDuration ? `${selectedAd.adDuration} days` : "N/A", color: "purple" },
                                                { label: "Longitude & Latitude", value: selectedAd?.longitude_latitude, color: "orange" },
                                                { label: "Budget", value: `${selectedAd?.budget} Rs`, color: "red" },
                                                { label: "Dimension", value: selectedAd?.adDimensions, color: "teal" },
                                            ].map((item, index) => (
                                                <Typography key={index} variant="body1" sx={{ fontWeight: "bold", fontSize: "1rem", color: item.color || "inherit" }}>
                                                    <strong>{item.label}:</strong> {item.value || "Not available"}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Box>
                                </DialogContent>

                                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                                    <Button onClick={handleViewCLose} color="primary" variant="contained" sx={{ px: 3, py: 1 }}>
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Card>
                    ))
                ) : (
                    <Typography sx={{ mt: 2, color: "gray", gridColumn: "1 / -1" }}>No Screens available</Typography>
                )}
            </div>

            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="lg" fullWidth>
                <DialogTitle>Edit Ad</DialogTitle>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <DialogContent>
                        <Container
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                gap: 2,
                                p: 0
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    {...register("title", validations.titleValidation)}
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                    variant="outlined"
                                    sx={inputStyles}
                                />

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Description"
                                    {...register("description", validations.descriptionValidation)}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                    variant="outlined"
                                    sx={inputStyles}
                                />

                                <TextField
                                    fullWidth
                                    label="Target Audience"
                                    {...register("targetAudience", validations.targetValidation)}
                                    error={!!errors.targetAudience}
                                    helperText={errors.targetAudience?.message}
                                    variant="outlined"
                                    sx={inputStyles}
                                />

                                <FormControl fullWidth error={!!errors.adType} sx={inputStyles}>
                                    <InputLabel>Ad Type</InputLabel>
                                    <Select
                                        label="Ad Type"
                                        {...register("adType", validations.adTypeValidation)}
                                    >
                                        <MenuItem value="Billboard">Billboard</MenuItem>
                                        <MenuItem value="Digital">Digital</MenuItem>
                                        <MenuItem value="Gantry">Gantry</MenuItem>
                                        <MenuItem value="Unipole">Unipole</MenuItem>
                                    </Select>
                                    {errors.adType && <FormHelperText>{errors.adType.message}</FormHelperText>}
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Dimensions"
                                    {...register("adDimensions", validations.cityValidation)}
                                    error={!!errors.adDimensions}
                                    helperText={errors.adDimensions?.message}
                                    sx={inputStyles}
                                />

                                <TextField
                                    fullWidth
                                    label="Ad Duration (Days)"
                                    {...register("adDuration", validations.adDurationValidation)}
                                    error={!!errors.adDuration}
                                    helperText={errors.adDuration?.message}
                                    variant="outlined"
                                    sx={inputStyles}
                                />

                                <TextField
                                    fullWidth
                                    label="Budget (Rs)"
                                    {...register("budget", validations.budgetValidation)}
                                    error={!!errors.budget}
                                    helperText={errors.budget?.message}
                                    variant="outlined"
                                    sx={inputStyles}
                                />
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <FormControl fullWidth error={!!errors.stateId} sx={inputStyles}>
                                    <InputLabel>State</InputLabel>
                                    <Select
                                        {...register("stateId", { required: "State is required" })}
                                        onChange={(e) => {
                                            getCityByStateId(e.target.value);
                                            setValue("cityId", "");
                                            setValue("areaId", "");
                                        }}
                                        label="State"
                                    >
                                        <MenuItem value="">Select State</MenuItem>
                                        {states?.map((state) => (
                                            <MenuItem key={state._id} value={state._id}>{state.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.stateId && <FormHelperText>{errors.stateId.message}</FormHelperText>}
                                </FormControl>

                                <FormControl fullWidth error={!!errors.cityId} sx={inputStyles}>
                                    <InputLabel>City</InputLabel>
                                    <Select
                                        {...register("cityId", { required: "City is required" })}
                                        onChange={(e) => {
                                            getAreaByCityId(e.target.value);
                                            setValue("areaId", "");
                                        }}
                                        label="City"
                                    >
                                        <MenuItem value="">Select City</MenuItem>
                                        {cities?.map((city) => (
                                            <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.cityId && <FormHelperText>{errors.cityId.message}</FormHelperText>}
                                </FormControl>

                                <FormControl fullWidth error={!!errors.areaId} sx={inputStyles}>
                                    <InputLabel>Area</InputLabel>
                                    <Select
                                        {...register("areaId", { required: "Area is required" })}
                                        label="Area"
                                    >
                                        <MenuItem value="">Select Area</MenuItem>
                                        {areas?.map((area) => (
                                            <MenuItem key={area._id} value={area._id}>{area.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.areaId && <FormHelperText>{errors.areaId.message}</FormHelperText>}
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Longitude and latitude"
                                    {...register("longitude_latitude", validations.cityValidation)}
                                    error={!!errors.longitude_latitude}
                                    helperText={errors.longitude_latitude?.message}
                                    variant="outlined"
                                    sx={inputStyles}
                                />

                                <Typography variant="subtitle1" sx={{ mt: 2 }}>Update Image (Optional)</Typography>
                                <input type="file" {...register("image")} />
                            </Box>
                        </Container>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={handleEditClose} color="secondary" variant="outlined">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Update Ad
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

const inputStyles = {
    mb: 2,
    '& .MuiInputBase-input': { color: "black" },
    '& .MuiInputLabel-root': { color: "lightblue" },
    '& .MuiInputLabel-root.Mui-focused': { color: "black" },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: "black" },
        '&:hover fieldset': { borderColor: "cyan" },
        '&.Mui-focused fieldset': { borderColor: "black" },
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: "black" },
    '& .MuiSvgIcon-root': { color: "black" }
};

export default Screens2;