package com.apnanotes.jwt;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {
	
	@Autowired
	private AuthenticationService service;
	
	@PostMapping("/resetPassword")
	public ResponseEntity<AuthenticationResponse> updatePassword(
			@RequestBody ResetPasswordRequest request){
		return ResponseEntity.ok(service.resetPassword(request));
	}
	
	@PostMapping("/resendCode")
	public ResponseEntity<AuthenticationResponse> resendCode(
			@RequestBody ResendCodeRequest request){
		return ResponseEntity.ok(service.resendCode(request));
	}
	
	@PostMapping("/verify")
	public ResponseEntity<AuthenticationResponse> verify(
			@RequestBody VerificationRequest request){
		return ResponseEntity.ok(service.verify(request));
	}
	
	@PostMapping("/register")
	public ResponseEntity<AuthenticationResponse> register(
			@RequestBody RegisterRequest request){
		return ResponseEntity.ok(service.register(request));
	}
	
	@PostMapping("/login")
	public ResponseEntity<AuthenticationResponse> authenticate(
			@RequestBody LoginRequest request){
		return ResponseEntity.ok(service.login(request));
	}
}
