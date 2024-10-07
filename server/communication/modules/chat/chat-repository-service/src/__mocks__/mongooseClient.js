import mongoose from "mongoose";

const connect = jest.fn().mockResolvedValue(() => Promise.resolve());
const disconnect = jest.fn().mockResolvedValue(() => Promise.resolve());
const model = jest.fn(() => ({
  create: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

mongoose.connect = connect;
mongoose.disconnect = disconnect;
mongoose.model = model;

mongoose.Types = {
  ObjectId: {
    isValid: jest.fn().mockImplementation(id => {
      return typeof id === "string" && id.length === 24;
    }),
  },
};

export default mongoose;