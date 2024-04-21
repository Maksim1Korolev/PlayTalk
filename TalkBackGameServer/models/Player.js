import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  username: { type: String, required: true, unique },
  wins: { type: Number, default: 0 },
  inGame: { type: boolean },
});

export default mongoose.model("Player", PlayerSchema);
