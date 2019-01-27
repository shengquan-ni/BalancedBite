package edu.uci.ics.balancedbite.web;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DatabaseConfiguration {
	
	@NotEmpty
	private String host;
	
	@Min(1)
	@Max(65535)
	@NotNull
	private int port;
	
	@JsonProperty
	public String getHost() {
		return host;
	}
	
	@JsonProperty
	public int getPort() {
		return port;
	}
	
	@JsonProperty
	public void setHost(String host) {
		this.host= host;
	}
	
	@JsonProperty
	public void setPort(int port) {
		this.port = port;
	}
}
