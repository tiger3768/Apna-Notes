package com.apnanotes.jwt.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Integer> {
	VerificationCode findByUser(UserClass user);
}
