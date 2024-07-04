package com.apnanotes.jwt;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;

public class VerificationCodeGenerator {

    public static String generateVerificationCode(String username) {
        try {
            long currentTimeMillis = Instant.now().toEpochMilli();
            
            String input = username + currentTimeMillis;
            
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            
            String verificationCode = Base64.getUrlEncoder().withoutPadding().encodeToString(hashBytes);
            
            return verificationCode.substring(0, 6);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating verification code", e);
        }
    }
}
