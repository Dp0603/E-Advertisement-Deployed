import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { useToast } from "../../../context/ToastContext";
import { useLoader } from "../../../context/LoaderContext";
import { jwtDecode } from "jwt-decode";
import API from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;

const AdDetails3 = () => {
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

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageBoxSize, setImageBoxSize] = useState({ width: 480, height: 250 });

  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
    flag: getFlagUrl(country.isoCode),
  }));

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
    : [];

  const cityOptions =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
          (city) => ({
            value: city.name,
            label: city.name,
          })
        )
      : [];

  const formatCountryOption = (option) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={option.flag}
        alt={option.label}
        style={{ width: 24, height: 18, marginRight: 8, borderRadius: 2 }}
      />
      <span>{option.label}</span>
    </div>
  );

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
      formData.append("country", selectedCountry?.label || "");
      formData.append("state", selectedState?.label || "");
      formData.append("city", selectedCity?.label || "");
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

  const handleBackDashboard = () => {
    navigate(`/advertiser/dashboard/${advertiserId}`);
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
          py: { xs: 2, sm: 4, md: 6 },
          position: "relative",
        }}
      >
        {/* Back to Dashboard Button */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 8, sm: 16, md: 32 },
            left: { xs: 8, sm: 16, md: 32 },
            zIndex: 10,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              borderRadius: "30px",
              fontWeight: 600,
              letterSpacing: 1,
              borderColor: "#21cbf3",
              color: "#21cbf3",
              background: "rgba(33,203,243,0.08)",
              fontSize: { xs: "0.85rem", sm: "1rem" },
              px: { xs: 1.5, sm: 3 },
              py: { xs: 0.5, sm: 1 },
              minWidth: { xs: 0, sm: 120 },
              "&:hover": {
                borderColor: "#1976d2",
                background: "#e3f2fd",
                color: "#1976d2",
              },
            }}
            onClick={handleBackDashboard}
          >
            Back to Dashboard
          </Button>
        </Box>
        <Fade in={!success}>
          <Paper
            elevation={8}
            sx={{
              width: { xs: "98%", sm: "95%" },
              maxWidth: { xs: "100%", md: 1300 },
              minHeight: { xs: 0, md: 750 },
              borderRadius: { xs: 2, md: 5 },
              background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
              border: "2px solid #1976d2",
              boxShadow: 8,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              overflow: "hidden",
              mt: { xs: 4, sm: 6, md: 10 },
              mb: { xs: 2, md: 3 },
            }}
          >
            {/* Left - Image Section */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(33,203,243,0.04)",
                borderRight: { md: "2px solid rgba(33,203,243,0.15)" },
                py: { xs: 3, sm: 4, md: 6 },
                px: { xs: 1, sm: 2, md: 4 },
                minWidth: { xs: "100%", md: 320 },
                maxWidth: { xs: "100%", md: 400 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 1, md: 2 },
                  color: "#21cbf3",
                  fontWeight: "bold",
                  letterSpacing: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                }}
              >
                <AddPhotoAlternateIcon sx={{ color: "#21cbf3" }} />
                Select Image
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddPhotoAlternateIcon />}
                component="label"
                sx={{
                  ...uploadBtnStyle,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  py: { xs: 0.8, sm: 1.2 },
                }}
              >
                Choose Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setSelectedFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImagePreview(url);

                      // Dynamically set box size based on image
                      const img = new window.Image();
                      img.onload = function () {
                        // Limit max size for preview box
                        const maxW = 480, maxH = 250;
                        let w = img.width, h = img.height;
                        // Scale down if needed
                        if (w > maxW || h > maxH) {
                          const ratio = Math.min(maxW / w, maxH / h);
                          w = Math.round(w * ratio);
                          h = Math.round(h * ratio);
                        }
                        // For mobile, set min size
                        if (window.innerWidth < 600) {
                          w = Math.min(w, window.innerWidth - 48);
                        }
                        setImageBoxSize({ width: w, height: h });
                      };
                      img.src = url;
                    }
                  }}
                />
              </Button>
              {!selectedFile && (
                <FormHelperText error sx={{ mb: 2, fontSize: { xs: 12, sm: 14 } }}>
                  Image is required
                </FormHelperText>
              )}
              {/* Rectangle Image Preview */}
              <Box
                sx={{
                  mt: 3,
                  width: {
                    xs: Math.min(imageBoxSize.width, window.innerWidth - 48),
                    sm: imageBoxSize.width,
                  },
                  height: imageBoxSize.height,
                  borderRadius: "12px",
                  background: "rgba(33,203,243,0.08)",
                  border: "2px dashed #21cbf3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  boxShadow: imagePreview
                    ? "0 4px 24px 0 rgba(33,203,243,0.18)"
                    : "none",
                  transition: "box-shadow 0.2s, width 0.2s, height 0.2s",
                  p: 0,
                  mx: "auto",
                  maxWidth: "100%",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "10px",
                      display: "block",
                      margin: "auto",
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
              {selectedFile && (
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: 2,
                    color: "#fff",
                    wordBreak: "break-all",
                    textAlign: "center",
                    fontSize: { xs: 12, sm: 15 },
                  }}
                >
                  {selectedFile.name}
                </Typography>
              )}
            </Box>
            {/* Right - Form Section */}
            <Box
              sx={{
                flex: 1.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                px: { xs: 1, sm: 2, md: 6 },
                py: { xs: 2, sm: 3, md: 5 },
                mt: { xs: 2, md: 3 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 1, md: 2 } }}>
                <CampaignIcon sx={{ color: "#21cbf3", fontSize: { xs: 28, md: 38 }, mr: 1 }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: "#21cbf3",
                    letterSpacing: 1,
                    fontSize: { xs: "1.1rem", sm: "1.3rem", md: "2rem" },
                  }}
                >
                  Advertisement Details
                </Typography>
              </Box>
              <Divider sx={{ mb: { xs: 2, md: 3 }, borderColor: "#1976d2" }} />

              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <TextField
                  label="Title"
                  fullWidth
                  sx={inputStyles}
                  {...register("title", { required: "Title is required" })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  size="small"
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
                  size="small"
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
                  size="small"
                />
                <TextField
                  label="Longitude & Latitude"
                  fullWidth
                  sx={inputStyles}
                  {...register("longitude_latitude", { required: true })}
                  error={!!errors.longitude_latitude}
                  helperText={errors.longitude_latitude?.message}
                  size="small"
                />

                {/* Grouped fields in one line, stack on mobile */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <TextField
                    label="Ad Type"
                    sx={{ ...inputStyles, flex: 1 }}
                    {...register("adType", { required: true })}
                    error={!!errors.adType}
                    helperText={errors.adType?.message}
                    size="small"
                  />
                  <TextField
                    label="Ad Dimensions"
                    sx={{ ...inputStyles, flex: 1 }}
                    {...register("adDimensions", { required: true })}
                    error={!!errors.adDimensions}
                    helperText={errors.adDimensions?.message}
                    size="small"
                  />
                  <TextField
                    label="Ad Duration"
                    sx={{ ...inputStyles, flex: 1 }}
                    {...register("adDuration", { required: true })}
                    error={!!errors.adDuration}
                    helperText={errors.adDuration?.message}
                    size="small"
                  />
                  <TextField
                    label="Budget"
                    sx={{ ...inputStyles, flex: 1 }}
                    {...register("budget", { required: true })}
                    error={!!errors.budget}
                    helperText={errors.budget?.message}
                    size="small"
                  />
                </Box>

                {/* Country Dropdown */}
                <Box sx={{ mb: 2 }}>
                  <Select
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={(country) => {
                      setSelectedCountry(country);
                      setSelectedState(null);
                      setSelectedCity(null);
                    }}
                    placeholder="Select Country"
                    formatOptionLabel={formatCountryOption}
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: "#112240",
                        borderColor: "#21cbf3",
                        color: "#fff",
                        minHeight: 38,
                        fontSize: 14,
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#fff",
                        fontSize: 14,
                      }),
                      menu: (base) => ({
                        ...base,
                        background: "#112240",
                        color: "#fff",
                        fontSize: 14,
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? "#17375E" : "#112240",
                        color: "#fff",
                        fontSize: 14,
                      }),
                    }}
                  />
                  {!selectedCountry && (
                    <FormHelperText error>
                      Country is required
                    </FormHelperText>
                  )}
                </Box>
                {/* State Dropdown */}
                <Box sx={{ mb: 2 }}>
                  <Select
                    options={stateOptions}
                    value={selectedState}
                    onChange={(state) => {
                      setSelectedState(state);
                      setSelectedCity(null);
                    }}
                    placeholder="Select State"
                    isDisabled={!selectedCountry}
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: "#112240",
                        borderColor: "#21cbf3",
                        color: "#fff",
                        minHeight: 38,
                        fontSize: 14,
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#fff",
                        fontSize: 14,
                      }),
                      menu: (base) => ({
                        ...base,
                        background: "#112240",
                        color: "#fff",
                        fontSize: 14,
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? "#17375E" : "#112240",
                        color: "#fff",
                        fontSize: 14,
                      }),
                    }}
                  />
                  {selectedCountry && !selectedState && (
                    <FormHelperText error>
                      State is required
                    </FormHelperText>
                  )}
                </Box>
                {/* City Dropdown */}
                <Box sx={{ mb: 2 }}>
                  <Select
                    options={cityOptions}
                    value={selectedCity}
                    onChange={setSelectedCity}
                    placeholder="Select City"
                    isDisabled={!selectedState}
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: "#112240",
                        borderColor: "#21cbf3",
                        color: "#fff",
                        minHeight: 38,
                        fontSize: 14,
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#fff",
                        fontSize: 14,
                      }),
                      menu: (base) => ({
                        ...base,
                        background: "#112240",
                        color: "#fff",
                        fontSize: 14,
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? "#17375E" : "#112240",
                        color: "#fff",
                        fontSize: 14,
                      }),
                    }}
                  />
                  {selectedState && !selectedCity && (
                    <FormHelperText error>
                      City is required
                    </FormHelperText>
                  )}
                </Box>
                <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: "#21cbf3" }} />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    ...submitBtnStyle,
                    fontSize: { xs: "1rem", md: "1.15rem" },
                    minHeight: { xs: 38, md: 48 },
                    mt: { xs: 2, md: 3 },
                  }}
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
              px: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: 220, md: 420 },
                background: "rgba(17,34,64,0.92)",
                borderRadius: 6,
                border: "2.5px solid #21cbf3",
                boxShadow: "0 8px 32px 0 rgba(33,203,243,0.22)",
                p: { xs: 2, md: 6 },
              }}
            >
              <CheckCircleIcon sx={{ fontSize: { xs: 50, md: 90 }, color: "#21cbf3", mb: 2 }} />
              <Typography variant="h5" sx={{ color: "#21cbf3", mb: 1, fontSize: { xs: 18, md: 32 } }}>
                Advertisement Created!
              </Typography>
              <Typography variant="body1" sx={{ color: "#e3f2fd", fontSize: { xs: 14, md: 18 } }}>
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
  mb: { xs: 1.2, sm: 2 },
  input: { color: "#fff", fontSize: 14 },
  label: { color: "#fff", fontSize: 14 },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#21cbf3" },
    "&:hover fieldset": { borderColor: "#21cbf3" },
    "&.Mui-focused fieldset": { borderColor: "#21cbf3" },
  },
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

export default AdDetails3;