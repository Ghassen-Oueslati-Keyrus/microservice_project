package com.example.springcrudmongodb.services;

import com.example.springcrudmongodb.entities.Product;
import com.example.springcrudmongodb.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;
import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IProductServiceImp implements IProductService{
    private final ProductRepository productRepository;

    @Override
    public Product add(Product product) {
       product.setCreatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    public Product update(long idProduct, Map<Object, Object> fields) {
        Product product = productRepository.findById(idProduct)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + idProduct));

        fields.forEach((key, value) -> {
            Field field = ReflectionUtils.findField(Product.class, (String) key);
            field.setAccessible(true);

            if(field.getType().equals(LocalDate.class)){
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-mm-d");
                LocalDate localDate = LocalDate.parse((String) value, formatter);
                ReflectionUtils.setField(field, product , localDate);
            }else {
                ReflectionUtils.setField(field, product , value);
            }

        });
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    public boolean delete(long idProduct) {
         productRepository.deleteById(idProduct);
        return productRepository.existsById(idProduct);
    }

    @Override
    public Page<Product> getProducts(int pageNbr, int pageSize) {
        return productRepository.findAll(PageRequest.of(pageNbr,pageSize));
    }

    @Override
    public Product getProduct(long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("product not found"));
    }

    @Override
    public Product getProductByName(String name) {
        return productRepository.findByName(name)
                .orElseThrow(() ->new IllegalArgumentException("product not found with this name"));
    }


}
