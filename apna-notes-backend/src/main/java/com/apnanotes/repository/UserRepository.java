package com.apnanotes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apnanotes.user.User;

public interface UserRepository extends JpaRepository<User, String> {
	
	User findByUsername(String username);
	User findByEmail(String email);
	List<User> findByOrganisation(String organisation);
}
