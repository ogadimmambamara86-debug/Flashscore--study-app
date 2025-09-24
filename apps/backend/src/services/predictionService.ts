import { exec } from "child_process";
import path from "path";

const MODEL_SCRIPT = path.resolve(__dirname, "../models/predictionModel.py");

/**
 * Run Python prediction script
 * @param features array of numbers representing match features
 */
export const runPrediction = (features: number[]): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const pyCommand = `python3 ${MODEL_SCRIPT} ${features.join(",")}`;
    exec(pyCommand, (error, stdout, stderr) => {
      if (error) return reject(error);
      try {
        const result = JSON.parse(stdout); // model returns JSON array of probabilities
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
};