package edu.uci.ics.balancedbite.web.resources;

import java.io.IOException;
import java.text.SimpleDateFormat;
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

import edu.uci.ics.balancedbite.web.api.TimeManager;
import edu.uci.ics.balancedbite.web.api.UserInfo;
import edu.uci.ics.balancedbite.web.api.UserInformationRequest;
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
	
	/**
	 * This function will compute the current calories burned from walking using pedometer
	 * https://www.livestrong.com/article/238020-how-to-convert-pedometer-steps-to-calories/
	 * 
	 * @param weight weights in kg
	 * @param distanceWalked distance in miles
	 * @param stepCount step count currently
	 * @return calories burned currently
	 */
	public static int calculateCaloriesBurned(int weight, int distanceWalked, int stepCount) {
		if (distanceWalked == 0 || stepCount == 0) {
			return 0;
		}
		double weightInlbs = weight * 2.20462;
		double caloriesPerMile = 0.57 * weightInlbs;
		double stepsPerMile = (1 / distanceWalked) * stepCount;
		double caloriesPerStep = caloriesPerMile / stepsPerMile;
		return (int)(caloriesPerStep * stepCount);
	}
	
	
	@POST
	@Path("/fetch-user")
	@Consumes(MediaType.APPLICATION_JSON)
	public JsonNode fetchUserInformation(String userRequest) throws JsonParseException, JsonMappingException, IOException {
		
		// TODO: the request should contain distance walked and step count (per day)
		// 
		// https://www.livestrong.com/article/238020-how-to-convert-pedometer-steps-to-calories/
		//	How to include pedometer step count into calculating weights
//		System.out.println("Fetching user infomration");

		UserInformationRequest currentRequest = new ObjectMapper().readValue(userRequest, UserInformationRequest.class);
		String token = currentRequest.getToken();
//		System.out.println("token = " + token);
		System.out.println(new ObjectMapper().writeValueAsString(currentRequest));
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
		
		// update token time
		tokenCollection.updateOne(Filters.eq("token", token), Updates.set("time", 
				TimeManager.getInstance().getDateFormat().format(Calendar.getInstance().getTime())));
		
		String currentUser = userToken.getUsername();
		UserInfo currentUserInfo = userCollection.find(eq("username", currentUser)).first();
		if (currentUserInfo == null) {
			response.put("code", 0);
			client.close();
			return response;
		}
		
		int caloriesBurnedCurrenlty = calculateCaloriesBurned(currentUserInfo.getWeight(), 
				currentRequest.getStepCount(), currentRequest.getDistanceTraveled());
		currentUserInfo.setCaloriesNeeded(currentUserInfo.getCaloriesNeeded() + caloriesBurnedCurrenlty);
		
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
