package com.example.springcrudmongodb.services;

import com.example.springcrudmongodb.entities.Product;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IProductService {
    Product add(Product product);
    Product update(String idProduct, Map<Object,Object> fields);
    boolean delete(String idProduct);
    Page<Product> getProducts(int pageNbr, int pageSize);
    Optional<Product> getProductById(String id);
    Product getProductByName(String name);
    List<Product> getAllProducts();
}

