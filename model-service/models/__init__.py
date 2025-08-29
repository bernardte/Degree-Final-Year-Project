import os
import sys 

# Dynamically add the model-service directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, "../../"))
sys.path.append(root_dir)

from .llm import stream_llm
from .intentModel import predict_intent