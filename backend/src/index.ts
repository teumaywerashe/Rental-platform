import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import houseRoutes from "./routes/houseRoutes";
import contactRoutes from "./routes/contactRoutes";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});








PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/rental_platform
JWT_SECRET=super_secret_jwt_key_12345!
