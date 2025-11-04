import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model'
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['training', 'contribution', 'governance', 'bonus'],
    default: 'training'
  },
  accuracyImprovement: {
    type: Number,
    default: 0
  },
  previousAccuracy: Number,
  newAccuracy: Number,
  description: String,
  transactionHash: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Reward", rewardSchema);
