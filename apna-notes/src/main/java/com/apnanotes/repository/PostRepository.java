package com.apnanotes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apnanotes.user.Post;
import com.apnanotes.user.User;


public interface PostRepository extends JpaRepository<Post, Integer> {
	List<Post> findAllByUser(User user);
}
