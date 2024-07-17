package com.example.springcrudmongodb.repositories;


import com.example.springcrudmongodb.entities.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, Long> {

    Optional<Product> findByName(String name);
}