package edu.uci.ics.balancedbite.web.resources;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.bson.Document;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

import edu.uci.ics.balancedbite.web.api.TimeManager;
import edu.uci.ics.balancedbite.web.api.UserInfo;
import edu.uci.ics.balancedbite.web.api.UserToken;
import edu.uci.ics.balancedbite.web.db.MongoDBRequest;

@Path("/sign-out")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.TEXT_PLAIN)
public class SignOutResource {
	
	private final String host;
	private final int port;
	
	public SignOutResource (String host, int port) {
		this.host = host;
		this.port = port;
	}
	
	@POST
	@Timed
	public JsonNode logOutAndDeleteToken(String token) 
			throws JsonParseException, JsonMappingException, IOException {
		
		// establish mongodb connection
		
		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB(host, port);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<UserToken> tokenCollection = MongoDBRequest.getInstance().getUserTokenCollection(database);
		
		UserToken foundToken = tokenCollection.find(eq("token", token)).first();

		ObjectNode response = new ObjectMapper().createObjectNode();
		if (foundToken == null) {
			response.put("code", 0);
			
			client.close();
			return response;
		}
		
		tokenCollection.deleteOne(eq("token", token));
		response.put("code", 1);
		client.close();
		return response;
	}
}
