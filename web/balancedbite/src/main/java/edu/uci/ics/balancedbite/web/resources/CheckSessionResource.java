package edu.uci.ics.balancedbite.web.resources;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import edu.uci.ics.balancedbite.web.api.UserToken;
import edu.uci.ics.balancedbite.web.db.MongoDBRequest;


import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@Path("/check-session")
@Consumes(MediaType.TEXT_PLAIN)
@Produces(MediaType.APPLICATION_JSON)
public class CheckSessionResource {
	
	private final String host;
	private final int port;
	
	public CheckSessionResource (String host, int port) {
		this.host = host;
		this.port = port;
	}
	
	@POST
	@Timed
	public JsonNode checkSessionTokenExist(String tokenInformation) throws JsonParseException, JsonMappingException, 
			IOException, ParseException {
		String currToken = tokenInformation;
		
		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB(host, port);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<UserToken> tokenCollection = MongoDBRequest.getInstance().getUserTokenCollection(database);
		UserToken foundToken = tokenCollection.find(eq("token", currToken)).first();
		
		ObjectNode response = new ObjectMapper().createObjectNode();
		if (foundToken == null) {
			response.put("code", 0);
			
			client.close();
			return response;
		}
		
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
		Date currentTime = Calendar.getInstance().getTime();
		Date tokenCreateTime = dateFormat.parse(foundToken.getTime());
		
		long timeDifferenceInMinutes = (currentTime.getTime() - tokenCreateTime.getTime()) / (1000 * 60) % 60;
		
		System.out.println("Time diff = " + timeDifferenceInMinutes);
		
		// if token is 30 minutes old:
		if (timeDifferenceInMinutes >= 30) {
			tokenCollection.deleteOne(eq("token", currToken));
			response.put("code", 0);
			client.close();
			
			return response;
		}
		
		response.put("code", 1);
		
		client.close();
		return response;
	}
	
	
	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException, ParseException {
//		String test = "{\"token\":\"e47f1186-f548-4d02-aa62-95e17e1bfd08\"}";
//		UserToken frontendToken = new ObjectMapper().readValue(test, UserToken.class);
//		
//		System.out.println(new ObjectMapper().writeValueAsString(frontendToken));
		
//		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
//		Date currentTime = Calendar.getInstance().getTime();
//		Date tokenCreateTime = dateFormat.parse("20190305_095500");
//		
//		long timeDifferenceInMinutes = (currentTime.getTime() - tokenCreateTime.getTime()) / (1000 * 60) % 60;
//		System.out.println(timeDifferenceInMinutes);
//		System.out.println(currentTime.getTime());
//		System.out.println(currentTime.getTime() - tokenCreateTime.getTime());
		
	}
}
