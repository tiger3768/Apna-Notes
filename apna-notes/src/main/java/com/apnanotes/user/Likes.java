package com.apnanotes.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;


@Entity
public class Likes {
	
	@Id
	@GeneratedValue
	private Integer likeId;
	

	private Integer user;

	private Integer post;
	
	public Likes() {}
	
	public Likes(Integer user, Integer post) {
		super();
		this.user = user;
		this.post = post;
	}
	
	public Likes(Integer id, Integer user, Integer post) {
		super();
		this.likeId = id;
		this.user = user;
		this.post = post;
	}
	
	public Integer getUser() {
		return user;
	}
	public void setUser(Integer userId) {
		this.user = userId;
	}
	public Integer getPost() {
		return post;
	}
	public void setPost(Integer postId) {
		this.post = postId;
	}
}
