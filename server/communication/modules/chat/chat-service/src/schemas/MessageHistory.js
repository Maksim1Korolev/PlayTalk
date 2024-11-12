import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  date: { type: String, required: true },
  username: { type: String, required: true, maxlength: 15 },
  readAt: { type: String },
});
const MessageHistorySchema = new mongoose.Schema({
  usernames: { type: [String], required: true, maxlength: 15 },
  messages: [MessageSchema],
});

export default mongoose.model("MessageHistory", MessageHistorySchema);
