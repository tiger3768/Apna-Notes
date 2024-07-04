package com.apnanotes.user;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.apnanotes.exceptions.UserNotFoundException;
import com.apnanotes.repository.LikesRepository;
import com.apnanotes.repository.OrganisationRepository;
import com.apnanotes.repository.PostRepository;
import com.apnanotes.repository.TopicRepository;
import com.apnanotes.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;

@RestController
public class UserResource {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PostRepository postRepository;
	
	@Autowired
	private LikesRepository likesRepository;
	
	@Autowired
	private OrganisationRepository organisationRepository;
	
	@Autowired
	private TopicRepository topicRepository;
	
	@GetMapping("/leaderboard")
	public List<UserPostLikesPair> rankUsers(){
		List<UserPostLikesPair> list = likesRepository.leaderboard();
		return list;
	}
	
	@GetMapping("/users/{username}")
	 public User getUser(@PathVariable String username){
		 User user =  userRepository.findByUsername(username);
		 if(user == null) throw new UserNotFoundException("username:" + username);	
		 return user;
	 }

	@GetMapping("/users/{username}/posts")
	public ResponseEntity<List<Post>> listPosts(@PathVariable String username) {
		User user = userRepository.findByUsername(username);
		if(user == null) throw new UserNotFoundException("username:" + username);
	    List<Post> posts = postRepository.findAllByUser(user);
	    return ResponseEntity.ok(posts);
	}
	
	@GetMapping("/users/{username}/posts/topics")
	public List<Topic> topicsOfPost(@RequestParam Integer postId){
		return postRepository.findById(postId).get().getTopic();
	}
	
	@PatchMapping("/users/{username}")
	public boolean updateUser(@PathVariable String username, @RequestBody JsonNode user){
		User userToUpdate = userRepository.findByUsername(username);
		if(userToUpdate == null) return false;
		if(user.get("firstname") != null && !user.get("firstname").asText().isBlank()) userToUpdate.setFirstname(user.get("firstname").asText());
		if(user.get("lastname") != null && !user.get("lastname").asText().isBlank()) userToUpdate.setLastname(user.get("lastname").asText());
		if(user.get("name") != null && !user.get("name").asText().isBlank()) {
			Organisation org = organisationRepository.findByName(user.get("name").asText());
			userToUpdate.setOrganisation(org);
		}
		userRepository.save(userToUpdate);
		return true;
	}
	
	@PostMapping(path = "/users/{username}/posts")
	public ResponseEntity<User> savePdf(@PathVariable String username, @RequestBody Post post) throws IOException {
		String[] supported= {"pdf"};
		User user = userRepository.findByUsername(username);
		if(user == null || post.getName() == null || post.getPath() == null) return ResponseEntity.badRequest().build();
		boolean accept = false;
		String type = post.getName().substring(post.getName().length() - 3); 
		for(String s : supported) if(type.equals(s)) {accept = true; break;}
		if(!accept) return ResponseEntity.badRequest().build();
		post.setUser(user);
		post.setCreatedDate(LocalDateTime.now());
		Post savedPost = postRepository.save(post);
		URI location = ServletUriComponentsBuilder
				.fromCurrentRequest().path("/{id}")
				.buildAndExpand(savedPost.getId())	
				.toUri();
		return ResponseEntity.created(location).build();
    }
	
	@DeleteMapping("/users/{username}/posts")
	public ResponseEntity<String> deletePost(@PathVariable String username, @RequestParam Integer id){
		postRepository.deleteById(id);
		return ResponseEntity.ok("Deleted");
	}	
	
	@GetMapping("/users/likes/{id}")
	public Integer getLikes(@PathVariable Integer id) {
		return likesRepository.findAllByPostId(id);
	}
	
	@PostMapping("/like/{username}")
	public ResponseEntity<String> like(@PathVariable String username, @RequestBody Likes like) {
		Integer user = (userRepository.findByUsername(username)).getId();
		like.setUser(user);
		if(like != null && like.getPost() != null) {
			if(likesRepository.findByPostAndUser(like.getPost(), like.getUser()) == null) likesRepository.save(like);
			else return ResponseEntity.ok("409	");
		}
		return ResponseEntity.ok("");
	}
	
	@PostMapping("/dislike/{username}")
	public ResponseEntity<String> dislike(@PathVariable String username, @RequestBody Likes like) {
		Integer user = (userRepository.findByUsername(username)).getId();
		Likes tD = likesRepository.findByPostAndUser(like.getPost(), user);
		if(tD != null) likesRepository.delete(tD);
		return ResponseEntity.ok("");
	}

	@GetMapping("/search/{file}")
	public List<Post> search(@PathVariable(required = false) String file, 
			@RequestParam(required = false) String username){
		List<Post> matchingPosts = new ArrayList<>();
		List<Post> allPosts;
		if(username == null) allPosts = postRepository.findAll();
		else allPosts = postRepository.findAllByUser(userRepository.findByUsername(username));
		
		for (Post post : allPosts) {
	        if (post.getName().toLowerCase().contains(file.toLowerCase())) matchingPosts.add(post);
		}
		if(file == null) return allPosts;
		Collections.sort(matchingPosts, (post1, post2) -> {
	        String name1 = post1.getName().toLowerCase();
	        String name2 = post2.getName().toLowerCase();

	        
	        if (name1.equals(file) && !name2.equals(file)) {
	            return -1;
	        } else if (!name1.equals(file) && name2.equals(file)) {
	            return 1;
	        }
	        
	        boolean contains1 = name1.contains(file);
	        boolean contains2 = name2.contains(file);

	        if (contains1 && !contains2) {
	            return -1;
	        } else if (!contains1 && contains2) {
	            return 1;
	        }

	        return Integer.compare(likesRepository.findAllByPostId(post2.getId()), 
	                               likesRepository.findAllByPostId(post1.getId()));
	    });

	    return matchingPosts;
	}
	
	@GetMapping("/organisations")
	public List<Organisation> getOrganisations(@RequestParam String organisationType) {
	    return organisationRepository.findByOrganisationType(organisationType);
	}
	
	@GetMapping("/organisations/{organisationName}")
	public List<User> getOrganisationUsers(@PathVariable String organisationName){
		return userRepository.findByOrganisation(organisationName);
	}
	
	@GetMapping("/topics")
	public List<Topic> getTopics(){
		return topicRepository.findAll();
	}
}
