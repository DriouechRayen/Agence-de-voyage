package org.example.formation1.Services;


import org.example.formation1.Models.CategoryModel;
import org.example.formation1.Repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    //PUBLIC TYPErETOUR NOMfONCTION ( TYPE PARAM ...)

    public CategoryModel createCategory(CategoryModel category) {
        return categoryRepository.save(category);
    }


    public CategoryModel updateCategory(CategoryModel category) {
        return categoryRepository.save(category);
    }

    public CategoryModel  getOneCategory (Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public List<CategoryModel> getAllCategories() {
        return categoryRepository.findAll();
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
