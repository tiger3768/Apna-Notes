package com.apnanotes.jwt;


import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.apnanotes.jwt.config.SendGridApi;
import com.apnanotes.jwt.user.Role;
import com.apnanotes.jwt.user.UserClass;
import com.apnanotes.jwt.user.UserClassRepository;
import com.apnanotes.jwt.user.VerificationCode;
import com.apnanotes.jwt.user.VerificationCodeRepository;
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
	private VerificationCodeRepository verificationCodeRepo;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private AuthenticationManager authenticationManager;

	public AuthenticationResponse register(RegisterRequest request) {
		if(repository.findByUsername(request.getUsername()).isPresent() || repository.findByUsername(request.getEmail()).isPresent()) {
			return AuthenticationResponse.builder()
					.error("Username Already Exists")
					.build();
		}
		if(repository.findByEmail(request.getEmail()).isPresent() || repository.findByEmail(request.getUsername()).isPresent()) {
			return AuthenticationResponse.builder()
					.error("Email Already Exists")
					.build();
		}
		
		var user = UserClass.builder()
				.username(request.getUsername())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.verified(false)
				.role(Role.USER)
				.createdDate(LocalDateTime.now())
				.build();
		
		userRepo.save(new User(user.getUsername(), user.getEmail(), user.getCreatedDate()));
		repository.save(user);
	
		VerificationCode vcode = new VerificationCode(user, VerificationCodeGenerator.generateVerificationCode(user.getUsername()), LocalDateTime.now());
		verificationCodeRepo.save(vcode);
		
		SendGridApi.sendEmail(user.getEmail(), vcode.getCode());
		
		var jwtToken = jwtService.generateToken(user);
		return AuthenticationResponse.builder()
				.token(jwtToken)
				.role(user.getRole().toString())
				.build();
	}
	
	public AuthenticationResponse verify(VerificationRequest request) {

		var userByName = repository.findByUsername(request.getUsername()).orElse(null); 
		var userByEmail = repository.findByEmail(request.getUsername()).orElse(null);
		if(userByName == null && userByEmail == null) {return
			AuthenticationResponse.builder()
			.error("User Doesn't Exist")
			.build();
		}
		if(userByName == null) userByName = userByEmail;	
		if(verificationCodeRepo.findByUser(userByName).getCreatedDate().plusHours(2).isBefore(LocalDateTime.now())){
			return AuthenticationResponse.builder()
					.error("Code too old, try resending")
					.build();
		}
		if(verificationCodeRepo.findByUser(userByName).getCode().equals(request.getVerificationCode())) {
			userByName.setVerified(true);
			repository.save(userByName);
			return AuthenticationResponse.builder()
					.build();
		}
		else {
			return AuthenticationResponse.builder()
					.error("Invalid Verification Code")
					.build();
		}
	}
	
	public AuthenticationResponse resendCode(ResendCodeRequest request) {

		var userByName = repository.findByUsername(request.getUsername()).orElse(null); 
		var userByEmail = repository.findByEmail(request.getUsername()).orElse(null);
		if(userByName == null && userByEmail == null) {return
			AuthenticationResponse.builder()
			.error("User Doesn't Exist")
			.build();
		}
		if(userByName == null) userByName = userByEmail;	
		if(verificationCodeRepo.findByUser(userByName).getCreatedDate().plusMinutes(5).isBefore(LocalDateTime.now())) {
			VerificationCode vcode = verificationCodeRepo.findByUser(userByName);
			vcode.setCode(VerificationCodeGenerator.generateVerificationCode(userByName.getUsername()));
			vcode.setCreatedDate(LocalDateTime.now());
			verificationCodeRepo.save(vcode);
			SendGridApi.sendEmail(userByName.getEmail(), vcode.getCode());
			return AuthenticationResponse.builder()
					.build();
		}
		else {
			return AuthenticationResponse.builder()
					.error("Too Many Requests")
					.build();
		}
	}
	
	public AuthenticationResponse login(LoginRequest request) {

		var userByName = repository.findByUsername(request.getUsername()).orElse(null); 
		var userByEmail = repository.findByEmail(request.getUsername()).orElse(null);
		if(userByName == null && userByEmail == null) {return
			AuthenticationResponse.builder()
			.error("User Doesn't Exist")
			.build();
		}
		if(userByName == null) userByName = userByEmail;
		if(userByName.getVerified() == false) {
			return AuthenticationResponse.builder()
					.error("Verification Needed")
					.build();
		}
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						userByName.getUsername(),
						request.getPassword()
				)
		);
		var jwtToken = jwtService.generateToken(userByName);
		return AuthenticationResponse.builder()
				.token(jwtToken)
				.build();
	}
	
	public AuthenticationResponse resetPassword(ResetPasswordRequest request) {

		var userByName = repository.findByUsername(request.getUsername()).orElse(null); 
		var userByEmail = repository.findByEmail(request.getUsername()).orElse(null);
		if(userByName == null && userByEmail == null) {return
			AuthenticationResponse.builder()
			.error("User Doesn't Exist")
			.build();
		}
		if(userByName == null) userByName = userByEmail;	
		if(request.getVerificationCode().isEmpty()) {
			if(jwtService.isTokenValid(request.getToken(), userByName)) {
				userByName.setPassword(passwordEncoder.encode(request.getPassword()));
				repository.save(userByName);
				return AuthenticationResponse.builder()
						.build();
			}
			else {
				return AuthenticationResponse.builder()
						.error("Expired Login Session")
						.build();
			}
		}
		if(verificationCodeRepo.findByUser(userByName).getCreatedDate().plusHours(2).isBefore(LocalDateTime.now())){
			return AuthenticationResponse.builder()
					.error("Code too old, try resending")
					.build();
		}
		if(verificationCodeRepo.findByUser(userByName).getCode().equals(request.getVerificationCode())) {
			userByName.setPassword(passwordEncoder.encode(request.getPassword()));
			repository.save(userByName);
			return AuthenticationResponse.builder()
					.build();
		}
		else {
			return AuthenticationResponse.builder()
					.error("Invalid Verification Code")
					.build();
		}
	}
	
}
