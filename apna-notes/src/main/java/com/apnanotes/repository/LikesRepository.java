package com.apnanotes.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.apnanotes.user.Likes;
import com.apnanotes.user.UserPostLikesPair;

public interface LikesRepository extends JpaRepository<Likes, Integer> {
	
	@Query("SELECT COUNT(*) FROM Likes WHERE post = :param")
	Integer findAllByPostId(@Param("param") Integer postId);
	
    @Query("SELECT e FROM Likes e WHERE e.post = :param1 AND e.user = :param2")
	Likes findByPostAndUser(@Param("param1") Integer postId, @Param("param2") Integer userId);
    
    @Query("SELECT p.user.username AS user, COUNT(l.post) AS likes FROM Likes l INNER JOIN Post p ON l.post = p.id GROUP BY p.user ORDER BY likes DESC")
    List<UserPostLikesPair> leaderboard();
}
