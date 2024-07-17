package com.example.springcrudmongodb.repositories;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.springcrudmongodb.entities.Product;

public interface ProductRepository extends MongoRepository<Product, String> {
    Product findByName(String name);  // Ensure this method is available
}
