package com.apnanotes.user;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@Entity(name = "user_details")
public class User{
	
	@Id
	@GeneratedValue
	private Integer id;
	
	@Column(nullable = false, unique = true)
    @NotEmpty(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
	
	@Column(unique = true)
	@Size(min = 4, message = "Enter a name with atleast 4 charaters")
	@NotEmpty(message = "Username is required")
	private String username;
	
	@Column(name = "created_date")
	private LocalDateTime createdDate;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
	@JsonIgnore
	private List<Post> posts;
	
	@Column
	@Size(max = 60, message = "Name should be less than 60 characters long")
	private String firstname;
	
	@Column
	@Size(max = 60, message = "Name should be less than 60 characters long")
	private String lastname;
	
	@OneToOne(fetch = FetchType.LAZY)
    @JsonSerialize(using = OrganisationSerializer.class)
	Organisation organisation;
	
	public User() {}
	public User(String username, String email, LocalDateTime createdDate) {
		super();
		this.username = username;
		this.email = email;
		this.createdDate = createdDate;
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

	public String getFirstname() {
		return firstname;
	}
	
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	
	public String getLastname() {
		return lastname;
	}
	
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	
	public Organisation getOrganisation() {
		return organisation;
	}
	
	public void setOrganisation(Organisation organisation) {
		this.organisation = organisation;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public LocalDateTime getCreatedDate() {
		return createdDate;
	}
	
	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}
}
