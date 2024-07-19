package com.example.springcrudmongodb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.springcrudmongodb.entities.Product;
import com.example.springcrudmongodb.repositories.ProductRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class IProductServiceImp implements IProductService {
    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product add(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product update(String idProduct, Map<Object, Object> fields) {
        Optional<Product> optionalProduct = productRepository.findById(idProduct);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            fields.forEach((key, value) -> {
                switch (key.toString()) {
                    case "name":
                        product.setName((String) value);
                        break;
                    case "description":
                        product.setDescription((String) value);
                        break;
                    case "quantity":
                        product.setQuantity((Integer) value);
                        break;
                    case "price":
                        product.setPrice((Double) value);
                        break;
                }
            });
            return productRepository.save(product);
        }
        return null; // Or throw an exception
    }

    @Override
    public boolean delete(String idProduct) {
        if (productRepository.existsById(idProduct)) {
            productRepository.deleteById(idProduct);
            return true;
        }
        return false;
    }

    @Override
    public Page<Product> getProducts(int pageNbr, int pageSize) {
        return productRepository.findAll(PageRequest.of(pageNbr, pageSize));
    }

    @Override
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    @Override
    public Product getProductByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
