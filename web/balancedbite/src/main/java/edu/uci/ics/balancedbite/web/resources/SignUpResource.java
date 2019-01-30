package edu.uci.ics.balancedbite.web.resources;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.io.IOException;

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

import edu.uci.ics.balancedbite.web.api.UserInfo;
import edu.uci.ics.balancedbite.web.db.MongoDBRequest;

@Path("/sign-up")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class SignUpResource {

	private final String host;
	private final int port;
	
	public SignUpResource(String host, int port) {
		this.host = host;
		this.port = port;
	}
	
	@POST
	@Timed
	public JsonNode signUpNewUser(String newUserMetaData) throws JsonParseException, JsonMappingException, IOException {
		
		System.out.println("Sign up new user");
		System.out.println(newUserMetaData);
		
		UserInfo userInfo = new ObjectMapper().readValue(newUserMetaData, UserInfo.class);
		String username = userInfo.getUsername();
		String password = userInfo.getPassword();
		
		// establish mongodb connection
		
		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB(host, port);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<UserInfo> collection = MongoDBRequest.getInstance().getUserInfoCollection(database);
		
		// check if the user exists in the database
		UserInfo currUserInfo = collection.find(and(eq("username", username), eq("password", password))).first();
		
		// generate response
		ObjectNode response = new ObjectMapper().createObjectNode();
		
		if (currUserInfo == null) {
			// if the user does not exist, insert the user into the database
			collection.insertOne(userInfo);
			response.put("code", 1);

		} else {
			response.put("code", 0);
		}
		
		client.close();
		return response;
	}
	
	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException {
		String test = "{\"username\":\"sushi\",\"password\":\"sushi\",\"weight\":\"20\",\"height\":\"30\",\"workoutBoolean\":true,\"sexes\":\"female\",\"age\":\"14\",\"bodyFat\":\"1\",\"foodRestriction\":\"Vegan\",\"workoutFrequency\":\"7\",\"workoutType\":\"Cardio\",\"healthProblems\":[\"diabetes\",\" sushiSickness\"],\"allergies\":[\"human\"],\"dislikeFoods\":[\"you\"]}";
		UserInfo info = new ObjectMapper().readValue(test, UserInfo.class);
		
		System.out.println(new ObjectMapper().writeValueAsString(info));
		
		
		UserInfo userInfo = new ObjectMapper().readValue(test, UserInfo.class);
		String username = userInfo.getUsername();
		String password = userInfo.getPassword();
		System.out.println("Username = " + username + " , password = " + password);
		
		// establish mongodb connection
		
		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB("localhost", 27017);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<UserInfo> collection = MongoDBRequest.getInstance().getUserInfoCollection(database);
		
		// check if the user exists in the database
		UserInfo currUserInfo = collection.find(and(eq("username", username), eq("password", password))).first();
		
		// generate response
		ObjectNode response = new ObjectMapper().createObjectNode();
		
		if (currUserInfo == null) {
			// if the user does not exist, insert the user into the database
			collection.insertOne(userInfo);
			response.put("code", 1);
		} 
	}
}
