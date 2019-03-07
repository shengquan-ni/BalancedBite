package edu.uci.ics.balancedbite.web.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Tag {
	
	private String name;
	
	public Tag() { };
	
	public Tag(String name) {
		this.name = name;
	}
	
	@JsonProperty
	public String getName() {
		return name;
	}
	
	@JsonProperty
	public void setName(String name) {
		this.name = name;
	}
}
