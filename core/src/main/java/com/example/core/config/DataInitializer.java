package com.example.core.config;

import com.example.core.entity.Category;
import com.example.core.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final CategoryRepository categoryRepository;

    @Bean
    public ApplicationRunner seedDefaultCategories() {
        return args -> {
            if (categoryRepository.count() > 0) return;

            List<Category> defaults = List.of(
                    new Category(null, "Food & Dining", "restaurant", "#FF7043"),
                    new Category(null, "Transport", "directions_car", "#42A5F5"),
                    new Category(null, "Bills & Utilities", "receipt", "#AB47BC"),
                    new Category(null, "Shopping", "shopping_bag", "#EC407A"),
                    new Category(null, "Health", "local_hospital", "#26A69A"),
                    new Category(null, "Entertainment", "movie", "#FFA726"),
                    new Category(null, "Education", "school", "#5C6BC0"),
                    new Category(null, "Other", "category", "#78909C")
            );
            categoryRepository.saveAll(defaults);
        };
    }
}
