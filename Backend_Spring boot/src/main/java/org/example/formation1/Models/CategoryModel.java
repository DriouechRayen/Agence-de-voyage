package org.example.formation1.Models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class CategoryModel {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }

    public CategoryModel(String name, String description) {
        this.name = name;
        this.description = description;
    }
    public CategoryModel() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<VoyageModel> voyageModelList;

    @JsonIgnore

    public List<VoyageModel> getVoyageModelList() {
        return voyageModelList;
    }

    public void setVoyageModelList(List<VoyageModel> voyageModelList) {
        this.voyageModelList = voyageModelList;
    }
}