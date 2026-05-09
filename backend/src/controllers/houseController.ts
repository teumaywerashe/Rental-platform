import { Response } from "express";
import House from "../models/House";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Get all houses (with filtering)
// @route   GET /api/houses
// @access  Public
export const getHouses = async (req: AuthRequest, res: Response) => {
  try {
    const { minPrice, maxPrice, location, size, keyword, status } = req.query;

    let query: any = {};

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
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

    const houses = await House.find(query)
      .populate("ownerId", "name phone email")
      .sort({ createdAt: -1 });

    res.json(houses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single house
// @route   GET /api/houses/:id
// @access  Public
export const getHouseById = async (req: AuthRequest, res: Response) => {
  try {
    const house = await House.findById(req.params.id).populate(
      "ownerId",
      "name phone email"
    );

    if (house) {
      res.json(house);
    } else {
      res.status(404).json({ message: "House not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a house
// @route   POST /api/houses
// @access  Private/Owner
export const createHouse = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      locationName,
      latitude,
      longitude,
      price,
      size,
      images,
      status,
    } = req.body;

    const house = new House({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a house
// @route   PUT /api/houses/:id
// @access  Private/Owner
export const updateHouse = async (req: AuthRequest, res: Response) => {
  try {
    const house = await House.findById(req.params.id);

    if (house) {
      // Check if user is the owner
      if (house.ownerId.toString() !== req.user?._id?.toString()) {
        return res.status(401).json({ message: "Not authorized to update this house" });
      }

      const updatedHouse = await House.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      res.json(updatedHouse);
    } else {
      res.status(404).json({ message: "House not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a house
// @route   DELETE /api/houses/:id
// @access  Private/Owner
export const deleteHouse = async (req: AuthRequest, res: Response) => {
  try {
    const house = await House.findById(req.params.id);

    if (house) {
      if (house.ownerId.toString() !== req.user?._id?.toString()) {
        return res.status(401).json({ message: "Not authorized to delete this house" });
      }

      await House.deleteOne({ _id: house._id });
      res.json({ message: "House removed" });
    } else {
      res.status(404).json({ message: "House not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update house status
// @route   PATCH /api/houses/:id/status
// @access  Private/Owner
export const updateHouseStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const house = await House.findById(req.params.id);

    if (house) {
      if (house.ownerId.toString() !== req.user?._id?.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }

      house.status = status;
      const updatedHouse = await house.save();
      res.json(updatedHouse);
    } else {
      res.status(404).json({ message: "House not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
