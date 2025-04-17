import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.pipeline import Pipeline
from utils import load_artifact, save_artifact

def train_delivery_time_model():
    df = load_artifact('data/feature_engineered_data.parquet')
    
    # Features and target
    features = ['item_price', 'order_hour', 'order_day_of_week', 
               'merchant_avg_delivery', 'is_peak_hour', 'item_count']
    target = 'delivery_duration'
    
    # Model pipeline
    model = Pipeline([
        ('regressor', HistGradientBoostingRegressor(
            max_iter=200,
            learning_rate=0.05,
            max_depth=None,
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
    print(f"Delivery Time MAE: {mae:.2f} minutes")
    
    save_artifact(model, 'models/delivery_time_model.pkl')
    return model

if __name__ == "__main__":
    train_delivery_time_model()