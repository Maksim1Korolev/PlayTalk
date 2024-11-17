import mongoose, { ConnectOptions, Document, Model, Schema } from "mongoose";

const connect = jest.fn().mockResolvedValue(() => Promise.resolve());
const disconnect = jest.fn().mockResolvedValue(() => Promise.resolve());

const model = jest.fn(() => ({
  create: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
})) as unknown as <T extends Document>(
  name: string,
  schema?: Schema<T>
) => Model<T>;

mongoose.connect = connect as unknown as (
  uri: string,
  options?: ConnectOptions
) => Promise<typeof mongoose>;
mongoose.disconnect = disconnect;
mongoose.model = model;

mongoose.Types.ObjectId = Object.assign(mongoose.Types.ObjectId, {
  isValid: jest.fn().mockImplementation((id: string) => {
    return typeof id === "string" && id.length === 24;
  }),
});

export default mongoose;
