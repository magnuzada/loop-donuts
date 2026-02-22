import mongoose, { Schema, Document } from 'mongoose';

export interface IDonut extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  active: boolean;
}

const DonutSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true, default: 'Clássico' },
  active: { type: Boolean, required: true, default: true },
}, { timestamps: true });

const Donut = mongoose.models.Donut || mongoose.model<IDonut>('Donut', DonutSchema);

export default Donut;