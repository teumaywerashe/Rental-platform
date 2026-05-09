import express from "express";
import { submitContact, getContactsByHouse } from "../controllers/contactController";
import { protect, ownerOnly } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", submitContact);
router.get("/:houseId", protect, ownerOnly, getContactsByHouse);

export default router;
