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
  Chip,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import API from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CampaignIcon from "@mui/icons-material/Campaign";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useToast } from "../../../context/ToastContext";
import { useLoader } from "../../../context/LoaderContext";

const AdDetails2 = () => {
  const token = localStorage.getItem("token");
  const decodedtoken = jwtDecode(token);
  const advertiserId = decodedtoken.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm();

  const AD_TYPES = [
    "Billboard",
    "Digital",
    "Gantry",
    "Unipole",
    "Transit",
    "Mobile",
    "LED Screen",
    "Banner",
  ];

  const TARGET_AUDIENCES = [
    "General Public",
    "Commuters",
    "Shoppers",
    "Students",
    "Professionals",
    "Tourists",
  ];

  const DURATION_OPTIONS = [
    { label: "1 Week", value: 7 },
    { label: "2 Weeks", value: 14 },
    { label: "1 Month", value: 30 },
    { label: "Custom", value: "custom" },
  ];

  const BUDGET_OPTIONS = [
    { label: "Below $500", value: "<500" },
    { label: "$500 - $1000", value: "500-1000" },
    { label: "$1000 - $5000", value: "1000-5000" },
    { label: "Above $5000", value: ">5000" },
  ];

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [customDuration, setCustomDuration] = useState("");
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);

  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  // Fetch states, cities, areas
  useEffect(() => {
    getStates();
  }, []);

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

  // Handle image preview
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setValue("image", [e.target.files[0]], { shouldValidate: true });
    } else {
      setImagePreview(null);
      setValue("image", [], { shouldValidate: true });
    }
  };

  // Handle target audience chips
  const handleAudienceChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAudiences(typeof value === "string" ? value.split(",") : value);
    setValue(
      "targetAudience",
      typeof value === "string" ? value.split(",") : value,
      { shouldValidate: true }
    );
  };

  // Handle featured switch
  const handleFeaturedChange = (event) => {
    setIsFeatured(event.target.checked);
    setValue("isFeatured", event.target.checked);
  };

  // Watch for duration selection
  const durationValue = watch("adDuration");

  // Enhanced submit handler
  const handlerSubmit = async (data) => {
    setLoading(true);
    showLoader("Submitting Ad...");
    console.log("handlerSubmit called");
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("targetAudience", (data.targetAudience || []).join(","));
      formData.append("longitude_latitude", data.longitude_latitude);
      formData.append("adType", data.adType);
      formData.append("adDimensions", data.adDimensions);
      formData.append(
        "adDuration",
        data.adDuration === "custom" ? customDuration : data.adDuration
      );
      formData.append("budget", data.budget);
      formData.append("stateId", data.stateId);
      formData.append("cityId", data.cityId);
      formData.append("areaId", data.areaId);
      formData.append("isFeatured", isFeatured);

      // Append image file correctly
      console.log("data.image:", data.image);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
        console.log("Image appended to formData");
      } else {
        showToast("Image is required", "error");
        setLoading(false);
        hideLoader();
        console.log("Image missing, aborting submit");
        return;
      }

      // Log all formData entries
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // ❗️ Use the correct endpoint for file upload
      console.log("Sending request to /advertiser/createadswithfile");
      await API.post("/advertiser/createadswithfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Ad created successfully!", "success");
      reset();
      setImagePreview(null);
      setSelectedAudiences([]);
      setIsFeatured(false);
      setCustomDuration("");
      navigate("/screenings2");
      console.log("Ad creation successful, navigating...");
    } catch (error) {
      console.log("Error in handlerSubmit:", error);
      showToast(
        "Error creating ad: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    } finally {
      setLoading(false);
      hideLoader();
      console.log("handlerSubmit finished");
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

              <form onSubmit={handleSubmit(handlerSubmit)} autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Title"
                      {...register("title", {
                        required: "Title is required",
                        minLength: {
                          value: 3,
                          message: "At least 3 characters",
                        },
                      })}
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      variant="outlined"
                      sx={inputStyles}
                      InputProps={{ style: { color: "#fff" } }}
                      InputLabelProps={{ style: { color: "#fff" } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={!!errors.adType}
                      sx={inputStyles}
                    >
                      <InputLabel sx={{ color: "#fff" }}>Ad Type</InputLabel>
                      <Select
                        label="Ad Type"
                        {...register("adType", {
                          required: "Ad Type is required",
                        })}
                        sx={{
                          color: "#fff",
                          ".MuiSvgIcon-root": { color: "#fff" },
                        }}
                        defaultValue=""
                      >
                        <MenuItem value="">Select Type</MenuItem>
                        {AD_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.adType && (
                        <FormHelperText>{errors.adType.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Description"
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message: "At least 10 characters",
                        },
                      })}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      variant="outlined"
                      sx={inputStyles}
                      InputProps={{ style: { color: "#fff" } }}
                      InputLabelProps={{ style: { color: "#fff" } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={!!errors.targetAudience}
                      sx={inputStyles}
                    >
                      <InputLabel sx={{ color: "#fff" }}>
                        Target Audience
                      </InputLabel>
                      <Select
                        label="Target Audience"
                        multiple
                        value={selectedAudiences}
                        onChange={handleAudienceChange}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} color="info" />
                            ))}
                          </Box>
                        )}
                        sx={{
                          color: "#fff",
                          ".MuiSvgIcon-root": { color: "#fff" },
                        }}
                      >
                        {TARGET_AUDIENCES.map((aud) => (
                          <MenuItem key={aud} value={aud}>
                            <PeopleAltIcon sx={{ mr: 1, color: "#21cbf3" }} />
                            {aud}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.targetAudience && (
                        <FormHelperText>
                          {errors.targetAudience.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Dimensions (e.g. 10x20 ft)"
                      {...register("adDimensions", {
                        required: "Dimensions are required",
                      })}
                      error={!!errors.adDimensions}
                      helperText={errors.adDimensions?.message}
                      variant="outlined"
                      sx={inputStyles}
                      InputProps={{ style: { color: "#fff" } }}
                      InputLabelProps={{ style: { color: "#fff" } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={!!errors.adDuration}
                      sx={inputStyles}
                    >
                      <InputLabel sx={{ color: "#fff" }}>
                        Ad Duration
                      </InputLabel>
                      <Select
                        label="Ad Duration"
                        {...register("adDuration", {
                          required: "Duration is required",
                        })}
                        sx={{
                          color: "#fff",
                          ".MuiSvgIcon-root": { color: "#fff" },
                        }}
                        defaultValue=""
                      >
                        <MenuItem value="">Select Duration</MenuItem>
                        {DURATION_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            <CalendarMonthIcon
                              sx={{ mr: 1, color: "#21cbf3" }}
                            />
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {durationValue === "custom" && (
                        <TextField
                          fullWidth
                          type="number"
                          label="Custom Duration (Days)"
                          value={customDuration}
                          onChange={(e) => setCustomDuration(e.target.value)}
                          sx={{ mt: 2, input: { color: "#fff" } }}
                          InputLabelProps={{ style: { color: "#fff" } }}
                        />
                      )}
                      {errors.adDuration && (
                        <FormHelperText>
                          {errors.adDuration.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={!!errors.budget}
                      sx={inputStyles}
                    >
                      <InputLabel sx={{ color: "#fff" }}>Budget</InputLabel>
                      <Select
                        label="Budget"
                        {...register("budget", {
                          required: "Budget is required",
                        })}
                        sx={{
                          color: "#fff",
                          ".MuiSvgIcon-root": { color: "#fff" },
                        }}
                        defaultValue=""
                      >
                        <MenuItem value="">Select Budget</MenuItem>
                        {BUDGET_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            <AttachMoneyIcon sx={{ mr: 1, color: "#21cbf3" }} />
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.budget && (
                        <FormHelperText>{errors.budget.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isFeatured}
                          onChange={handleFeaturedChange}
                          color="info"
                        />
                      }
                      label={
                        <Typography sx={{ color: "#21cbf3", fontWeight: 500 }}>
                          Mark as Featured Ad
                        </Typography>
                      }
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Longitude and Latitude"
                      {...register("longitude_latitude", {
                        required: "Longitude and Latitude are required",
                      })}
                      error={!!errors.longitude_latitude}
                      helperText={errors.longitude_latitude?.message}
                      variant="outlined"
                      sx={inputStyles}
                      InputProps={{ style: { color: "#fff" } }}
                      InputLabelProps={{ style: { color: "#fff" } }}
                    />
                  </Grid>
                  {/* Location Dropdowns */}
                  <Grid item xs={12} sm={4}>
                    <FormControl
                      fullWidth
                      error={!!errors.stateId}
                      sx={inputStyles}
                    >
                      <InputLabel sx={{ color: "#fff" }}>State</InputLabel>
                      <Select
                        {...register("stateId", {
                          required: "State is required",
                        })}
                        onChange={(e) => {
                          setValue("stateId", e.target.value);
                          getCityByStateId(e.target.value);
                        }}
                        label="State"
                        sx={{
                          color: "#fff",
                          ".MuiSvgIcon-root": { color: "#fff" },
                        }}
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
                        <FormHelperText>
                          {errors.stateId.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl
                      fullWidth
                      error={!!errors.cityId}
                      sx={inputStyles}
                    >
                      <InputLabel sx={{ color: "#fff" }}>City</InputLabel>
                      <Select
                        {...register("cityId", {
                          required: "City is required",
                        })}
                        onChange={(e) => {
                          setValue("cityId", e.target.value);
                          getAreaByCityId(e.target.value);
                        }}
                        label="City"
                        sx={{
                          color: "#fff",
                          ".MuiSvgIcon-root": { color: "#fff" },
                        }}
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
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl
                      fullWidth
                      error={!!errors.areaId}
                      sx={inputStyles}
                    >
                      <InputLabel sx={{ color: "#fff" }}>Area</InputLabel>
                      <Select
                        {...register("areaId", {
                          required: "Area is required",
                        })}
                        label="Area"
                        sx={{
                          color: "#fff",
                          ".MuiSvgIcon-root": { color: "#fff" },
                        }}
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
                  </Grid>
                  {/* Image Upload */}
                  <Grid item xs={12}>
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
                        {...register("image", {
                          required: "Image is required",
                          validate: {
                            hasFile: (files) =>
                              (files && files.length > 0) ||
                              "Image is required",
                          },
                        })}
                        onChange={(e) => {
                          handleImageChange(e);
                          setValue("image", e.target.files, {
                            shouldValidate: true,
                          });
                          trigger("image");
                        }}
                      />
                    </Button>
                    {watch("image")?.[0] && (
                      <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                        Selected: {watch("image")[0].name}
                      </Typography>
                    )}

                    {errors.image && (
                      <Typography
                        color="error"
                        sx={{ fontSize: 13, mt: -1, mb: 1 }}
                      >
                        {errors.image.message}
                      </Typography>
                    )}
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
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>
              </form>
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
                Fill in all details to create a compelling advertisement. Mark
                as "Featured" for more visibility!
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Tooltip title="Recommended: Use high-quality images for better engagement.">
                  <Chip label="Tip: Use High-Quality Images" color="info" />
                </Tooltip>
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
