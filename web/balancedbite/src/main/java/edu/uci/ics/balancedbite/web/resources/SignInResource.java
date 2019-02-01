package edu.uci.ics.balancedbite.web.resources;

import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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

import edu.uci.ics.balancedbite.web.api.UserInfo;
import edu.uci.ics.balancedbite.web.db.MongoDBRequest;

@Path("/sign-in")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SignInResource {
	
	private final String host;
	private final int port;
	
	public SignInResource (String host, int port) {
		this.host = host;
		this.port = port;
	}
	
	@POST
	@Timed
	public JsonNode checkLoginInformationExist(String userInformationJson) throws JsonParseException, JsonMappingException, IOException {
		
		System.out.println("show user information string");
		System.out.println(userInformationJson);
		
		// parse json string
		UserInfo userInfo = new ObjectMapper().readValue(userInformationJson, UserInfo.class);
		String username = userInfo.getUsername();
		String password = userInfo.getPassword();
		System.out.println("Username = " + username + " , password = " + password);
		
		// establish mongodb connection
		
		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB(host, port);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<UserInfo> collection = MongoDBRequest.getInstance().getUserInfoCollection(database);
		
		// check if the user exists in the database
		UserInfo currUserInfo = collection.find(and(eq("username", username), eq("password", password))).first();
		
		client.close();
		
		// return json object
		ObjectNode response = new ObjectMapper().createObjectNode();

		// if the user does not exist, then return a code 0
		if (currUserInfo == null) {
			response.put("code", 0);
			client.close();

			return response;
		}
		
		response.put("code", 1);
		client.close();
		return response;
	}
	
	
	public static void main(String[] args) throws IOException {
//		System.out.println("Hello world");
//		UserInfo test = new UserInfo("herny", "henry123");
//		String t1 = new ObjectMapper().writeValueAsString(test);
//		System.out.println(t1);
//		UserInfo t2 = new ObjectMapper().readValue(t1, UserInfo.class);
//		System.out.println(t2.getUsername());
//		System.out.println(t2.getPassword());
//		
//		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB("localhost", 27017);
//		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
//		MongoCollection<UserInfo> collection = MongoDBRequest.getInstance().getUserInfoCollection(database);
//		
////		UserLoginInfo user1 = new UserLoginInfo("sampleUser", "samplePassword");
////		collection.insertOne(user1);
//		
//		UserInfo t = collection.find(and(eq("username", "sampleUser"), eq("password", "samplePassword"))).first();
//		System.out.println(new ObjectMapper().writeValueAsString(t));
//		
//		FindIterable<UserInfo> a = collection.find(and(eq("username", "sampleUser"), eq("password", "samplePassword")));
//		for (UserInfo userInfo : a) {
//			System.out.println(new ObjectMapper().writeValueAsString(userInfo));
//		}
		
//		String test = "{\"username\":\"herny\",\"password\":\"henry123\"}";
//		
//		UserInfo t = new ObjectMapper().readValue(test, UserInfo.class);
//		
//		System.out.println(new ObjectMapper().writeValueAsString(t));
	}
}
