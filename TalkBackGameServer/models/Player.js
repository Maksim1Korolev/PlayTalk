import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  username: { type: String, required: true, unique: true },
  wins: { type: Number, default: 0 },
  inGame: { type: Boolean },
});

export default mongoose.model("Player", PlayerSchema);
