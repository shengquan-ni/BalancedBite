package edu.uci.ics.balancedbite.web.resources;

import java.io.IOException;
import java.util.Calendar;

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
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;

import edu.uci.ics.balancedbite.web.api.FoodDetailRequest;
import edu.uci.ics.balancedbite.web.api.FoodInfo;
import edu.uci.ics.balancedbite.web.api.TimeManager;
import edu.uci.ics.balancedbite.web.api.UserToken;
import edu.uci.ics.balancedbite.web.db.MongoDBRequest;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

@Path("/food-detail")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class LoadFoodDetailResource {
	private final String host;
	private final int port;
	
	public LoadFoodDetailResource(String host, int port ) {
		this.host = host;
		this.port = port;
	}
	
	@POST
	public JsonNode fetchFoodDetail(String request) throws JsonParseException, JsonMappingException, IOException {
		System.out.println(request);
		FoodDetailRequest foodRequest = new ObjectMapper().readValue(request, FoodDetailRequest.class);
		System.out.println(new ObjectMapper().writeValueAsString(foodRequest));
				
		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB(host, port);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<FoodInfo> foodCollection = MongoDBRequest.getInstance().getFoodInfoCollection(database);
		MongoCollection<UserToken> tokenCollection = MongoDBRequest.getInstance().getUserTokenCollection(database); 
		
		ObjectNode response = new ObjectMapper().createObjectNode();

		// check token
		String token = foodRequest.getToken();
		UserToken userToken = tokenCollection.find(eq("token", token)).first();
		if (userToken == null) {
			response.put("code", 0);
			client.close();
			return response;
		}
		
		// update token time
		tokenCollection.updateOne(Filters.eq("token", token), Updates.set("time", 
				TimeManager.getInstance().getDateFormat().format(Calendar.getInstance().getTime())));
		
		// fetch food info
		FoodInfo foundFood = foodCollection.find(eq("title", foodRequest.getName())).first();
		if (foundFood == null) {
			response.put("code", 0);
			client.close();
			return response;
		}
		
		response.put("code", 1);
		response.set("food", new ObjectMapper().valueToTree(foundFood));
		
		client.close();
		return response;
	}
	
}
