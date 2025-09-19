package org.example.formation1.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


import java.time.LocalDate;

@Entity
public class ReservationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private LocalDate date;


    private Boolean paid = false;

    public Boolean getConfirm() {
        return confirm;
    }

    public void setConfirm(Boolean confirm) {
        this.confirm = confirm;
    }

    private Boolean confirm = false;

    @ManyToOne
    @JoinColumn(name = "user")
    private UserModel user;


    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel client) {
        this.user = client;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Boolean getPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public ReservationModel(LocalDate date, Boolean paid) {
        this.date = date;
        this.paid = paid;
    }

    public ReservationModel() {}
}