package edu.uci.ics.balancedbite.web.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FoodDetailRequest {
	private String token;
	private String name;
	
	public FoodDetailRequest() { }
	
	@JsonProperty
	public String getToken() {
		return token;
	}
	
	@JsonProperty
	public String getName() {
		return name;
	}
	
	
	@JsonProperty
	public void setToken(String token) {
		this.token = token;
	}
	
	@JsonProperty
	public void setName(String name) {
		this.name = name;
	}
}
