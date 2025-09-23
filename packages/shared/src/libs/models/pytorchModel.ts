import * as path from "path";
import { spawn } from "child_process";

export interface PredictionInput {
  features: number[];
}

export interface PredictionOutput {
  prediction: string;
  confidence: number;
}

export const runPyTorchModel = async (input: PredictionInput): Promise<PredictionOutput> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "predict.py");
    const py = spawn("python3", [scriptPath, JSON.stringify(input.features)]);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) return reject(new Error(errorOutput));
      try {
        resolve(JSON.parse(output));
      } catch (err) {
        reject(err);
      }
    });
  });
};