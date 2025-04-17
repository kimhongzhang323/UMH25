import pandas as pd

# # Load all data
# transactions_df = pd.read_csv('data/transaction_data.csv')
# items_df = pd.read_csv('data/items.csv')
# merchants_df = pd.read_csv('data/merchant.csv')
# transaction_items_df = pd.read_csv('data/transaction_items.csv')

# # Filter for merchant_id == '0e1f9'
# merchant_id_filter = '0e1f9'
# transaction_items_filtered = transaction_items_df[transaction_items_df['merchant_id'] == merchant_id_filter]

# # Merge with items to get item details
# items_merged = pd.merge(transaction_items_filtered, items_df, on=['item_id', 'merchant_id'])

# # Merge with transactions to get order details
# order_merged = pd.merge(items_merged, transactions_df, on=['order_id', 'merchant_id'])

# # Merge with merchants to get merchant info
# final_merged = pd.merge(order_merged, merchants_df, on='merchant_id')

# # Final column order
# columns_order = [
#     'merchant_id', 'merchant_name', 'join_date', 'city_id',
#     'item_id', 'cuisine_tag', 'item_name', 'item_price',
#     'order_id', 'order_time', 'driver_arrival_time', 'driver_pickup_time',
#     'delivery_time', 'order_value', 'eater_id'
# ]

# # Reorder and save
# final_df = final_merged[columns_order]
# final_df.to_csv('data/DimSumDelight_Full.csv', index=False)

