import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  CssBaseline,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  Paper,
  Divider,
  Fade,
  Tooltip,
} from "@mui/material";
import { useForm } from "react-hook-form";
import API from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CampaignIcon from "@mui/icons-material/Campaign";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useToast } from "../../../context/ToastContext";
import { useLoader } from "../../../context/LoaderContext";

export const AdDetails2 = () => {
  const token = localStorage.getItem("token");
  const decodedtoken = jwtDecode(token);
  const advertiserId = decodedtoken.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const getStates = async () => {
    const res = await API.get("/getstates");
    setStates(res.data.data);
  };

  const getCityByStateId = async (id) => {
    setValue("cityId", "");
    setValue("areaId", "");
    setCities([]);
    setAreas([]);
    if (!id) return;
    const res = await API.get("/getcitybystateid/" + id);
    setCities(res.data.data);
  };

  const getAreaByCityId = async (id) => {
    setValue("areaId", "");
    setAreas([]);
    if (!id) return;
    const res = await API.get("/getareabycity/" + id);
    setAreas(res.data.data);
  };

  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    getStates();
  }, []);

  const handlerSubmit = async (data) => {
    setLoading(true);
    showLoader();

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
      formData.append("image", data.image[0]);
      formData.append("advertiserId", advertiserId);

      await API.post("/advertiser/createadswithfile", formData);
      showToast("Ad created successfully!", "success");
      navigate("/screenings2");
    } catch (error) {
      showToast(
        "Error creating ad: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    }
    setLoading(false);
    hideLoader();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setImagePreview(null);
    }
  };

  const validations = {
    titleValidation: {
      required: { value: true, message: "Title is required" },
      minLength: {
        value: 3,
        message: "Title should contain enough characters",
      },
    },
    descriptionValidation: {
      required: { value: true, message: "Description is required" },
      minLength: {
        value: 10,
        message: "Should contain at least 10 characters",
      },
    },
    targetValidation: {
      required: { value: true, message: "Target Audience is required" },
    },
    cityValidation: {
      required: { value: true, message: "Field is required" },
    },
    adTypeValidation: {
      required: { value: true, message: "Ad Type is required" },
    },
    adDurationValidation: {
      required: { value: true, message: "Duration is required" },
    },
    budgetValidation: {
      required: { value: true, message: "Budget is required" },
    },
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
        {/* Back Button at Top Left */}
        <Box
          sx={{
            position: "fixed",
            top: 32,
            left: 32,
            zIndex: 1201,
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
              background: "rgba(10,25,47,0.85)",
              boxShadow: 2,
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
        </Box>
        <Fade in>
          <Paper
            elevation={8}
            sx={{
              width: "90%",
              maxWidth: 1200,
              minHeight: 700,
              borderRadius: 5,
              background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
              border: "2px solid #1976d2",
              boxShadow: 8,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              overflow: "hidden",
              mt: { xs: 8, md: 10 }, // Add margin-top to push form below the back button
            }}
          >
            {/* Left - Form Section */}
            <Box
              sx={{
                flex: 1.2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                px: { xs: 3, md: 5 },
                py: 5,
                mt: { xs: 5, md: 3 }, // Extra margin-top for form content
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

              <form onSubmit={handleSubmit(handlerSubmit)} autoComplete="off">
                <TextField
                  fullWidth
                  label="Title"
                  {...register("title", validations.titleValidation)}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  variant="outlined"
                  sx={inputStyles}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#fff" } }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  {...register(
                    "description",
                    validations.descriptionValidation
                  )}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  variant="outlined"
                  sx={inputStyles}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#fff" } }}
                />

                <TextField
                  fullWidth
                  label="Target Audience"
                  {...register("targetAudience", validations.targetValidation)}
                  error={!!errors.targetAudience}
                  helperText={errors.targetAudience?.message}
                  variant="outlined"
                  sx={inputStyles}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#fff" } }}
                />

                <FormControl fullWidth error={!!errors.adType} sx={inputStyles}>
                  <InputLabel sx={{ color: "#fff" }}>Ad Type</InputLabel>
                  <Select
                    label="Ad Type"
                    {...register("adType", validations.adTypeValidation)}
                    sx={{
                      color: "#fff",
                      ".MuiSvgIcon-root": { color: "#fff" },
                    }}
                  >
                    <MenuItem value="Billboard">Billboard</MenuItem>
                    <MenuItem value="Digital">Digital</MenuItem>
                    <MenuItem value="Gantry">Gantry</MenuItem>
                    <MenuItem value="Unipole">Unipole</MenuItem>
                  </Select>
                  {errors.adType && (
                    <FormHelperText>{errors.adType.message}</FormHelperText>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  label="Dimensions"
                  {...register("adDimensions", validations.cityValidation)}
                  error={!!errors.adDimensions}
                  helperText={errors.adDimensions?.message}
                  variant="outlined"
                  sx={inputStyles}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#fff" } }}
                />

                <TextField
                  fullWidth
                  label="Ad Duration (Days)"
                  {...register("adDuration", validations.adDurationValidation)}
                  error={!!errors.adDuration}
                  helperText={errors.adDuration?.message}
                  variant="outlined"
                  sx={inputStyles}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#fff" } }}
                />

                <TextField
                  fullWidth
                  label="Budget ($)"
                  {...register("budget", validations.budgetValidation)}
                  error={!!errors.budget}
                  helperText={errors.budget?.message}
                  variant="outlined"
                  sx={inputStyles}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#fff" } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    background:
                      "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    mt: 2,
                    borderRadius: "30px",
                    py: 1.3,
                    boxShadow: "0 4px 20px rgba(25,118,210,0.10)",
                    letterSpacing: 1,
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                    },
                  }}
                  startIcon={<CampaignIcon />}
                >
                  {loading ? "Posting..." : "Submit Advertisement"}
                </Button>
              </form>
            </Box>

            {/* Right - Location & Image Section */}
            <Box
              sx={{
                flex: 1,
                px: { xs: 3, md: 5 },
                py: 5,
                background: "rgba(33,203,243,0.04)",
                borderLeft: { md: "2px solid rgba(33,203,243,0.15)" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mt: { xs: 5, md: 3 }, // Extra margin-top for right section as well
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

              {/* State Dropdown */}
              <FormControl fullWidth error={!!errors.stateId} sx={inputStyles}>
                <InputLabel sx={{ color: "#fff" }}>State</InputLabel>
                <Select
                  {...register("stateId", { required: "State is required" })}
                  onChange={(e) => {
                    setValue("stateId", e.target.value);
                    getCityByStateId(e.target.value);
                  }}
                  label="State"
                  sx={{ color: "#fff", ".MuiSvgIcon-root": { color: "#fff" } }}
                  defaultValue=""
                >
                  <MenuItem value="">Select State</MenuItem>
                  {states?.map((state) => (
                    <MenuItem key={state._id} value={state._id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.stateId && (
                  <FormHelperText>{errors.stateId.message}</FormHelperText>
                )}
              </FormControl>

              {/* City Dropdown */}
              <FormControl fullWidth error={!!errors.cityId} sx={inputStyles}>
                <InputLabel sx={{ color: "#fff" }}>City</InputLabel>
                <Select
                  {...register("cityId", { required: "City is required" })}
                  onChange={(e) => {
                    setValue("cityId", e.target.value);
                    getAreaByCityId(e.target.value);
                  }}
                  label="City"
                  sx={{ color: "#fff", ".MuiSvgIcon-root": { color: "#fff" } }}
                  defaultValue=""
                >
                  <MenuItem value="">Select City</MenuItem>
                  {cities?.map((city) => (
                    <MenuItem key={city._id} value={city._id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.cityId && (
                  <FormHelperText>{errors.cityId.message}</FormHelperText>
                )}
              </FormControl>

              {/* Area Dropdown */}
              <FormControl fullWidth error={!!errors.areaId} sx={inputStyles}>
                <InputLabel sx={{ color: "#fff" }}>Area</InputLabel>
                <Select
                  {...register("areaId", { required: "Area is required" })}
                  label="Area"
                  sx={{ color: "#fff", ".MuiSvgIcon-root": { color: "#fff" } }}
                  defaultValue=""
                >
                  <MenuItem value="">Select Area</MenuItem>
                  {areas?.map((area) => (
                    <MenuItem key={area._id} value={area._id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.areaId && (
                  <FormHelperText>{errors.areaId.message}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Longitude and Latitude"
                {...register("longitude_latitude", validations.cityValidation)}
                error={!!errors.longitude_latitude}
                helperText={errors.longitude_latitude?.message}
                variant="outlined"
                sx={inputStyles}
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#fff" } }}
              />

              {/* Image Upload */}
              <Box sx={{ width: "100%", mt: 2 }}>
                <Typography sx={{ color: "#fff", mb: 1, fontWeight: 500 }}>
                  Upload Hoarding Image
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<AddPhotoAlternateIcon />}
                  sx={{
                    borderColor: "#21cbf3",
                    color: "#21cbf3",
                    borderRadius: "20px",
                    fontWeight: 600,
                    letterSpacing: 1,
                    py: 1.2,
                    mb: 1,
                    "&:hover": {
                      borderColor: "#1976d2",
                      background: "rgba(33,203,243,0.08)",
                    },
                  }}
                >
                  Select Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    {...register("image")}
                    onChange={(e) => {
                      handleImageChange(e);
                      setValue("image", e.target.files);
                    }}
                  />
                </Button>
                {imagePreview && (
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 180,
                        borderRadius: 12,
                        border: "2px solid #21cbf3",
                        boxShadow: "0 2px 8px rgba(33,203,243,0.15)",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </>
  );
};

const inputStyles = {
  mb: 2,
  "& .MuiInputBase-input": { color: "#fff" },
  "& .MuiInputLabel-root": { color: "#fff" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#21cbf3" },
    "&:hover fieldset": { borderColor: "#21cbf3" },
    "&.Mui-focused fieldset": { borderColor: "#21cbf3" },
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#21cbf3 !important" },
  "& .MuiSvgIcon-root": { color: "#21cbf3" },
};

export default AdDetails2;
