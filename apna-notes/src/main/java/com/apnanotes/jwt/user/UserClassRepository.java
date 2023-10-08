package com.apnanotes.jwt.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserClassRepository extends JpaRepository<UserClass, Integer> {
	Optional<UserClass> findByUsername(String username);
}
