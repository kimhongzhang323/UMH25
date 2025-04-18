import pandas as pd
import numpy as np
from datetime import datetime
import os

def load_and_clean_data(filepath='data/DimSumDelight_Full.csv'):
    """Load and clean the raw dataset"""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset not found at {filepath}")
    
    df = pd.read_csv(filepath)
    
    # Remove duplicate columns
    df = df.loc[:, ~df.columns.duplicated()]
    
    # Convert datetime columns
    datetime_cols = ['order_time', 'driver_arrival_time', 'driver_pickup_time', 'delivery_time']
    for col in datetime_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col])
    
    # Basic cleaning
    df = df.dropna(subset=['order_value', 'item_price'])
    df = df[df['order_value'] > 0]
    
    return df

if __name__ == "__main__":
    df = load_and_clean_data()
    print(f"Data loaded with {len(df)} records")
    df.to_parquet('data/processed_data.parquet', index=False)