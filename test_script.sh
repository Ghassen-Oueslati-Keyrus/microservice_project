#!/bin/bash

# Base URL for KrakenD
KRACKEND_URL="http://localhost:8000"

# Product details
ID_PRODUCT="product2"
PRODUCT_NAME="Sample Product"
PRODUCT_DESCRIPTION="Sample Description"
PRODUCT_QUANTITY=10
PRODUCT_PRICE=49.99

# Function to create a product
create_product() {
  echo "Creating a new product..."
  create_product_response=$(curl --silent --request POST "$KRACKEND_URL/produits/add" \
    --header 'Content-Type: application/json' \
    --data "{
      \"name\": \"$PRODUCT_NAME\",
      \"id\": \"$ID_PRODUCT\",
      \"description\": \"$PRODUCT_DESCRIPTION\",
      \"quantity\": $PRODUCT_QUANTITY,
      \"price\": $PRODUCT_PRICE
    }")
  product_id=$(echo $create_product_response | jq -r '.id')
  echo "Product created with ID: $product_id"
}

# Function to create an order
create_order() {
  echo "Enter the quantity for the order:"
  read ORDER_QUANTITY
  echo "Creating an order for product ID $product_id with quantity $ORDER_QUANTITY..."
  create_order_response=$(curl --silent --request POST "$KRACKEND_URL/orders/add" \
    --header 'Content-Type: application/json' \
    --data "{
      \"productIds\": [\"$product_id\"],
      \"quantity\": $ORDER_QUANTITY
    }")
  order_id=$(echo $create_order_response | jq -r '._id')
  echo "Order created with ID: $order_id"
}

# Function to cancel an order
cancel_order() {
  echo "Cancelling the last order with ID $order_id..."
  curl --silent --request DELETE "$KRACKEND_URL/orders/$order_id"
  echo "Order with ID $order_id has been canceled"
}

# Function to fetch all products
fetch_all_products() {
  echo "Fetching all products..."
  curl --silent --location "$KRACKEND_URL/produits/getall"
}

# Function to fetch all orders
fetch_all_orders() {
  echo "Fetching all orders..."
  curl --silent --location "$KRACKEND_URL/orders/getall"
}

# Main script execution
create_product
fetch_all_products

create_order
fetch_all_orders

echo # Add a newline before the questions

while true; do
  read -p "Do you want to create another order for the same product? (yes/no): " create_another_order
  if [ "$create_another_order" == "yes" ]; then
    create_order
    fetch_all_orders
    echo # Add a newline before the next question
  else
    break
  fi
done

echo # Add a newline before the question

read -p "Do you want to cancel the last order? (yes/no): " cancel_last_order
if [ "$cancel_last_order" == "yes" ]; then
  cancel_order
  fetch_all_orders
fi
