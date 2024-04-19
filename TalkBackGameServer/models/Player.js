import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  wins: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Player", PlayerSchema);
