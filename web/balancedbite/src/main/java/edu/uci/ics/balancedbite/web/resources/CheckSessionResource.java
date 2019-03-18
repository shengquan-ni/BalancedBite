package edu.uci.ics.balancedbite.web.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
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
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;

import edu.uci.ics.balancedbite.web.api.TimeManager;
import edu.uci.ics.balancedbite.web.api.UserInfo;
import edu.uci.ics.balancedbite.web.api.UserToken;
import edu.uci.ics.balancedbite.web.db.MongoDBRequest;


import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
		
		SimpleDateFormat dateFormat = TimeManager.getInstance().getDateFormat();
		Date currentTime = Calendar.getInstance().getTime();
		Date tokenCreateTime = dateFormat.parse(foundToken.getTime());
				
	    long diff = currentTime.getTime() - tokenCreateTime.getTime();
	    long days = diff / (24 * 60 * 60 * 1000);
	    
		System.out.println("Time diff = " + days + " days");
		
		// if token is 1 day old:
		if (days >= 1) {
			tokenCollection.deleteOne(eq("token", currToken));
			response.put("code", 0);
			client.close();
			return response;
		}
		
		// check if current time is the same day as last token access, if it is not, 
		//	reset foodsEatenCurrently and caloriesTakenCurrently

		if (!TimeManager.getInstance().checkSameDay(currentTime, tokenCreateTime)) {
			// not the same day
			MongoCollection<UserInfo> userCollection = MongoDBRequest.getInstance().getUserInfoCollection(database);
			userCollection.updateOne(Filters.eq("username", foundToken.getUsername())
					, Updates.combine( Updates.set("caloriesTakenCurrently", 0), Updates.set("foodsEatenCurrently", new ArrayList<>())));
		}
		
		// update token time to current time
		tokenCollection.updateOne(Filters.eq("token", currToken), Updates.set("time", dateFormat.format(currentTime)));
		response.put("code", 1);
		return response;
	}
	
}
