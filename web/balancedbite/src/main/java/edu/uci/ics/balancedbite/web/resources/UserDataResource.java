package edu.uci.ics.balancedbite.web.resources;

import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import edu.uci.ics.balancedbite.web.api.UserInfo;
import edu.uci.ics.balancedbite.web.api.UserToken;
import edu.uci.ics.balancedbite.web.db.MongoDBRequest;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class UserDataResource {
	
	private final String host;
	private final int port;
	
	public UserDataResource(String host, int port) {
		this.host = host;
		this.port = port;
	}
	
	
	@POST
	@Path("/fetch-user")
	@Consumes(MediaType.TEXT_PLAIN)
	public JsonNode fetchUserInformation(String token) throws JsonParseException, JsonMappingException, IOException {
		System.out.println("token = " + token);
		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB(host, port);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<UserToken> tokenCollection = MongoDBRequest.getInstance().getUserTokenCollection(database); 
		MongoCollection<UserInfo> userCollection = MongoDBRequest.getInstance().getUserInfoCollection(database); 
		
		UserToken userToken = tokenCollection.find(eq("token", token)).first();
		ObjectNode response = new ObjectMapper().createObjectNode();
		if (userToken == null) {
			response.put("code", 0);
			client.close();
			return response;
		}
		
		String currentUser = userToken.getUsername();
		UserInfo currentUserInfo = userCollection.find(eq("username", currentUser)).first();
		if (currentUserInfo == null) {
			response.put("code", 0);
			client.close();
			return response;
		}
		
		ObjectNode userObject = new ObjectMapper().valueToTree(currentUserInfo);
		response.put("code", 1);
		response.set("user", userObject);
		return userObject;
		
	}
	
	
	@POST
	@Path("/update-user")
	@Consumes(MediaType.APPLICATION_JSON)
	public JsonNode updateUserInformation(String token) throws JsonParseException, JsonMappingException, IOException {
		System.out.println("token = " + token);

		return null;
	}
	
}
