import mongoose, { InferSchemaType, Types } from "mongoose";

//TODO:Add required to avatarFileName
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 15 },
  avatarFileName: { type: String, required: true },
});
export type UserType = InferSchemaType<typeof UserSchema> & { _id: Types.ObjectId };
export default mongoose.model("User", UserSchema);
