package edu.uci.ics.balancedbite.web.resources;

import java.io.IOException;
import java.util.Calendar;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;

import edu.uci.ics.balancedbite.web.api.FoodInfo;
import edu.uci.ics.balancedbite.web.api.TimeManager;
import edu.uci.ics.balancedbite.web.api.UserToken;
import edu.uci.ics.balancedbite.web.db.MongoDBRequest;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;
import static com.mongodb.client.model.Projections.*;

@Path("/recommendation")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class RecommendationResource {
	private final String host;
	private final int port;
	
	public RecommendationResource(String host, int port ) {
		this.host = host;
		this.port = port;
	}
	
	@POST
	public JsonNode getRecommendations(String request) throws JsonParseException, JsonMappingException, IOException {
		System.out.println(request);
		Map<String, Object> requestMap = new ObjectMapper().readValue(request, Map.class);
		String token = (String) requestMap.get("token");
		String mealType = (String) requestMap.get("mealType");
		int offset = (int) requestMap.get("offset");
		
		System.out.println("offset = " + offset);
		System.out.println("mealtype = " + mealType);

		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB(host, port);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<FoodInfo> foodCollection = MongoDBRequest.getInstance().getFoodInfoCollection(database);
		MongoCollection<UserToken> tokenCollection = MongoDBRequest.getInstance().getUserTokenCollection(database); 
		
		ObjectNode response = new ObjectMapper().createObjectNode();

		// check token
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
		FindIterable<FoodInfo> foundFoods = foodCollection.find(eq("meal_type", mealType)).skip(offset).limit(10);
		if (foundFoods == null) {
			response.put("code", 0);
			client.close();
			return response;
		}
				
		ArrayNode recommendations = new ObjectMapper().createArrayNode();
		for (FoodInfo food: foundFoods) {
			if (food.getImage_url() != null) {
				ObjectNode newFood = new ObjectMapper().createObjectNode();
				newFood.put("image_url", food.getImage_url());
				newFood.put("title", food.getTitle());
				newFood.put("avg_ratings", food.getAvg_rating());
				recommendations.add(newFood);	
			}
		}
		
		System.out.println("Found " + recommendations.size() + " foods to recommend");
				
		response.put("code", 1);
		response.put("recommendationsCount", recommendations.size());
		response.set("recommendations", recommendations);
		
		client.close();
		return response;
	}
	
	public static void main(String[] args) throws JsonProcessingException {
		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB("localhost", 27017);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<FoodInfo> foodCollection = MongoDBRequest.getInstance().getFoodInfoCollection(database);
		FindIterable<FoodInfo> foundFoods = foodCollection.find(eq("meal_type", "dinner")).limit(10);
		ArrayNode recommendations = new ObjectMapper().createArrayNode();
		for (FoodInfo food: foundFoods) {
			ObjectNode newFood = new ObjectMapper().createObjectNode();
			newFood.put("image_url", food.getImage_url());
			newFood.put("title", food.getTitle());
			newFood.put("avg_ratings", food.getAvg_rating());
			recommendations.add(newFood);
		}
		
		System.out.println(recommendations);
		System.out.println(recommendations.size());
	}
	
}

