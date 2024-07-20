#!/bin/bash

# Base URL for KrakenD
KRACKEND_URL="http://localhost:8000"

# Product details
PRODUCT_NAME="Sample Product"
PRODUCT_DESCRIPTION="Sample Description"
PRODUCT_QUANTITY=10
PRODUCT_PRICE=49.99

# Order details
ORDER_QUANTITY=5

echo "Creating a new product..."
create_product_response=$(curl --silent --request POST "$KRACKEND_URL/produits/add" \
  --header 'Content-Type: application/json' \
  --data "{
    \"name\": \"$PRODUCT_NAME\",
    \"description\": \"$PRODUCT_DESCRIPTION\",
    \"quantity\": $PRODUCT_QUANTITY,
    \"price\": $PRODUCT_PRICE
  }")
product_id=$(echo $create_product_response | jq -r '._id')
echo "Product created with ID: $product_id"

echo "Fetching all products..."
curl --silent --location "$KRACKEND_URL/produits/getall"

echo "Creating an order for product ID $product_id with quantity $ORDER_QUANTITY..."
create_order_response=$(curl --silent --request POST "$KRACKEND_URL/orders/add" \
  --header 'Content-Type: application/json' \
  --data "{
    \"productIds\": [\"$product_id\"]
  }")
order_id=$(echo $create_order_response | jq -r '._id')
echo "Order created with ID: $order_id"

echo "Fetching all orders..."
curl --silent --location "$KRACKEND_URL/orders/getall"

echo "Cancelling the order with ID $order_id..."
curl --silent --request DELETE "$KRACKEND_URL/orders/$order_id"

echo "Order cancelled successfully."
