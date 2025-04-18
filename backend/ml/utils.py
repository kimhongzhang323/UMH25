import joblib
import pandas as pd
import os

def save_artifact(obj, filepath):
    """Save any Python object to disk"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    if filepath.endswith('.pkl'):
        joblib.dump(obj, filepath)
    elif filepath.endswith('.parquet'):
        obj.to_parquet(filepath, index=False)
    print(f"Saved artifact to {filepath}")

def load_artifact(filepath):
    """Load saved Python objects"""
    if filepath.endswith('.pkl'):
        return joblib.load(filepath)
    elif filepath.endswith('.parquet'):
        return pd.read_parquet(filepath)
    raise ValueError("Unsupported file format")