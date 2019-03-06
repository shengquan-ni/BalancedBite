package edu.uci.ics.balancedbite.web.api;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserToken {
		
	private String token;
	private String username;
	private String time;
	
	public UserToken() {}
	
	public UserToken(String token, String username, String time ) {
		this.token = token;
		this.username = username;
		this.time = time;
	}
	
	@JsonProperty
	public String getToken() {
		return token;
	}
	
	@JsonProperty
	public String getUsername() {
		return username;
	}
	
	@JsonProperty
	public String getTime() {
		return time;
	}
	
	
	
	@JsonProperty
	public void setToken(String token) {
		this.token = token;
	}
	
	@JsonProperty
	public void setUsername(String username) {
		this.username = username;
	}
	
	@JsonProperty
	public void setTime(String time) {
		this.time = time;
	}
}
