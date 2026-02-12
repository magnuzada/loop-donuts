import mongoose, { Schema, model, models } from "mongoose";

const NeighborhoodSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "O nome do bairro é obrigatório"],
      unique: true, // Não pode ter dois bairros com mesmo nome
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Cria createdAt e updatedAt automaticamente
  }
);

// Evita re-compilar o modelo se já existir (padrão Next.js)
const Neighborhood = models.Neighborhood || model("Neighborhood", NeighborhoodSchema);

export default Neighborhood;