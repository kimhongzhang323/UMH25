import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from utils import load_artifact, save_artifact
import os

def perform_customer_segmentation():
    customer_data = load_artifact('data/customer_data.parquet')
    
    # Prepare data
    features = ['total_spent', 'avg_order_value', 'order_count', 
               'avg_delivery_time', 'avg_time_between_orders', 'unique_merchants']
    X = customer_data[features]
    
    # Scale data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Determine optimal clusters
    inertias = []
    for k in range(1, 11):
        kmeans = KMeans(n_clusters=k, random_state=42)
        kmeans.fit(X_scaled)
        inertias.append(kmeans.inertia_)
    
    # Ensure the 'reports' directory exists
    os.makedirs('reports', exist_ok=True)
    
    # Plot elbow curve
    plt.figure(figsize=(8, 5))
    plt.plot(range(1, 11), inertias, marker='o')
    plt.title('Elbow Method for Optimal k')
    plt.xlabel('Number of clusters')
    plt.ylabel('Inertia')
    plt.savefig('reports/elbow_plot.png')
    plt.close()
    
    # Fit with optimal k (4 based on elbow)
    kmeans = KMeans(n_clusters=4, random_state=42)
    customer_data['cluster'] = kmeans.fit_predict(X_scaled)
    
    # Save results
    save_artifact(customer_data, 'data/customer_segments.parquet')
    save_artifact(kmeans, 'models/customer_segmentation_model.pkl')
    
    # Analyze clusters
    cluster_stats = customer_data.groupby('cluster')[features].mean()
    print("Cluster Statistics:")
    print(cluster_stats)
    
    return customer_data

if __name__ == "__main__":
    perform_customer_segmentation()