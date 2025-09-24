// CEO: Decides what is important and what should happen
export interface Prediction {
  match: string;
  prediction: string;
  confidence: number;
}

export type CEOAction =
  | { type: "ALERT"; message: string; level: "info" | "success" | "warning" | "danger" }
  | { type: "HIGHLIGHT"; match: string }
  | { type: "IGNORE" };

export function magajicoCEO(predictions: Prediction[]): CEOAction[] {
  const actions: CEOAction[] = [];

  predictions.forEach((p) => {
    if (p.confidence > 80) {
      actions.push({
        type: "ALERT",
        message: `🔥 Hot Match Alert: ${p.match} - ${p.prediction} (${p.confidence}%)`,
        level: "success",
      });
      actions.push({ type: "HIGHLIGHT", match: p.match });
    } else if (p.confidence < 40) {
      actions.push({
        type: "ALERT",
        message: `⚠️ Risky Prediction: ${p.match}`,
        level: "warning",
      });
    } else {
      actions.push({ type: "IGNORE" });
    }
  });

  return actions;
}