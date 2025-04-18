from utils import load_artifact
from sklearn.metrics import mean_absolute_error, accuracy_score
import pandas as pd

# def test_inventory_model():
#     # Load model and test data
#     model = load_artifact('models/inventory_model.pkl')
#     test_data = load_artifact('data/item_demand_test.parquet')
    
#     # Features and target
#     features = ['cuisine_tag', 'order_day_of_week', 'order_hour', 'item_price']
#     target = 'demand_count'
    
#     X_test = test_data[features]
#     y_test = test_data[target]
    
#     # Predict and evaluate
#     y_pred = model.predict(X_test)
#     mae = mean_absolute_error(y_test, y_pred)
#     print(f"Inventory Model MAE: {mae:.2f} items")

def test_customer_segmentation():
    # Load model and test data
    model = load_artifact('models/customer_segmentation_model.pkl')
    test_data = load_artifact('data/customer_data.parquet')
    
    # Features
    features = ['total_spent', 'avg_order_value', 'order_count', 
                'avg_delivery_time', 'avg_time_between_orders', 'unique_merchants']
    X_test = test_data[features]
    
    # Predict clusters
    test_data['predicted_cluster'] = model.predict(X_test)
    
    # Analyze clusters
    cluster_stats = test_data.groupby('predicted_cluster')[features].mean()
    print("Customer Segmentation Cluster Statistics:")
    print(cluster_stats)

def test_delivery_time_model():
    # Load model and test data
    model = load_artifact('models/delivery_time_model.pkl')
    test_data = load_artifact('data/delivery_time_test.parquet')
    
    # Features and target
    features = ['distance', 'order_size', 'traffic_conditions', 'weather']
    target = 'delivery_time'
    
    X_test = test_data[features]
    y_test = test_data[target]
    
    # Predict and evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Delivery Time Model MAE: {mae:.2f} minutes")

def test_reorder_model():
    # Load model and test data
    model = load_artifact('models/reorder_model.pkl')
    test_data = load_artifact('data/reorder_test.parquet')
    
    # Features and target
    features = ['customer_id', 'order_count', 'avg_time_between_orders']
    target = 'reorder_probability'
    
    X_test = test_data[features]
    y_test = test_data[target]
    
    # Predict and evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Reorder Model MAE: {mae:.2f}")

def test_sales_forecasting_model():
    # Load model and test data
    model = load_artifact('models/sales_forecasting_model.pkl')
    test_data = load_artifact('data/sales_forecasting_test.parquet')
    
    # Features and target
    features = ['date', 'store_id', 'promotion', 'holiday', 'weather']
    target = 'sales'
    
    X_test = test_data[features]
    y_test = test_data[target]
    
    # Predict and evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Sales Forecasting Model MAE: {mae:.2f} units")

if __name__ == "__main__":
    # print("Testing Inventory Model...")
    # test_inventory_model()
    
    print("\nTesting Customer Segmentation Model...")
    test_customer_segmentation()
    
    print("\nTesting Delivery Time Model...")
    test_delivery_time_model()
    
    print("\nTesting Reorder Model...")
    test_reorder_model()
    
    print("\nTesting Sales Forecasting Model...")
    test_sales_forecasting_model()