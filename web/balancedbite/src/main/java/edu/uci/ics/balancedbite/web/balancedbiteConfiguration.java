package edu.uci.ics.balancedbite.web;

import io.dropwizard.Configuration;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.hibernate.validator.constraints.*;

import javax.validation.Valid;
import javax.validation.constraints.*;

public class balancedbiteConfiguration extends Configuration {
    // TODO: implement service configuration
	
	@Valid
	@NotNull
	@JsonProperty
	private DatabaseConfiguration database = new DatabaseConfiguration();
	
	
	public DatabaseConfiguration getDatabaseConfiguration() {
		return database;
	}
}
