package com.example.springcrudmongodb.services;

import com.example.springcrudmongodb.dto.ProductDTO; // Adjust the package path if necessary

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
@FeignClient(name = "product-service", url = "http://localhost:8080")  // Adjust the URL accordingly
public interface ProductServiceClient {

    @GetMapping("/products/{id}")
    ProductDTO getProductById(@PathVariable("id") String productId);

    @GetMapping("/products")
    List<ProductDTO> getAllProducts();
}
