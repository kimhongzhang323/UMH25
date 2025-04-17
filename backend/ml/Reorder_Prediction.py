import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from utils import load_artifact, save_artifact

def train_reorder_model():
    df = load_artifact('data/feature_engineered_data.parquet')
    
    # Create target variable
    df = df.sort_values(['eater_id', 'order_time'])
    df['next_order_time'] = df.groupby('eater_id')['order_time'].shift(-1)
    df['days_to_next_order'] = (df['next_order_time'] - df['order_time']).dt.days
    df['reorder'] = (df['days_to_next_order'] <= 7).astype(int)
    df['reorder'].fillna(0, inplace=True)
    
    # Features and target
    features = ['item_price', 'order_day_of_week', 'order_hour', 
               'time_since_last_order', 'merchant_avg_order', 'is_weekend']
    target = 'reorder'
    
    # Model pipeline
    model = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(
            n_estimators=200,
            class_weight='balanced',
            random_state=42
        ))
    ])
    
    # Train-test split
    X = df[features]
    y = df[target]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Train and evaluate
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    print(f"AUC-ROC: {roc_auc_score(y_test, y_proba):.4f}")
    
    save_artifact(model, 'models/reorder_model.pkl')
    return model

if __name__ == "__main__":
    train_reorder_model()