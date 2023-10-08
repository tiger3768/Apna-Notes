package com.apnanotes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apnanotes.user.User;

public interface UserRepository extends JpaRepository<User, String> {
	User findByUsername(String username);
}
