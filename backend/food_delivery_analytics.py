import pandas as pd
import matplotlib.pyplot as plt
from itertools import combinations
import os

# Create the reports folder if it doesn't exist
if not os.path.exists('reports'):
    os.makedirs('reports')

# 1. Best-Selling Items Analysis
def best_selling_items(df):
    """What are my best-selling items?"""
    top_items = df.groupby('item_name')['order_value'].sum().nlargest(5).reset_index()
    insight = f"{df.groupby('item_name')['order_value'].sum().idxmax()} is the top seller with ${df.groupby('item_name')['order_value'].sum().max():,.2f} revenue"
    return top_items, insight

# 2. Delivery Time Distribution
def delivery_time_distribution(df):
    """Show me delivery time distribution"""
    df['delivery_duration'] = (pd.to_datetime(df['delivery_time']) - pd.to_datetime(df['order_time'])).dt.total_seconds() / 60
    plt.hist(df['delivery_duration'], bins=20, color='#00B14F')
    plt.title('Delivery Time Distribution')
    plt.xlabel('Minutes')
    plt.ylabel('Order Count')
    insight = f"Average delivery time: {df['delivery_duration'].mean():.1f} minutes"
    
    # Save the plot
    plt.savefig('reports/delivery_time_distribution.png')
    plt.close()  # Close the plot to free memory
    return insight

# 3. Monthly Sales Growth
def monthly_sales_growth(df):
    """What's my monthly sales growth?"""
    monthly_sales = df.set_index(pd.to_datetime(df['order_time'])).resample('M')['order_value'].sum()
    monthly_sales.plot(kind='line', marker='o', figsize=(10, 5), color='#00B14F')
    plt.title('Monthly Sales Trend')
    plt.ylabel('Total Sales ($)')
    insight = f"Peak month: {monthly_sales.idxmax().strftime('%B %Y')} (${monthly_sales.max():,.2f})"
    
    # Save the plot
    plt.savefig('reports/monthly_sales_growth.png')
    plt.close()  # Close the plot to free memory
    return insight

# 4. Order Frequency by Hour
def orders_by_hour(df):
    """Which hours have the most orders?"""
    df['order_hour'] = pd.to_datetime(df['order_time']).dt.hour
    hourly_orders = df['order_hour'].value_counts().sort_index()
    hourly_orders.plot(kind='bar', color='#00B14F', figsize=(10,5))
    plt.title('Orders by Hour of Day')
    plt.xlabel('Hour')
    plt.ylabel('Number of Orders')
    insight = f"Busiest hour: {hourly_orders.idxmax()}:00 ({hourly_orders.max()} orders)"
    plt.show()
    return insight

# 5. Average Order Value
def average_order_value(df):
    """What's the average order value?"""
    aov = df['order_value'].mean()
    median_ov = df['order_value'].median()
    insight = f"Average order value: ${aov:.2f} | Median: ${median_ov:.2f}"
    return insight

# 6. City-Wise Performance
def city_performance(df):
    """Show me city-wise performance"""
    city_sales = df.groupby('city_id')['order_value'].sum()
    city_sales.plot(kind='pie', autopct='%1.1f%%', figsize=(8,8))
    plt.ylabel('')
    insight = f"Top city: {city_sales.idxmax()} ({city_sales.max()/city_sales.sum():.1%} of total sales)"
    plt.show()
    return insight

# 7. Repeat Customer Rate
def repeat_customer_rate(df):
    """What's my repeat customer rate?"""
    repeat_rate = df.groupby('eater_id')['order_id'].nunique().gt(1).mean()
    insight = f"{repeat_rate:.1%} of customers ordered more than once"
    return insight

# 8. Item Price Distribution
def item_price_distribution(df):
    """Show me item price distribution"""
    df['item_price'].plot(kind='box', vert=False, figsize=(8,4), color='#00B14F')
    plt.title('Item Price Distribution')
    plt.xlabel('Price ($)')
    insight = f"Average price: ${df['item_price'].mean():.2f} | Most common price: ${df['item_price'].mode()[0]}"
    plt.show()
    return insight

# 9. Busiest Day of Week
def busiest_day(df):
    """What's my busiest day of week?"""
    df['weekday'] = pd.to_datetime(df['order_time']).dt.day_name()
    daily_orders = df['weekday'].value_counts()
    daily_orders.plot(kind='bar', color='#00B14F')
    plt.title('Orders by Weekday')
    insight = f"Busiest day: {daily_orders.idxmax()} ({daily_orders.max()} orders)"
    plt.show()
    return insight

# 10. Order Value Distribution
def order_value_distribution(df):
    """Show me order value distribution"""
    bins = [0, 20, 50, 100, 500, 1000, 2000]
    df['order_value'].plot(kind='hist', bins=bins, color='#00B14F')
    plt.title('Order Value Distribution')
    plt.xlabel('Order Value ($)')
    insight = f"{len(df[df['order_value'] > 500])} large orders (>$500)"
    plt.show()
    return insight

# 11. Average Preparation Time
def prep_time_analysis(df):
    """What's the average preparation time?"""
    df['prep_time'] = (pd.to_datetime(df['driver_pickup_time']) - pd.to_datetime(df['order_time'])).dt.total_seconds()/60
    insight = f"Average prep time: {df['prep_time'].mean():.1f} minutes"
    return insight

# 12. Customer Acquisition Trend
def customer_acquisition(df):
    """Show me customer acquisition trend"""
    df['order_month'] = pd.to_datetime(df['order_time']).dt.to_period('M')
    new_customers = df.groupby('order_month')['eater_id'].nunique()
    new_customers.plot(kind='line', marker='o', color='#00B14F')
    insight = f"Peak acquisition: {new_customers.idxmax().strftime('%b %Y')} ({new_customers.max()} new customers)"
    plt.show()
    return insight

# 13. Sales per Cuisine Type
def cuisine_performance(df):
    """What's my sales per cuisine type?"""
    cuisine_sales = df.groupby('cuisine_tag')['order_value'].sum().sort_values(ascending=False).reset_index()
    insight = f"{df.groupby('cuisine_tag')['order_value'].sum().idxmax()} accounts for {df.groupby('cuisine_tag')['order_value'].sum().max()/df['order_value'].sum():.1%} of total sales"
    return cuisine_sales, insight

# 14. Delivery Time vs Order Value
def delivery_vs_order_value(df):
    """Show me delivery time vs order value"""
    df.plot.scatter(x='delivery_duration', y='order_value', alpha=0.5, color='#00B14F')
    plt.title('Delivery Time vs Order Value')
    plt.xlabel('Delivery Minutes')
    plt.ylabel('Order Value ($)')
    insight = f"Correlation: {df[['delivery_duration','order_value']].corr().iloc[0,1]:.2f}"
    plt.show()
    return insight

# 15. Inventory Turnover Rate
def inventory_turnover(df):
    """What's my inventory turnover rate?"""
    turnover = df.groupby('item_name')['order_id'].count().sort_values(ascending=False).reset_index()
    insight = f"Most ordered item: {turnover.iloc[0]['item_name']} ({turnover.iloc[0]['order_id']} times)"
    return turnover, insight

# 16. Customer Age Distribution
def age_distribution(df):
    """What's my customer age distribution?"""
    df['age_group'] = pd.cut(df['customer_age'], bins=[0,18,25,35,50,65,100], labels=['<18','18-25','26-35','36-50','51-65','65+'])
    df['age_group'].value_counts().plot(kind='bar', color='#00B14F')
    plt.title('Customer Age Distribution')
    plt.xlabel('Age Group')
    plt.ylabel('Number of Customers')
    insight = f"Most common age group: {df['age_group'].mode()[0]}"
    plt.show()
    return insight

# 17. Seasonal Sales Patterns
def seasonal_sales(df):
    """Show me seasonal sales patterns"""
    df['season'] = pd.to_datetime(df['order_time']).dt.month.map({12:'Winter',1:'Winter',2:'Winter',3:'Spring',4:'Spring',5:'Spring',6:'Summer',7:'Summer',8:'Summer',9:'Fall',10:'Fall',11:'Fall'})
    seasonal_sales = df.groupby('season')['order_value'].sum()
    seasonal_sales.plot(kind='bar', color='#00B14F')
    plt.title('Sales by Season')
    insight = f"Peak season: {seasonal_sales.idxmax()} (${seasonal_sales.max():,.2f})"
    plt.show()
    return insight

# 18. Profit Margin by Item
def profit_margin(df):
    """What's my profit margin by item?"""
    df['profit_margin'] = (df['item_price'] - df['item_cost']) / df['item_price'] * 100
    item_margins = df.groupby('item_name')[['profit_margin']].mean().sort_values('profit_margin', ascending=False).reset_index()
    insight = f"Most profitable item: {item_margins.iloc[0]['item_name']} ({item_margins.iloc[0]['profit_margin']:.1f}% margin)"
    return item_margins, insight

# 19. Order Cancellation Rate
def cancellation_analysis(df):
    """What's my order cancellation rate?"""
    cancellation_rate = len(df[df['order_status']=='cancelled'])/len(df)
    cancellation_reasons = df[df['order_status']=='cancelled']['cancellation_reason'].value_counts()
    insight = f"Cancellation rate: {cancellation_rate:.1%}, Main reason: {cancellation_reasons.index[0]}"
    return insight

# 20. Customer Spending Patterns
def customer_spending(df):
    """Show me customer spending patterns"""
    customer_spending = df.groupby('eater_id')['order_value'].sum().reset_index()
    plt.hist(customer_spending['order_value'], bins=30, color='#00B14F')
    plt.title('Customer Lifetime Value Distribution')
    plt.xlabel('Total Spending ($)')
    plt.ylabel('Number of Customers')
    insight = f"Average customer lifetime value: ${customer_spending['order_value'].mean():,.2f}"
    plt.show()
    return insight

# 21. Average Rating Over Time
def rating_trend(df):
    """What's my average rating over time?"""
    monthly_ratings = df.set_index(pd.to_datetime(df['order_time'])).resample('M')['rating'].mean()
    monthly_ratings.plot(kind='line', marker='o', color='#00B14F')
    plt.title('Average Monthly Ratings')
    plt.ylabel('Rating (1-5)')
    insight = f"Overall rating: {df['rating'].mean():.1f}/5.0"
    plt.show()
    return insight

# 22. Payment Method Preferences
def payment_methods(df):
    """What payment methods do customers prefer?"""
    payment_dist = df['payment_method'].value_counts()
    payment_dist.plot(kind='pie', autopct='%1.1f%%')
    plt.title('Payment Method Distribution')
    insight = f"Most popular: {payment_dist.index[0]} ({payment_dist.iloc[0]/len(df):.1%})"
    plt.show()
    return insight

# 23. New vs Returning Customers
def customer_retention(df):
    """How many new vs returning customers per month?"""
    df['customer_type'] = df.groupby('eater_id').cumcount().map(lambda x: 'New' if x==0 else 'Returning')
    monthly_breakdown = df.pivot_table(index=pd.to_datetime(df['order_time']).dt.to_period('M'), columns='customer_type', values='order_id', aggfunc='count')
    monthly_breakdown.plot(kind='bar', stacked=True)
    insight = f"Retention rate: {len(df[df['customer_type']=='Returning'])/len(df[df['customer_type']=='New']):.1%}"
    plt.show()
    return insight

# 24. Order Processing Time by Day
def processing_time_by_day(df):
    """What's my average order processing time by day of week?"""
    df['processing_time'] = (pd.to_datetime(df['ready_time']) - pd.to_datetime(df['order_time'])).dt.total_seconds()/60
    processing_by_day = df.groupby('weekday')['processing_time'].mean().reindex(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'])
    processing_by_day.plot(kind='bar')
    plt.title('Average Processing Time by Day')
    plt.ylabel('Minutes')
    insight = f"Slowest day: {processing_by_day.idxmax()} ({processing_by_day.max():.1f} min)"
    plt.show()
    return insight

# 25. Frequently Ordered Together
def item_combinations(df):
    """What items are often ordered together?"""
    order_items = df.groupby('order_id')['item_name'].agg(list)
    item_pairs = [tuple(sorted(combo)) for items in order_items for combo in combinations(items, 2)]
    pair_counts = pd.Series(item_pairs).value_counts().head(10)
    insight = f"Most common pair: {pair_counts.index[0][0]} & {pair_counts.index[0][1]} ({pair_counts.iloc[0]} times)"
    return pair_counts, insight

# 26. Driver Wait Time
def driver_wait_time(df):
    """What's my average driver wait time at restaurant?"""
    df['driver_wait'] = (pd.to_datetime(df['driver_pickup_time']) - pd.to_datetime(df['driver_arrival_time'])).dt.total_seconds()/60
    wait_by_hour = df.groupby(pd.to_datetime(df['order_time']).dt.hour)['driver_wait'].mean()
    insight = f"Average wait time: {df['driver_wait'].mean():.1f} minutes"
    return insight

# 27. High-Value Order Patterns
def high_value_orders(df):
    """Show me order patterns for high-value orders"""
    high_value = df[df['order_value'] > df['order_value'].quantile(0.9)]
    high_value_hours = high_value.groupby(pd.to_datetime(high_value['order_time']).dt.hour)['order_id'].count()
    plt.figure(figsize=(10,5))
    high_value_hours.plot(kind='bar', color='#00B14F')
    plt.title('High-Value Orders by Hour')
    plt.xlabel('Hour of Day')
    plt.ylabel('Number of Orders')
    insight = f"Peak hour for high-value orders: {high_value_hours.idxmax()}:00"
    plt.show()
    return insight

# 28. Order Completion Time Trend
def completion_time_trend(df):
    """What's my order completion time trend?"""
    df['completion_time'] = (pd.to_datetime(df['delivery_time']) - pd.to_datetime(df['order_time'])).dt.total_seconds()/60
    monthly_completion = df.groupby(pd.to_datetime(df['order_time']).dt.to_period('M'))['completion_time'].mean()
    plt.figure(figsize=(12,6))
    monthly_completion.plot(kind='line', marker='o', color='#00B14F')
    plt.title('Average Order Completion Time by Month')
    plt.ylabel('Minutes')
    insight = f"Current average completion time: {df['completion_time'].mean():.1f} minutes"
    plt.show()
    return insight

# 29. Customer Reorder Frequency
def reorder_frequency(df):
    """Show me customer reorder frequency"""
    reorder_freq = df.groupby('eater_id')['order_id'].count().value_counts().sort_index()
    reorder_dist = pd.DataFrame({'orders': reorder_freq.index, 'customers': reorder_freq.values})
    insight = f"Average orders per customer: {df.groupby('eater_id')['order_id'].count().mean():.1f}"
    return reorder_dist, insight

# 30. Time Between Orders
def time_between_orders(df):
    """What's my average time between orders for repeat customers?"""
    repeat_customers = df.groupby('eater_id').filter(lambda x: len(x) > 1)
    repeat_customers = repeat_customers.sort_values('order_time')
    repeat_customers['time_between_orders'] = repeat_customers.groupby('eater_id')['order_time'].diff().dt.total_seconds()/(60*60*24)
    insight = f"Average days between orders: {repeat_customers['time_between_orders'].mean():.1f}"
    return insight

# 31. Order Value Impact on Delivery Time
def value_delivery_impact(df):
    """Show me the impact of order value on delivery time"""
    value_bins = pd.qcut(df['order_value'], 5)
    delivery_by_value = df.groupby(value_bins)['delivery_duration'].mean()
    plt.figure(figsize=(10,6))
    delivery_by_value.plot(kind='bar', color='#00B14F')
    plt.title('Delivery Duration by Order Value Quintile')
    plt.xlabel('Order Value Range')
    plt.ylabel('Average Delivery Time (Minutes)')
    insight = f"Correlation between order value and delivery time: {df['order_value'].corr(df['delivery_duration']):.2f}"
    plt.show()
    return insight

# 32. Kitchen Efficiency by Time
def kitchen_efficiency(df):
    """What's my kitchen efficiency by time of day?"""
    df['prep_efficiency'] = (pd.to_datetime(df['driver_pickup_time']) - pd.to_datetime(df['order_time'])).dt.total_seconds()/60
    hourly_efficiency = df.groupby(pd.to_datetime(df['order_time']).dt.hour)['prep_efficiency'].mean()
    plt.figure(figsize=(12,6))
    hourly_efficiency.plot(kind='line', marker='o', color='#00B14F')
    plt.title('Kitchen Preparation Time by Hour')
    plt.xlabel('Hour of Day')
    plt.ylabel('Average Preparation Time (Minutes)')
    insight = f"Most efficient hour: {hourly_efficiency.idxmin()}:00 ({hourly_efficiency.min():.1f} min)"
    plt.show()
    return insight

# 33. Multi-Item Order Patterns
def multi_item_orders(df):
    """Show me multiple item order patterns"""
    order_sizes = df.groupby('order_id')['item_id'].count()
    size_dist = order_sizes.value_counts().sort_index()
    plt.figure(figsize=(8,6))
    size_dist.plot(kind='bar', color='#00B14F')
    plt.title('Distribution of Items per Order')
    plt.xlabel('Number of Items')
    plt.ylabel('Number of Orders')
    insight = f"Most common order size: {order_sizes.mode()[0]} items"
    plt.show()
    return insight

# 34. Delivery Radius Performance
def delivery_radius(df):
    """What's my average delivery radius performance?"""
    delivery_ranges = pd.qcut(df['delivery_duration'], 4, labels=['Short', 'Medium', 'Long', 'Very Long'])
    range_stats = df.groupby(delivery_ranges)['order_value'].agg(['mean', 'count'])
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15,6))
    range_stats['mean'].plot(kind='bar', ax=ax1, color='#00B14F', title='Average Order Value by Delivery Time')
    range_stats['count'].plot(kind='bar', ax=ax2, color='#00B14F', title='Number of Orders by Delivery Time')
    insight = f"Most deliveries fall in the {range_stats['count'].idxmax()} range"
    plt.show()
    return insight

# 35. Promotion Impact on Sales
def promotion_impact(df):
    """Show me the impact of promotions on sales"""
    promo_sales = df[df['promo_applied'] == True].groupby('promo_code')['order_value'].sum()
    promo_sales.plot(kind='bar', color='#00B14F')
    plt.title('Sales by Promotion Code')
    plt.xlabel('Promotion Code')
    plt.ylabel('Total Sales ($)')
    insight = f"Most effective promo: {promo_sales.idxmax()} (${promo_sales.max():,.2f})"
    plt.show()
    return insight

# 36. Order Size by Customer Segment
def segment_order_size(df):
    """What's my average order size by customer segment?"""
    segment_order_size = df.groupby('customer_segment')['order_id'].count() / df['customer_segment'].value_counts()
    segment_order_size.plot(kind='bar', color='#00B14F')
    plt.title('Average Order Size by Customer Segment')
    plt.xlabel('Customer Segment')
    plt.ylabel('Average Order Size')
    insight = f"Largest average order size: {segment_order_size.idxmax()} ({segment_order_size.max():.1f})"
    plt.show()
    return insight

# 37. Weather Impact on Delivery
def weather_impact(df):
    """Show me the impact of weather on delivery time"""
    weather_effect = df.groupby('weather_condition')['delivery_duration'].mean()
    weather_effect.plot(kind='bar', color='#00B14F')
    plt.title('Average Delivery Time by Weather Condition')
    plt.xlabel('Weather Condition')
    plt.ylabel('Average Delivery Time (Minutes)')
    insight = f"Worst weather condition: {weather_effect.idxmax()} ({weather_effect.max():.1f} min)"
    plt.show()
    return insight

# 38. Order Size by City
def city_order_size(df):
    """What's my average order size by city?"""
    city_order_size = df.groupby('city_id')['order_id'].count() / df['city_id'].value_counts()
    city_order_size.plot(kind='bar', color='#00B14F')
    plt.title('Average Order Size by City')
    plt.xlabel('City ID')
    plt.ylabel('Average Order Size')
    insight = f"Largest average order size: {city_order_size.idxmax()} ({city_order_size.max():.1f})"
    plt.show()
    return insight

# 39. Order Size Impact on Delivery
def order_size_delivery(df):
    """Show me the impact of order size on delivery time"""
    order_size_bins = pd.qcut(df['item_count'], 5)
    delivery_by_size = df.groupby(order_size_bins)['delivery_duration'].mean()
    plt.figure(figsize=(10,6))
    delivery_by_size.plot(kind='bar', color='#00B14F')
    plt.title('Delivery Duration by Order Size Quintile')
    plt.xlabel('Order Size Range')
    plt.ylabel('Average Delivery Time (Minutes)')
    insight = f"Correlation between order size and delivery time: {df['item_count'].corr(df['delivery_duration']):.2f}"
    plt.show()
    return insight

# 40. Order Value by Customer Segment
def segment_order_value(df):
    """What's my average order value by customer segment?"""
    segment_order_value = df.groupby('customer_segment')['order_value'].mean()
    segment_order_value.plot(kind='bar', color='#00B14F')
    plt.title('Average Order Value by Customer Segment')
    plt.xlabel('Customer Segment')
    plt.ylabel('Average Order Value ($)')
    insight = f"Highest average order value: {segment_order_value.idxmax()} (${segment_order_value.max():,.2f})"
    plt.show()
    return insight

# 41. Order Time Impact on Delivery
def order_time_delivery(df):
    """Show me the impact of order time on delivery time"""
    order_time_bins = pd.cut(pd.to_datetime(df['order_time']).dt.hour, bins=24)
    delivery_by_time = df.groupby(order_time_bins)['delivery_duration'].mean()
    plt.figure(figsize=(10,6))
    delivery_by_time.plot(kind='bar', color='#00B14F')
    plt.title('Delivery Duration by Order Time')
    plt.xlabel('Order Time (Hour)')
    plt.ylabel('Average Delivery Time (Minutes)')
    insight = f"Peak delivery time: {delivery_by_time.idxmax()} ({delivery_by_time.max():.1f} min)"
    plt.show()
    return insight

# 42. Order Value by Payment Method
def payment_order_value(df):
    """What's my average order value by payment method?"""
    payment_order_value = df.groupby('payment_method')['order_value'].mean()
    payment_order_value.plot(kind='bar', color='#00B14F')
    plt.title('Average Order Value by Payment Method')
    plt.xlabel('Payment Method')
    plt.ylabel('Average Order Value ($)')
    insight = f"Highest average order value: {payment_order_value.idxmax()} (${payment_order_value.max():,.2f})"
    plt.show()
    return insight

# 43. Order Time Impact on Order Value
def order_time_value(df):
    """Show me the impact of order time on order value"""
    order_time_bins = pd.cut(pd.to_datetime(df['order_time']).dt.hour, bins=24)
    value_by_time = df.groupby(order_time_bins)['order_value'].mean()
    plt.figure(figsize=(10,6))
    value_by_time.plot(kind='bar', color='#00B14F')
    plt.title('Average Order Value by Order Time')
    plt.xlabel('Order Time (Hour)')
    plt.ylabel('Average Order Value ($)')
    insight = f"Peak order value time: {value_by_time.idxmax()} (${value_by_time.max():,.2f})"
    plt.show()
    return insight

# 44. Order Value by Delivery Distance
def distance_order_value(df):
    """What's my average order value by delivery distance?"""
    distance_bins = pd.qcut(df['delivery_distance'], 5)
    value_by_distance = df.groupby(distance_bins)['order_value'].mean()
    plt.figure(figsize=(10,6))
    value_by_distance.plot(kind='bar', color='#00B14F')
    plt.title('Average Order Value by Delivery Distance Quintile')
    plt.xlabel('Delivery Distance Range')
    plt.ylabel('Average Order Value ($)')
    insight = f"Correlation between delivery distance and order value: {df['delivery_distance'].corr(df['order_value']):.2f}"
    plt.show()
    return insight

# Main function to run all analyses
def run_all_analyses(df):
    """Run all analysis functions and return results, skipping failed visualizations."""
    results = {}
    failed_visualizations = []  # To track failed visualizations

    # Table analyses
    try:
        results['best_selling_items'] = best_selling_items(df)
    except Exception as e:
        failed_visualizations.append(1)

    try:
        results['cuisine_performance'] = cuisine_performance(df)
    except Exception as e:
        failed_visualizations.append(2)

    try:
        results['inventory_turnover'] = inventory_turnover(df)
    except Exception as e:
        failed_visualizations.append(3)

    try:
        results['profit_margin'] = profit_margin(df)
    except Exception as e:
        failed_visualizations.append(4)

    try:
        results['reorder_frequency'] = reorder_frequency(df)
    except Exception as e:
        failed_visualizations.append(5)

    try:
        results['item_combinations'] = item_combinations(df)
    except Exception as e:
        failed_visualizations.append(6)

    # Metric analyses
    try:
        results['average_order_value'] = average_order_value(df)
    except Exception as e:
        failed_visualizations.append(7)

    try:
        results['repeat_customer_rate'] = repeat_customer_rate(df)
    except Exception as e:
        failed_visualizations.append(8)

    try:
        results['prep_time_analysis'] = prep_time_analysis(df)
    except Exception as e:
        failed_visualizations.append(9)

    try:
        results['cancellation_analysis'] = cancellation_analysis(df)
    except Exception as e:
        failed_visualizations.append(10)

    try:
        results['time_between_orders'] = time_between_orders(df)
    except Exception as e:
        failed_visualizations.append(11)

    try:
        results['driver_wait_time'] = driver_wait_time(df)
    except Exception as e:
        failed_visualizations.append(12)

    # Visualization analyses (plots shown automatically)
    visualization_functions = [
        ('delivery_time_distribution', delivery_time_distribution),
        ('monthly_sales_growth', monthly_sales_growth),
        ('orders_by_hour', orders_by_hour),
        ('city_performance', city_performance),
        ('item_price_distribution', item_price_distribution),
        ('busiest_day', busiest_day),
        ('order_value_distribution', order_value_distribution),
        ('customer_acquisition', customer_acquisition),
        ('delivery_vs_order_value', delivery_vs_order_value),
        ('age_distribution', age_distribution),
        ('seasonal_sales', seasonal_sales),
        ('customer_spending', customer_spending),
        ('rating_trend', rating_trend),
        ('payment_methods', payment_methods),
        ('customer_retention', customer_retention),
        ('processing_time_by_day', processing_time_by_day),
        ('high_value_orders', high_value_orders),
        ('completion_time_trend', completion_time_trend),
        ('value_delivery_impact', value_delivery_impact),
        ('kitchen_efficiency', kitchen_efficiency),
        ('multi_item_orders', multi_item_orders),
        ('delivery_radius', delivery_radius),
        ('promotion_impact', promotion_impact),
        ('segment_order_size', segment_order_size),
        ('weather_impact', weather_impact),
        ('city_order_size', city_order_size),
        ('order_size_delivery', order_size_delivery),
        ('segment_order_value', segment_order_value),
        ('order_time_delivery', order_time_delivery),
        ('payment_order_value', payment_order_value),
        ('order_time_value', order_time_value),
        ('distance_order_value', distance_order_value),
    ]

    for idx, (name, func) in enumerate(visualization_functions, start=13):
        try:
            results[name] = func(df)
        except Exception as e:
            failed_visualizations.append(idx)

    return results, failed_visualizations

if __name__ == "__main__":
    # Create the reports folder if it doesn't exist
    if not os.path.exists('reports'):
        os.makedirs('reports')

    # Load your DataFrame here
    df = pd.read_csv('data/DimSumDelight_Full.csv')

    # Run all analyses
    results, failed_visualizations = run_all_analyses(df)

    # Print failed visualizations
    if failed_visualizations:
        print(f"The following visualizations could not be generated: {failed_visualizations}")
    else:
        print("All visualizations were successfully generated and saved in the 'reports' folder.")