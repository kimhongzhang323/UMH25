import pandas as pd
from datetime import datetime

def generate_all_monthly_leaderboards(transaction_file, merchant_file):
    # Load data
    transactions = pd.read_csv(transaction_file)
    merchants = pd.read_csv(merchant_file)
    
    # Convert and extract month
    transactions['order_time'] = pd.to_datetime(transactions['order_time'], dayfirst=True, errors='coerce')
    transactions = transactions.dropna(subset=['order_time'])
    transactions['month'] = transactions['order_time'].dt.to_period('M')
    
    # Get all unique months sorted
    all_months = sorted(transactions['month'].unique(), reverse=True)
    
    for month_period in all_months:
        # Filter for current month
        month_trans = transactions[transactions['month'] == month_period]
        
        # Calculate metrics
        monthly_sales = month_trans.groupby('merchant_id').agg(
            total_sales=('order_value', 'sum'),
            order_count=('order_id', 'count')
        ).reset_index()
        
        # Merge with merchant data
        leaderboard = pd.merge(
            monthly_sales,
            merchants[['merchant_id', 'merchant_name', 'city_id']],
            on='merchant_id',
            how='left'
        )
        
        # Add ranking and month info
        leaderboard = leaderboard.sort_values('total_sales', ascending=False)
        leaderboard['rank'] = leaderboard['total_sales'].rank(ascending=False, method='min').astype(int)
        month_str = month_period.strftime('%B %Y')
        leaderboard.insert(0, 'month', month_str)  # Add month as first column
        
        # Save to CSV
        filename = f"monthly_leaderboard_{month_period.strftime('%Y-%m')}.csv"
        leaderboard.to_csv(filename, index=False)
        
        print(f"Generated leaderboard for {month_str} ({len(leaderboard)} merchants)")

    print(f"\nCompleted! Generated {len(all_months)} monthly leaderboards.")

# Run the function
if __name__ == "__main__":
    generate_all_monthly_leaderboards('data/transaction_data.csv', 'data/merchant.csv')