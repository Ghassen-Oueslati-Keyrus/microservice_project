package com.example.springcrudmongodb.services;

import com.example.springcrudmongodb.entities.Order;
import com.example.springcrudmongodb.repositories.OrderRepository;
import com.example.springcrudmongodb.dto.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImp implements IOrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductServiceClient productServiceClient;

    @Override
    public Order createOrder(Order order) {
        // Fetch products from ProductServiceClient
        List<ProductDTO> productDTOs = productServiceClient.getProductsByIds(
                order.getProductIds()
        );

        // Calculate total price
        double totalPrice = productDTOs.stream()
                .mapToDouble(ProductDTO::getPrice)  // Assuming ProductDTO has a getPrice method
                .sum();

        order.setTotalPrice(totalPrice);
        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(String id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }
}
