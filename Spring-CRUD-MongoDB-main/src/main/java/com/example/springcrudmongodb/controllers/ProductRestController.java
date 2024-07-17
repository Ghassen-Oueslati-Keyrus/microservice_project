package com.example.springcrudmongodb.controllers;

import com.example.springcrudmongodb.entities.Product;
import com.example.springcrudmongodb.services.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductRestController{

    private final IProductService productService;

    @PostMapping
    public Product add(@RequestBody Product product) {
        return productService.add(product);
    }

    @PatchMapping("{id}")
    public Product patchUpdate(@RequestBody Map<Object,Object> fields, @PathVariable long id){
        return productService.update(id,fields);
    }

    @DeleteMapping("{id}")
    public boolean delete( @PathVariable long id){
        return productService.delete(id);
    }


    @GetMapping
    public Page<Product> getProducts(int pageNbr,int pageSize){
        return productService.getProducts(pageNbr,pageSize);
    }

    @GetMapping("{id}")
    public Product getProduct(@PathVariable long id){
        return productService.getProduct(id);
    }

    @GetMapping("name/{name}")
    public Product getProduct(@PathVariable String name){
        return productService.getProductByName(name);
    }







}
