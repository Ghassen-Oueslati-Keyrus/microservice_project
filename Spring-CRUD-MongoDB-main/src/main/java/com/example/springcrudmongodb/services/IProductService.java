package com.example.springcrudmongodb.services;

import com.example.springcrudmongodb.entities.Product;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface IProductService {

    Product add(Product product);

    Product update(long idProduct, Map<Object,Object> fields);

    boolean delete(long idProduct);


    Page<Product> getProducts(int pageNbr, int pageSize);

    Product getProduct(long id);

    Product getProductByName(String name);
}
