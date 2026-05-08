package com.example.core.dto;

import com.example.core.entity.Category;
import lombok.Data;

@Data
public class CategoryResponse {

    private Long id;
    private String name;
    private String icon;
    private String color;

    public static CategoryResponse from(Category category) {
        CategoryResponse res = new CategoryResponse();
        res.id = category.getId();
        res.name = category.getName();
        res.icon = category.getIcon();
        res.color = category.getColor();
        return res;
    }
}
