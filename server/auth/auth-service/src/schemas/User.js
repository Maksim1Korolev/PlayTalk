import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 15 },
  password: { type: String, required: true },
  avatarFileName: { type: String },
});

export default mongoose.model("User", UserSchema);
