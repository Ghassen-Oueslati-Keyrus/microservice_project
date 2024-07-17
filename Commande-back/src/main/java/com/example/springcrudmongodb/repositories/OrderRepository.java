package com.example.springcrudmongodb.repositories;

import com.example.springcrudmongodb.entities.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderRepository extends MongoRepository<Order, String> {
    // Custom query methods can be added here if needed
}
