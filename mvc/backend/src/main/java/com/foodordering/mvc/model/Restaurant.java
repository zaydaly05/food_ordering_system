package com.foodordering.mvc.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.util.List;

@Document(collection = "restaurants")
@Data
public class Restaurant {

    @Id
    private String id;

    private String name;
    private String address;
    private String phone;

    private List<Menuitem> menu;
}