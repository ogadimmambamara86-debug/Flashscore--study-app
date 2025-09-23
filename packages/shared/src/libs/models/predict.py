import sys
import json
import torch
import torch.nn as nn

# Example: simple feedforward model
class SimpleModel(nn.Module):
    def __init__(self, input_size, output_size):
        super(SimpleModel, self).__init__()
        self.fc1 = nn.Linear(input_size, 64)
        self.fc2 = nn.Linear(64, output_size)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return self.softmax(x)

# Load input from Node
features = json.loads(sys.argv[1])
input_tensor = torch.tensor([features], dtype=torch.float32)

# Load pretrained weights
model = SimpleModel(len(features), 3)  # Example: 3 classes
model.load_state_dict(torch.load("model.pth"))
model.eval()

with torch.no_grad():
    preds = model(input_tensor)
    confidence, class_idx = torch.max(preds, 1)
    class_map = ["Win", "Draw", "Lose"]

result = {"prediction": class_map[class_idx.item()], "confidence": float(confidence.item())}
print(json.dumps(result))