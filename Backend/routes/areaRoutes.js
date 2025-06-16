const routes = require('express').Router()
const areaController = require("../controllers/areaController");
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");


routes.post("/addarea", verifyToken, authorizedRoles("advertiser"), areaController.addArea);
routes.get("/getarea", verifyToken, areaController.getAreas);
routes.get("/getareabycity/:cityId", verifyToken, areaController.getAreaByCity);

module.exports = routes;