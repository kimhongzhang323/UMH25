import pandas as pd
import numpy as np
from utils import save_artifact

def create_features(df):
    """Create all engineered features"""
    
    # Time features
    df['order_day_of_week'] = df['order_time'].dt.dayofweek
    df['order_hour'] = df['order_time'].dt.hour
    df['order_month'] = df['order_time'].dt.month
    
    # Delivery features
    df['prep_time'] = (df['driver_pickup_time'] - df['order_time']).dt.total_seconds() / 60
    df['delivery_duration'] = (df['delivery_time'] - df['driver_pickup_time']).dt.total_seconds() / 60
    
    # Customer features
    df['item_count'] = df.groupby('order_id')['item_id'].transform('count')
    df['price_per_item'] = df['order_value'] / df['item_count']
    
    # Merchant features
    merchant_stats = df.groupby('merchant_id').agg({
        'order_value': ['mean', 'std'],
        'delivery_duration': 'mean'
    }).reset_index()
    merchant_stats.columns = ['merchant_id', 'merchant_avg_order', 'merchant_order_std', 'merchant_avg_delivery']
    df = pd.merge(df, merchant_stats, on='merchant_id', how='left')
    
    # Time since last order
    df = df.sort_values(['eater_id', 'order_time'])
    df['time_since_last_order'] = df.groupby('eater_id')['order_time'].diff().dt.total_seconds() / 3600
    df['time_since_last_order'].fillna(0, inplace=True)
    
    # Business indicators
    df['is_peak_hour'] = ((df['order_hour'] >= 11) & (df['order_hour'] <= 14)).astype(int)
    df['is_weekend'] = (df['order_day_of_week'] >= 5).astype(int)
    
    return df

def create_item_demand_dataset(df):
    """Create dataset for inventory prediction"""
    item_demand = df.groupby(['item_id', 'item_name', 'cuisine_tag']).agg({
        'order_id': 'count',
        'order_day_of_week': lambda x: x.mode()[0],
        'order_hour': lambda x: x.mode()[0]
    }).reset_index()
    item_demand.rename(columns={'order_id': 'demand_count'}, inplace=True)
    return item_demand

def create_customer_dataset(df):
    """Create dataset for customer segmentation"""
    customer_data = df.groupby('eater_id').agg({
        'order_value': ['sum', 'mean', 'count'],
        'delivery_duration': 'mean',
        'time_since_last_order': 'mean',
        'merchant_id': 'nunique'
    }).reset_index()
    customer_data.columns = ['eater_id', 'total_spent', 'avg_order_value', 
                           'order_count', 'avg_delivery_time', 
                           'avg_time_between_orders', 'unique_merchants']
    return customer_data

if __name__ == "__main__":
    df = pd.read_parquet('data/processed_data.parquet')
    df = create_features(df)
    item_demand = create_item_demand_dataset(df)
    customer_data = create_customer_dataset(df)
    
    save_artifact(df, 'data/feature_engineered_data.parquet')
    save_artifact(item_demand, 'data/item_demand_data.parquet')
    save_artifact(customer_data, 'data/customer_data.parquet')