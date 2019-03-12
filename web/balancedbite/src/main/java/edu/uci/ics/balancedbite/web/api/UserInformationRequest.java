package edu.uci.ics.balancedbite.web.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserInformationRequest {
	private String token;
	private Integer stepCount;
	private Integer distanceTraveled;
	
	@JsonProperty
	public String getToken() {
		return token;
	}
	
	@JsonProperty
	public Integer getStepCount() {
		return stepCount;
	}
	
	@JsonProperty
	public Integer getDistanceTraveled() {
		return distanceTraveled;
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
	
	@JsonProperty
	public void setDistanceTraveled(Integer distanceTraveled) {
		this.distanceTraveled = distanceTraveled;
	}
	
}
