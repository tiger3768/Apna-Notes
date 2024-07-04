package com.apnanotes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apnanotes.user.Topic;

public interface TopicRepository extends JpaRepository<Topic, Integer> {

}
