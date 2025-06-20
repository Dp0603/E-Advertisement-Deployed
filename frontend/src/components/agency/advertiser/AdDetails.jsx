import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  CssBaseline,
  Select,
  Input,
  FormHelperText,
  Menu,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import API from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AdDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const getStates = async () => {
    const res = await API.get("/getstates");
    console.log(res.data);
    setStates(res.data.data);
  };

  const getCityByStateId = async (id) => {
    const res = await API.get("/getcitybystateid/" + id);
    console.log("city response...", res.data);
    setCities(res.data.data);
  };

  const getAreaByCityId = async (id) => {
    const res = await API.get("/getareabycity/" + id);
    console.log("ad:-", res.data);
    setAreas(res.data.data);
  };

  useEffect(() => {
    getStates();
  }, []);

  const handlerSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/advertiser/createads", data);
      console.log(res);
      console.log(res.data);
      toast.success("Ad details created successfully!");
      navigate("/screenings");
    } catch (error) {
      toast.error(
        "Error submitting ad: " +
          (error.response?.data?.message || error.message)
      );
    }
    setLoading(false);
  };

  const validations = {
    titleValidation: {
      required: {
        value: true,
        message: "title is required",
      },
      minLength: {
        value: 3,
        message: "Title should contain enough characters",
      },
    },
    descriptionValidation: {
      required: {
        value: true,
        message: "Description is required",
      },
      minLength: {
        value: 10,
        message: "Should contain aleast 10 characters",
      },
    },
    targetValidation: {
      required: {
        value: true,
        message: " This Field  is required",
      },
    },
    cityValidation: {
      required: {
        value: true,
        message: "Field is required",
      },
    },
    adTypeValidation: {
      required: {
        value: true,
        message: "Field is required",
      },
    },
    adDurationValidation: {
      required: {
        value: true,
        message: "Duration is required",
      },
    },
    budgetValidation: {
      required: {
        value: true,
        message: "Budget is required",
      },
    },
  };

  return (
    <>
      <CssBaseline />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: "110vh", // Full viewport height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0A192F",
          padding: "0px", // Removes extra spacing
          position: "relative",
        }}
      >
        {/* Main Box Container */}
        <Box
          sx={{
            display: "flex",
            width: "80%",
            maxWidth: "1200px",
            height: "650px", // Fixed height
            backgroundColor: "#112240",
            borderRadius: "8px",
            boxShadow: "4px 4px 10px rgba(0,0,0,0.3)",
            color: "white",
            padding: "20px",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)", // Centers properly
          }}
        >
          {/* Left - Form Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 2,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Advertisement Details
            </Typography>

            <form onSubmit={handleSubmit(handlerSubmit)}>
              <TextField
                fullWidth
                label="Title"
                {...register("title", validations.titleValidation)}
                error={!!errors.Title}
                helperText={errors.Title?.message}
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

              <FormControl fullWidth error={!!errors.adType}>
                <InputLabel sx={{ color: "white" }}>adType</InputLabel>
                <Select
                  label="adType"
                  {...register("adType", validations.adTypeValidation)}
                  // value={watch("adType") || ""}

                  sx={inputStyles}
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
                sx={inputStyles}
                {...register("adDimensions", validations.cityValidation)}
              ></TextField>

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
                label="Budget ($)"
                {...register("budget", validations.budgetValidation)}
                error={!!errors.budget}
                helperText={errors.budget?.message}
                variant="outlined"
                sx={inputStyles}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  background: "#2563EB",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  mt: 2,
                }}
              >
                {loading ? "Posting..." : "Submit Advertisement"}
              </Button>
            </form>
          </Box>

          {/* // right side of the box */}
          <Box
            sx={{
              flex: 1,
              padding: "20px",
              borderLeft: "2px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              More Options
            </Typography>

            {/* State Dropdown */}
            <FormControl fullWidth error={!!errors.state} sx={inputStyles}>
              <InputLabel>State</InputLabel>
              <Select
                {...register("stateId", { required: "State is required" })}
                onChange={(e) => {
                  getCityByStateId(e.target.value);
                }}
                label="State"
              >
                <MenuItem value="">Select State</MenuItem>
                {states?.map((state) => (
                  <MenuItem key={state._id} value={state._id}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.state && (
                <FormHelperText>{errors.state.message}</FormHelperText>
              )}
            </FormControl>

            {/* City Dropdown */}
            <FormControl fullWidth error={!!errors.city} sx={inputStyles}>
              <InputLabel>City</InputLabel>
              <Select
                {...register("cityId", { required: "City is required" })}
                onChange={(e) => {
                  getAreaByCityId(e.target.value);
                }}
                label="City"
              >
                <MenuItem value="">Select City</MenuItem>
                {cities?.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.city && (
                <FormHelperText>{errors.city.message}</FormHelperText>
              )}
            </FormControl>

            {/* Area Dropdown */}
            <FormControl fullWidth error={!!errors.area} sx={inputStyles}>
              <InputLabel>Area</InputLabel>
              <Select
                {...register("area", { required: "Area is required" })}
                label="Area"
              >
                <MenuItem value="">Select Area</MenuItem>
                {areas?.map((area) => (
                  <MenuItem key={area._id} value={area._id}>
                    {area.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.area && (
                <FormHelperText>{errors.area.message}</FormHelperText>
              )}
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
          </Box>
        </Box>
      </Container>
    </>
  );
};

const inputStyles = {
  mb: 2,
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiInputLabel-root": { color: "white" },
  "& .MuiInputLabel-root.Mui-focused": { color: "white" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "white" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "white !important" },
  "& .MuiSvgIcon-root": { color: "white" },
};

export default AdDetails;
