const mongoose = {
  connect: jest.fn(() => Promise.resolve()),
  disconnect: jest.fn(() => Promise.resolve()),
  Schema: function () {
    return {};
  },
  model: jest.fn(() => ({})),
};

export default mongoose;
