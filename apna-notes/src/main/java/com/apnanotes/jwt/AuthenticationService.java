package com.apnanotes.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.apnanotes.jwt.user.Role;
import com.apnanotes.jwt.user.UserClass;
import com.apnanotes.jwt.user.UserClassRepository;
import com.apnanotes.repository.UserRepository;
import com.apnanotes.user.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	
	@Autowired
	private UserClassRepository repository;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private AuthenticationManager authenticationManager;

	public AuthenticationResponse register(RegisterRequest request) {
			if(repository.findByUsername(request.getUsername()).isPresent()) {
			return AuthenticationResponse.builder()
					.error("Username Already Exists")
					.build();
		}
		var user = UserClass.builder()
				.username(request.getUsername())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.USER)
				.build();
		userRepo.save(new User(request.getUsername()));
		repository.save(user);
		
		var jwtToken = jwtService.generateToken(user);
		return AuthenticationResponse.builder()
				.token(jwtToken)
				.role(user.getRole().toString())
				.build();
	}

	public AuthenticationResponse login(LoginRequest request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getUsername(),
						request.getPassword()
				)
		);
		var user = repository.findByUsername(request.getUsername()).orElseThrow(); 
		var jwtToken = jwtService.generateToken(user);
		return AuthenticationResponse.builder()
				.token(jwtToken)
				.build();
	}
	
}
