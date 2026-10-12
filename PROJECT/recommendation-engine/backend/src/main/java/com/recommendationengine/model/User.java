package com.recommendationengine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;

/**
 * User Entity stored in MongoDB 'users' collection.
 * Academic Concept: Uses ArrayList<String> to store user's preferred genres.
 */
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    // ArrayList concept for dynamic genre storage
    private ArrayList<String> preferredGenres = new ArrayList<>();

    private Date createdAt = new Date();

    public User() {}

    public User(String name, String email, String password, ArrayList<String> preferredGenres) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.preferredGenres = (preferredGenres != null) ? preferredGenres : new ArrayList<>();
        this.createdAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public ArrayList<String> getPreferredGenres() { return preferredGenres; }
    public void setPreferredGenres(ArrayList<String> preferredGenres) { 
        this.preferredGenres = (preferredGenres != null) ? preferredGenres : new ArrayList<>(); 
    }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
