import mongoose from "mongoose";

const NeighborhoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Neighborhood || mongoose.model("Neighborhood", NeighborhoodSchema);