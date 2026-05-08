package com.foodordering.mvc.model;

import lombok.Data;

@Data
public class Menuitem {
    private String name;
    private double price;
    private String description;
}