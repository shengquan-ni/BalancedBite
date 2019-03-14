package edu.uci.ics.balancedbite.web.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserInformationRequest {
	private String token;
	private Integer stepCount;
	
	@JsonProperty
	public String getToken() {
		return token;
	}
	
	@JsonProperty
	public Integer getStepCount() {
		return stepCount;
	}
	
	// deserialize
	
	@JsonProperty
	public void setToken(String token) {
		this.token = token;
	}
	
	@JsonProperty
	public void setStepCount(Integer stepCount) {
		this.stepCount = stepCount;
	}
	
}
