package com.example.springcrudmongodb;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableFeignClients
public class SpringCrudMongoDbApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringCrudMongoDbApplication.class, args);
    }
}
