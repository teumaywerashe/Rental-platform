"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactsByHouse = exports.submitContact = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const House_1 = __importDefault(require("../models/House"));
// @desc    Submit a contact inquiry
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
    try {
        const { houseId, senderName, message, contactInfo } = req.body;
        const house = await House_1.default.findById(houseId);
        if (!house) {
            return res.status(404).json({ message: "House not found" });
        }
        const contact = await Contact_1.default.create({
            houseId,
            senderName,
            message,
            contactInfo,
        });
        res.status(201).json(contact);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.submitContact = submitContact;
// @desc    Get contacts for a specific house
// @route   GET /api/contact/:houseId
// @access  Private/Owner
const getContactsByHouse = async (req, res) => {
    try {
        const house = await House_1.default.findById(req.params.houseId);
        if (!house) {
            return res.status(404).json({ message: "House not found" });
        }
        if (house.ownerId.toString() !== req.user?._id?.toString()) {
            return res.status(401).json({ message: "Not authorized to view these contacts" });
        }
        const contacts = await Contact_1.default.find({ houseId: req.params.houseId }).sort({
            createdAt: -1,
        });
        res.json(contacts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getContactsByHouse = getContactsByHouse;
