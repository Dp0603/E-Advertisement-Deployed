import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CssBaseline,
  Divider,
  CircularProgress,
  Fade,
  Tooltip,
  Chip,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CampaignIcon from "@mui/icons-material/Campaign";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useForm } from "react-hook-form";
import { useToast } from "../../../context/ToastContext";
import { useLoader } from "../../../context/LoaderContext";
import { jwtDecode } from "jwt-decode";
import API from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const AdDetails2 = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const advertiserId = decoded.id;

  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
  } = useForm();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdAdId, setCreatedAdId] = useState(null);

  // Fetch States, Cities, Areas
  const fetchStates = async () => {
    setFetching(true);
    try {
      const res = await API.get("/getstates");
      setStates(res.data.data);
    } catch (e) {
      showToast("Failed to load states", "error");
    }
    setFetching(false);
  };

  const fetchCities = async (stateId) => {
    setFetching(true);
    try {
      const res = await API.get("/getcitybystateid/" + stateId);
      setCities(res.data.data);
      setAreas([]);
      setValue("cityId", "");
      setValue("areaId", "");
    } catch (e) {
      showToast("Failed to load cities", "error");
    }
    setFetching(false);
  };

  const fetchAreas = async (cityId) => {
    setFetching(true);
    try {
      const res = await API.get("/getareabycity/" + cityId);
      setAreas(res.data.data);
      setValue("areaId", "");
    } catch (e) {
      showToast("Failed to load areas", "error");
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchStates();
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    showLoader("Uploading Ad...");
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

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else {
        showToast("Image is required", "error");
        setLoading(false);
        hideLoader();
        return;
      }

      const res = await API.post("/advertiser/createadswithfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Ad created successfully", "success");
      setCreatedAdId(res.data?.ad?._id || res.data?.adId);
      setSuccess(true);
      reset();
      setImagePreview(null);
      setSelectedFile(null);

      setTimeout(() => {
        setSuccess(false);
        if (res.data?.ad?._id || res.data?.adId) {
          navigate(`/viewdetails/${res.data.ad?._id || res.data.adId}`);
        } else {
          navigate("/advertiser/dashboard/" + advertiserId);
        }
      }, 1800);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to create ad",
        "error"
      );
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          py: 6,
          position: "relative",
        }}
      >
        <Fade in={!success}>
          <Paper
            elevation={8}
            sx={{
              width: "95%",
              maxWidth: 1300,
              minHeight: 750,
              borderRadius: 5,
              background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
              border: "2px solid #1976d2",
              boxShadow: 8,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              overflow: "hidden",
              mt: { xs: 8, md: 10 },
            }}
          >
            {/* Left - Form Section */}
            <Box
              sx={{
                flex: 1.3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                px: { xs: 3, md: 6 },
                py: 5,
                mt: { xs: 5, md: 3 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CampaignIcon sx={{ color: "#21cbf3", fontSize: 38, mr: 1 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: "#21cbf3",
                    letterSpacing: 1,
                  }}
                >
                  Advertisement Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: "#1976d2" }} />

              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  <Box sx={{ flex: "0 0 220px", alignSelf: "flex-start" }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<AddPhotoAlternateIcon />}
                      component="label"
                      sx={uploadBtnStyle}
                    >
                      Select Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setSelectedFile(file);
                          if (file) setImagePreview(URL.createObjectURL(file));
                        }}
                      />
                    </Button>
                    {!selectedFile && (
                      <FormHelperText error sx={{ mb: 2 }}>
                        Image is required
                      </FormHelperText>
                    )}
                    <Box
                      sx={{
                        mt: 2,
                        width: 200,
                        height: 200,
                        borderRadius: "18px",
                        background: "rgba(33,203,243,0.08)",
                        border: "2px dashed #21cbf3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        boxShadow: imagePreview
                          ? "0 4px 24px 0 rgba(33,203,243,0.18)"
                          : "none",
                        transition: "box-shadow 0.2s",
                      }}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "16px",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "#21cbf3", textAlign: "center" }}
                        >
                          Image Preview
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 250 }}>
                    <TextField
                      label="Title"
                      fullWidth
                      sx={inputStyles}
                      {...register("title", { required: "Title is required" })}
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      sx={inputStyles}
                      {...register("description", {
                        required: "Description is required",
                      })}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                    <TextField
                      label="Target Audience"
                      fullWidth
                      sx={inputStyles}
                      {...register("targetAudience", {
                        required: "Target Audience is required",
                      })}
                      error={!!errors.targetAudience}
                      helperText={errors.targetAudience?.message}
                    />
                    <TextField
                      label="Longitude & Latitude"
                      fullWidth
                      sx={inputStyles}
                      {...register("longitude_latitude", { required: true })}
                      error={!!errors.longitude_latitude}
                      helperText={errors.longitude_latitude?.message}
                    />
                    <TextField
                      label="Ad Type"
                      fullWidth
                      sx={inputStyles}
                      {...register("adType", { required: true })}
                      error={!!errors.adType}
                      helperText={errors.adType?.message}
                    />
                    <TextField
                      label="Ad Dimensions"
                      fullWidth
                      sx={inputStyles}
                      {...register("adDimensions", { required: true })}
                      error={!!errors.adDimensions}
                      helperText={errors.adDimensions?.message}
                    />
                    <TextField
                      label="Ad Duration"
                      fullWidth
                      sx={inputStyles}
                      {...register("adDuration", { required: true })}
                      error={!!errors.adDuration}
                      helperText={errors.adDuration?.message}
                    />
                    <TextField
                      label="Budget"
                      fullWidth
                      sx={inputStyles}
                      {...register("budget", { required: true })}
                      error={!!errors.budget}
                      helperText={errors.budget?.message}
                    />

                    <FormControl fullWidth sx={inputStyles} error={!!errors.stateId}>
                      <InputLabel sx={{ color: "#21cbf3" }}>State</InputLabel>
                      <Select
                        {...register("stateId", { required: "State is required" })}
                        onChange={(e) => {
                          setValue("stateId", e.target.value);
                          fetchCities(e.target.value);
                          trigger("stateId");
                        }}
                        defaultValue=""
                        sx={selectStyles}
                      >
                        <MenuItem value="">Select State</MenuItem>
                        {states.map((state) => (
                          <MenuItem key={state._id} value={state._id}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.stateId?.message}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth sx={inputStyles} error={!!errors.cityId}>
                      <InputLabel sx={{ color: "#21cbf3" }}>City</InputLabel>
                      <Select
                        {...register("cityId", { required: "City is required" })}
                        onChange={(e) => {
                          setValue("cityId", e.target.value);
                          fetchAreas(e.target.value);
                          trigger("cityId");
                        }}
                        defaultValue=""
                        sx={selectStyles}
                      >
                        <MenuItem value="">Select City</MenuItem>
                        {cities.map((city) => (
                          <MenuItem key={city._id} value={city._id}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.cityId?.message}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth sx={inputStyles} error={!!errors.areaId}>
                      <InputLabel sx={{ color: "#21cbf3" }}>Area</InputLabel>
                      <Select
                        {...register("areaId", { required: "Area is required" })}
                        defaultValue=""
                        sx={selectStyles}
                      >
                        <MenuItem value="">Select Area</MenuItem>
                        {areas.map((area) => (
                          <MenuItem key={area._id} value={area._id}>
                            {area.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.areaId?.message}</FormHelperText>
                    </FormControl>
                  </Box>
                </Box>
                <Divider sx={{ my: 3, borderColor: "#21cbf3" }} />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={submitBtnStyle}
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={22} sx={{ color: "#fff" }} />
                    ) : null
                  }
                >
                  {loading ? "Submitting..." : "Submit Advertisement"}
                </Button>
              </form>
              {fetching && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress sx={{ color: "#21cbf3" }} />
                </Box>
              )}
            </Box>
            {/* Right - Visual/Info Section */}
            <Box
              sx={{
                flex: 0.8,
                px: { xs: 3, md: 5 },
                py: 5,
                background: "rgba(33,203,243,0.04)",
                borderLeft: { md: "2px solid rgba(33,203,243,0.15)" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mt: { xs: 5, md: 3 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  color: "#21cbf3",
                  fontWeight: "bold",
                  letterSpacing: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocationOnIcon sx={{ color: "#21cbf3" }} />
                Location & Media
              </Typography>
              <Divider sx={{ mb: 2, borderColor: "#21cbf3" }} />
              <Typography
                variant="body1"
                sx={{
                  color: "#fff",
                  opacity: 0.9,
                  textAlign: "center",
                  mb: 2,
                  fontSize: "1.1rem",
                }}
              >
                Fill in all details to create a compelling advertisement. Use a
                high-quality image for best results!
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Tooltip title="Recommended: Use high-quality images for better engagement.">
                  <Chip label="Tip: Use High-Quality Images" color="info" />
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        </Fade>
        {/* Success Animation */}
        <Fade in={success}>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(10,25,47,0.92)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 420,
                background: "rgba(17,34,64,0.92)",
                borderRadius: 6,
                border: "2.5px solid #21cbf3",
                boxShadow: "0 8px 32px 0 rgba(33,203,243,0.22)",
                p: 6,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 90, color: "#21cbf3", mb: 2 }} />
              <Typography variant="h4" sx={{ color: "#21cbf3", mb: 1 }}>
                Advertisement Created!
              </Typography>
              <Typography variant="body1" sx={{ color: "#e3f2fd" }}>
                Redirecting to your ad...
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
    </>
  );
};

const inputStyles = {
  mb: 2,
  input: { color: "#fff" },
  label: { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#21cbf3" },
    "&:hover fieldset": { borderColor: "#21cbf3" },
    "&.Mui-focused fieldset": { borderColor: "#21cbf3" },
  },
};

const selectStyles = {
  color: "#21cbf3",
  background: "#112240",
  borderRadius: 2,
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#21cbf3" },
};

const uploadBtnStyle = {
  borderColor: "#21cbf3",
  color: "#21cbf3",
  borderRadius: "30px",
  fontWeight: 600,
  mt: 1,
  background: "rgba(33,203,243,0.08)",
  "&:hover": {
    background: "#e3f2fd",
    color: "#1976d2",
    borderColor: "#1976d2",
  },
};

const submitBtnStyle = {
  mt: 3,
  background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
  borderRadius: "30px",
  fontWeight: 600,
  letterSpacing: 1,
  minHeight: 48,
  fontSize: "1.15rem",
  boxShadow: "0 4px 20px rgba(33,203,243,0.10)",
  "&:hover": {
    background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
  },
};

export default AdDetails2;
