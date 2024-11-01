import mongoose, { InferSchemaType, Types } from "mongoose";

//TODO:Add required to avatarFileName
const ProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 15 },
  avatarFileName: { type: String, required: true },
});
export type ProfileType = InferSchemaType<typeof ProfileSchema> & {
  _id: Types.ObjectId;
};
export default mongoose.model("Profile", ProfileSchema);
