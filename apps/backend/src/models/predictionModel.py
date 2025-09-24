# PyTorch ML model for match outcome prediction
import torch
import torch.nn as nn
import torch.optim as optim

class MatchPredictor(nn.Module):
    def __init__(self, input_size: int, hidden_size: int = 32, output_size: int = 3):
        super(MatchPredictor, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return self.softmax(x)

# Utility to load/save model
def save_model(model, path="prediction_model.pth"):
    torch.save(model.state_dict(), path)

def load_model(input_size, path="prediction_model.pth"):
    model = MatchPredictor(input_size)
    model.load_state_dict(torch.load(path))
    model.eval()
    return model