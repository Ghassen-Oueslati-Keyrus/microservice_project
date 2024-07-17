package com.example.springcrudmongodb.services;

import com.example.springcrudmongodb.entities.Order;

import java.util.List;
import java.util.Optional;

public interface IOrderService {
    Order createOrder(Order order);
    Optional<Order> getOrderById(String id);
    void cancelOrder(String id);
    List<Order> getAllOrders();
}
