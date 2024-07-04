package com.apnanotes.jwt.user;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class VerificationCode{
	
	@Id
	@GeneratedValue
	private Integer id;
	
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id", unique = true)
    private UserClass user;
	
	@Column
	private String code;
	
	@Column
	private LocalDateTime createdDate;
	
	public VerificationCode(UserClass user, String code, LocalDateTime createdDate) {
		super();
		this.user = user;
		this.code = code;
		this.createdDate = createdDate;
	}
}

