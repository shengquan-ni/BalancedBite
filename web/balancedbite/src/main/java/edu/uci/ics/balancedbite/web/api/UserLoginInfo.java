package edu.uci.ics.balancedbite.web.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserLoginInfo {
	
	private String username;
	
	private String password;
	
	public UserLoginInfo() {}
	
	public UserLoginInfo(String username, String password) {
		this.username = username;
		this.password = password;
	}
	
	@JsonProperty
	public String getUsername() {
		return username;
	}
	
	@JsonProperty
	public String getPassword() {
		return password;
	}
	
	@JsonProperty
	public void setUsername(String username) {
		this.username = username;
	}
	
	@JsonProperty
	public void setPassword(String password) {
		this.password = password;
	}
}
