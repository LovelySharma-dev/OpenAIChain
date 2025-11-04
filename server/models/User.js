import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  auth0Id: {
    type: String,
    unique: true,
    sparse: true
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  tokenBalance: {
    type: Number,
    default: 1250
  },
  modelsContributed: {
    type: Number,
    default: 0
  },
  totalRewards: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'developer', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", userSchema);
