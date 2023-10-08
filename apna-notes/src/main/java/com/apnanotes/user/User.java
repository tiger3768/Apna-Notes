package com.apnanotes.user;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Size;

@Entity(name = "user_details")
public class User{
	
	@Id
	@GeneratedValue
	private Integer id;
	@Column(unique = true)
	@Size(min = 2, message = "Enter a name with atleast 4 charaters")
	private String username;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
	@JsonIgnore
	private List<Post> posts;
	
	public User() {}
	public User(String username) {
		super();
		this.username = username;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;       
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
}
