package com.example.springcrudmongodb.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
public class Order {
    @Id
    private String id;
    private String userId; // Assuming you have a user ID
    private List<String> productIds; // List of product IDs in the order
    private double totalAmount;

    // Getters and setters
}
