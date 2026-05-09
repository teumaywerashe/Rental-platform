"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const houseController_1 = require("../controllers/houseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route("/").get(houseController_1.getHouses).post(authMiddleware_1.protect, authMiddleware_1.ownerOnly, houseController_1.createHouse);
router
    .route("/:id")
    .get(houseController_1.getHouseById)
    .put(authMiddleware_1.protect, authMiddleware_1.ownerOnly, houseController_1.updateHouse)
    .delete(authMiddleware_1.protect, authMiddleware_1.ownerOnly, houseController_1.deleteHouse);
router.patch("/:id/status", authMiddleware_1.protect, authMiddleware_1.ownerOnly, houseController_1.updateHouseStatus);
exports.default = router;
