import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from utils import save_artifact, load_artifact

def train_sales_forecasting_model():
    df = load_artifact('data/feature_engineered_data.parquet')
    
    # Features and target
    features = ['item_price', 'order_day_of_week', 'order_hour', 'order_month',
               'is_peak_hour', 'is_weekend', 'item_count', 'merchant_avg_order',
               'merchant_order_std', 'time_since_last_order']
    target = 'order_value'
    
    # Preprocessing
    numeric_features = ['item_price', 'item_count', 'merchant_avg_order', 
                      'merchant_order_std', 'time_since_last_order']
    categorical_features = ['order_day_of_week', 'order_hour', 'order_month',
                          'is_peak_hour', 'is_weekend']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
    
    # Model pipeline
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', XGBRegressor(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        ))
    ])
    
    # Train-test split
    X = df[features]
    y = df[target]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train and evaluate
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Sales Forecasting MAE: ${mae:.2f}")
    
    save_artifact(model, 'models/sales_forecasting_model.pkl')
    return model

if __name__ == "__main__":
    train_sales_forecasting_model()