package edu.uci.ics.balancedbite.web.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ServerStatus {
	
	private long id;
	
	private String host;
	
	private int port;
	
	public ServerStatus() {
		
	}
	
	public ServerStatus(long id, String host, int port) {
		this.id = id;
		this.host = host;
		this.port = port;
	}
	
	@JsonProperty
	public long getId () {
		return id;
	}
	
	@JsonProperty
	public String getHost() {
		return host;
	}
	
	@JsonProperty
	public int getPort() {
		return port;
	}
}
