const routes = require('express').Router();
const cityController = require("../controllers/cityController");
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");

routes.post("/addcity", verifyToken, authorizedRoles("advertiser"), cityController.addCity);
routes.get("/getallcities", verifyToken, cityController.getCities);
routes.get("/getcitybystateid/:stateId", verifyToken, cityController.getCityByStateId);

module.exports = routes;