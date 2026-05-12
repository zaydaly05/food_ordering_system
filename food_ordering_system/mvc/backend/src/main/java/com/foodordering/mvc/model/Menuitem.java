package com.foodordering.mvc.model;

import lombok.Data;

@Data
public class Menuitem {

    private String id;

    private String name;

    private double price;

    private String description;

    private String image;

    private String category;

    private String restaurantId;
}