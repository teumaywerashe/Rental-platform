"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHouseStatus = exports.deleteHouse = exports.updateHouse = exports.createHouse = exports.getHouseById = exports.getHouses = void 0;
const House_1 = __importDefault(require("../models/House"));
// @desc    Get all houses (with filtering)
// @route   GET /api/houses
// @access  Public
const getHouses = async (req, res) => {
    try {
        const { minPrice, maxPrice, location, size, keyword, status } = req.query;
        let query = {};
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        if (location) {
            query.locationName = { $regex: location, $options: "i" };
        }
        if (size) {
            query.size = size;
        }
        if (status) {
            query.status = status;
        }
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }
        const houses = await House_1.default.find(query)
            .populate("ownerId", "name phone email")
            .sort({ createdAt: -1 });
        res.json(houses);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getHouses = getHouses;
// @desc    Get single house
// @route   GET /api/houses/:id
// @access  Public
const getHouseById = async (req, res) => {
    try {
        const house = await House_1.default.findById(req.params.id).populate("ownerId", "name phone email");
        if (house) {
            res.json(house);
        }
        else {
            res.status(404).json({ message: "House not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getHouseById = getHouseById;
// @desc    Create a house
// @route   POST /api/houses
// @access  Private/Owner
const createHouse = async (req, res) => {
    try {
        const { title, description, locationName, latitude, longitude, price, size, images, status, } = req.body;
        const house = new House_1.default({
            ownerId: req.user?._id,
            title,
            description,
            locationName,
            latitude,
            longitude,
            price,
            size,
            images,
            status: status || "available",
        });
        const createdHouse = await house.save();
        res.status(201).json(createdHouse);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createHouse = createHouse;
// @desc    Update a house
// @route   PUT /api/houses/:id
// @access  Private/Owner
const updateHouse = async (req, res) => {
    try {
        const house = await House_1.default.findById(req.params.id);
        if (house) {
            // Check if user is the owner
            if (house.ownerId.toString() !== req.user?._id?.toString()) {
                return res.status(401).json({ message: "Not authorized to update this house" });
            }
            const updatedHouse = await House_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            res.json(updatedHouse);
        }
        else {
            res.status(404).json({ message: "House not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateHouse = updateHouse;
// @desc    Delete a house
// @route   DELETE /api/houses/:id
// @access  Private/Owner
const deleteHouse = async (req, res) => {
    try {
        const house = await House_1.default.findById(req.params.id);
        if (house) {
            if (house.ownerId.toString() !== req.user?._id?.toString()) {
                return res.status(401).json({ message: "Not authorized to delete this house" });
            }
            await House_1.default.deleteOne({ _id: house._id });
            res.json({ message: "House removed" });
        }
        else {
            res.status(404).json({ message: "House not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteHouse = deleteHouse;
// @desc    Update house status
// @route   PATCH /api/houses/:id/status
// @access  Private/Owner
const updateHouseStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const house = await House_1.default.findById(req.params.id);
        if (house) {
            if (house.ownerId.toString() !== req.user?._id?.toString()) {
                return res.status(401).json({ message: "Not authorized" });
            }
            house.status = status;
            const updatedHouse = await house.save();
            res.json(updatedHouse);
        }
        else {
            res.status(404).json({ message: "House not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateHouseStatus = updateHouseStatus;
