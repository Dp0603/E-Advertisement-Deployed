require("dotenv").config();
const express = require('express');
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoute");
const adRoutes = require("./routes/adCreateRoutes");
const fetchAdRoutes = require("./routes/adFetchingRoutes");
const deletedAdRoute = require("./routes/adDeleteRoutes");
const deleteUserRoutes = require("./routes/userDeleteRoutes");
const stateRoutes = require("./routes/stateRoutes");
const cityRoutes = require("./routes/cityRoutes");
const cityByStateRoutes = require("./routes/cityRoutes");
const areaRoutes = require("./routes/areaRoutes");
const areaByCityRoutes = require("./routes/cityRoutes");
const bookingRoutes = require("./routes/adBookingRoutes");
const savedAdRoutes = require("./routes/savedAdRoutes")

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

connectDB();

app.use("/auth", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", adRoutes);
app.use("/", fetchAdRoutes);
app.use("/", deletedAdRoute);
app.use("/", deleteUserRoutes);
app.use("/", stateRoutes);
app.use("/", cityRoutes);
app.use("/", cityByStateRoutes);
app.use("/", areaRoutes);
app.use("/", areaByCityRoutes);
app.use("/", bookingRoutes);
app.use("/api", savedAdRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running on port 5000..."));


