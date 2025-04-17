import pandas as pd
from lightgbm import LGBMRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import numpy as np

def train_inventory_model(data_path='data/DimSumDelight_Full.csv'):
    """Train inventory prediction model with proper feature handling"""
    
    # Load the original data to get item prices
    df = pd.read_csv(data_path)
    
    # Create item demand dataset with price information
    item_demand = df.groupby(['item_id', 'item_name', 'cuisine_tag']).agg({
        'order_id': 'count',
        'item_price': 'mean',  # Add average price per item
        'order_time': lambda x: pd.to_datetime(x).dt.dayofweek.mode()[0],
        'order_time': lambda x: pd.to_datetime(x).dt.hour.mode()[0]
    }).reset_index()
    
    # Rename columns for clarity
    item_demand = item_demand.rename(columns={
        'order_id': 'demand_count',
        '<lambda_0>': 'most_common_day',
        '<lambda_1>': 'most_common_hour'
    })
    
    # Features and target
    features = ['cuisine_tag', 'most_common_day', 'most_common_hour', 'item_price']
    target = 'demand_count'
    
    # Check if all features exist
    missing_features = [f for f in features if f not in item_demand.columns]
    if missing_features:
        raise ValueError(f"Missing required features: {missing_features}")
    
    # Preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['item_price']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['cuisine_tag', 'most_common_day', 'most_common_hour'])
        ])
    
    # Model pipeline
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', LGBMRegressor(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=-1,
            num_leaves=31,
            random_state=42
        ))
    ])
    
    # Train-test split
    X = item_demand[features]
    y = item_demand[target]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train and evaluate
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Inventory Prediction MAE: {mae:.2f} items")
    
    # Feature importance
    feature_names = (preprocessor.named_transformers_['cat']
                    .get_feature_names_out(['cuisine_tag', 'day', 'hour']))
    feature_names = np.append(feature_names, 'item_price')
    
    print("\nFeature Importance:")
    for name, importance in zip(feature_names, model.named_steps['regressor'].feature_importances_):
        print(f"{name}: {importance:.2f}")
    
    return model

if __name__ == "__main__":
    try:
        model = train_inventory_model()
        # Save the model if needed
        # import joblib
        # joblib.dump(model, 'inventory_model.pkl')
    except Exception as e:
        print(f"Error training model: {str(e)}")