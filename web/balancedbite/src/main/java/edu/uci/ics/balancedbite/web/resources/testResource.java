package edu.uci.ics.balancedbite.web.resources;

import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.codahale.metrics.annotation.Timed;

import edu.uci.ics.balancedbite.web.api.ServerStatus;

@Path("/test")
@Produces(MediaType.APPLICATION_JSON)
public class testResource {
	
	private final String host;
	private final int port;
	private final AtomicLong counter;
	
	public testResource(String host, int port) {
		this.host = host;
		this.port = port;
		this.counter = new AtomicLong();
	}
	
	@GET
	@Timed
	public ServerStatus getServerStatus(@QueryParam("name") Optional<String> name) {
		return new ServerStatus(counter.incrementAndGet(), name.orElse(host), port);
	}
	
	@GET
	@Timed
	@Path("/result")
	public ServerStatus goResult() {
		return new ServerStatus(counter.incrementAndGet(), host, 1);
	}
	
	@GET
	@Timed
	@Path("/{path}")
	public ServerStatus goNewResult(@PathParam("path") String pathName) {
		return new ServerStatus(counter.incrementAndGet(), pathName, port);
	}

}
