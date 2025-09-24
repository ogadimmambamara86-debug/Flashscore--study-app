// apps/backend/src/services/predictionService.ts
import { spawn } from "child_process";

// This function calls a Python script (PyTorch model)
export async function predictMatch(homeTeam: string, awayTeam: string) {
  return new Promise((resolve, reject) => {
    const py = spawn("python3", ["./ml/predict.py", homeTeam, awayTeam]);

    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process failed: ${error}`));
      } else {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(new Error("Failed to parse AI response"));
        }
      }
    });
  });
}