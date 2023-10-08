package com.apnanotes.user;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Size;

@Entity
@Table(uniqueConstraints={
	    @UniqueConstraint(columnNames = {"name", "user_id"})
	}) 
public class Post {
	
	@Id
	@GeneratedValue
	private Integer id;	
	@Size(min = 6, message = "Name should be atleast 6 characters long")
	@Size(max = 60, message = "Name should be less than 60 characters long")
	private String name;
	private String path;
	@ManyToOne(fetch = FetchType.LAZY) 
    @JsonSerialize(using = UserSerializer.class)
    private User user;
	public Post() {}
	public Post(String name, String path) {
		this.name = name;
		this.path = path;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	@Override
	public String toString() {
		return "Post name=" + name + "]";
	}
	
}
