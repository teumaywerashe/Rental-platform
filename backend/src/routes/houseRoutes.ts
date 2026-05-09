import express from "express";
import {
  getHouses,
  getHouseById,
  createHouse,
  updateHouse,
  deleteHouse,
  updateHouseStatus,
} from "../controllers/houseController";
import { protect, ownerOnly } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(getHouses).post(protect, ownerOnly, createHouse);

router
  .route("/:id")
  .get(getHouseById)
  .put(protect, ownerOnly, updateHouse)
  .delete(protect, ownerOnly, deleteHouse);

router.patch("/:id/status", protect, ownerOnly, updateHouseStatus);

export default router;
