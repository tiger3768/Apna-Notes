package com.apnanotes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apnanotes.user.Organisation;

public interface OrganisationRepository extends JpaRepository<Organisation, Integer> {
	List<Organisation> findByOrganisationType(String organisationType);
	Organisation findByName(String name);
}
