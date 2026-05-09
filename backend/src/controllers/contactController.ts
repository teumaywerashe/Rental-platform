import { Request, Response } from "express";
import Contact from "../models/Contact";
import House from "../models/House";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Submit a contact inquiry
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req: Request, res: Response) => {
  try {
    const { houseId, senderName, message, contactInfo } = req.body;

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    const contact = await Contact.create({
      houseId,
      senderName,
      message,
      contactInfo,
    });

    res.status(201).json(contact);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get contacts for a specific house
// @route   GET /api/contact/:houseId
// @access  Private/Owner
export const getContactsByHouse = async (req: AuthRequest, res: Response) => {
  try {
    const house = await House.findById(req.params.houseId);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    if (house.ownerId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: "Not authorized to view these contacts" });
    }

    const contacts = await Contact.find({ houseId: req.params.houseId as string }).sort({
      createdAt: -1,
    });

    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
