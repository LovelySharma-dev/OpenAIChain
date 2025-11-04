import express from "express";
import { trainModel, federatedTrain } from "../ai/trainTensor.js";
import Model from "../models/Model.js";
import { optionalAuth } from "../utils/authMiddleware.js";

const router = express.Router();

// POST /api/train - Train a model using TensorFlow.js
router.post("/train", optionalAuth, async (req, res) => {
  try {
    const { modelName, epochs = 10, federated = false, nodes = 3 } = req.body;

    console.log(`🧠 Training request for model: ${modelName || 'default'}`);

    let trainingResult;

    if (federated) {
      // Federated learning across multiple nodes
      trainingResult = await federatedTrain(nodes);
    } else {
      // Standard centralized training
      trainingResult = await trainModel({ epochs });
    }

    // Update model in database if it exists
    if (modelName) {
      try {
        const model = await Model.findOne({ name: modelName });
        if (model) {
          model.accuracy = trainingResult.accuracy || trainingResult.federatedAccuracy;
          model.trainingSessions += 1;
          model.lastTrainedAt = new Date();
          await model.save();
          console.log(`📝 Updated model ${modelName} in database`);
        }
      } catch (dbError) {
        console.log("⚠️  Database update skipped:", dbError.message);
      }
    }

    res.json({
      success: true,
      message: "Training completed successfully",
      data: trainingResult,
      modelName: modelName || 'default',
      federated
    });

  } catch (error) {
    console.error("❌ Training error:", error.message);
    res.status(500).json({
      success: false,
      message: "Training failed",
      error: error.message
    });
  }
});

// GET /api/train/status - Get training status
router.get("/train/status", (req, res) => {
  res.json({
    success: true,
    status: "ready",
    availableModels: [
      "text-generation",
      "sentiment-analysis",
      "image-classification"
    ],
    supportsFederated: true
  });
});

export default router;
