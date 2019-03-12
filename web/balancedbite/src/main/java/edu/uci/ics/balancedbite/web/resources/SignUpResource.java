package edu.uci.ics.balancedbite.web.resources;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

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
import com.mongodb.async.SingleResultCallback;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.InsertOneOptions;

import edu.uci.ics.balancedbite.web.api.TimeManager;
import edu.uci.ics.balancedbite.web.api.UserInfo;
import edu.uci.ics.balancedbite.web.api.UserToken;
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
	
	public static double calculateBMI(int weight, int height) {
		double heightInMeter = height / 100.0;
		return weight / Math.pow(heightInMeter, 2);
	}
	
	
	/**
	 * Adult male: 66 + (6.3 x body weight in lbs.) + (12.9 x height in inches) - (6.8 x age in years) = BMR 
	 * Adult female: 655 + (4.3 x weight in lbs.) + (4.7 x height in inches) - (4.7 x age in years) = BMR
	 * 
	 * kg = 1 : 2.20462 = lb
	 * cm = 1 : 0.393701 = inches
	 * 
	 * @param sexes user sex
	 * @param weight user weight
	 * @param height user height
	 * @param age user age
	 * @return user calculated BMR
	 */
	public static double calculateBMR(String sexes, int weight, int height, int age) {
		double weightInlbs = weight * 2.20462;
		double heightInInches = height * 0.393701;
		
		if (sexes.equals("male") || sexes.equals("Male")) {
			return 66 + (6.3 * weightInlbs) + (12.9 * heightInInches) - (6.8 * age);
		} else {
			return 655 + (4.3 * weightInlbs) + (4.7 * heightInInches) - (4.7 * age);
		}
	}
	
	
	/**
	 * http://www.checkyourhealth.org/eat-healthy/cal_calculator.php
	 * 
	 * If you are sedentary (little or no exercise) : Calorie-Calculation = BMR x 1.2
	 * If you are lightly active (light exercise/sports 1-3 days/week) : Calorie-Calculation = BMR x 1.375
	 * If you are moderately active (moderate exercise/sports 3-5 days/week) : Calorie-Calculation = BMR x 1.55
	 * If you are very active (hard exercise/sports 6-7 days a week) : Calorie-Calculation = BMR x 1.725
	 * Otherwise: BMR x 1.9
	 * 
	 * @param sexes user sex
	 * @param weight user weight
	 * @param height user height
	 * @param age user age
	 * @param workoutFreq user workout frequency
	 * @return user calories needed daily
	 */
	public static int calculateCalories(String sexes, int weight, int height, int age, int workoutFreq) {
		double BMR = calculateBMR(sexes, weight, height, age);
		if (workoutFreq < 1) {
			return (int) (BMR * 1.2);
		} else if (workoutFreq <= 3) {
			return (int) (BMR * 1.375);

		} else if (workoutFreq <= 5) {
			return (int) (BMR * 1.55);

		} else if (workoutFreq <= 7) {
			return (int) (BMR * 1.725);
		} else {
			return (int) (BMR * 1.9);
		}
	}
	
	@POST
	@Timed
	public JsonNode signUpNewUser(String newUserMetaData) throws JsonParseException, JsonMappingException, 
			IOException, InterruptedException, ExecutionException {
		
		System.out.println("Sign up new user");
		System.out.println(newUserMetaData);
		
		UserInfo userInfo = new ObjectMapper().readValue(newUserMetaData, UserInfo.class);
		String username = userInfo.getUsername();
		String password = userInfo.getPassword();
		
		double userBMI = calculateBMI(userInfo.getWeight(), userInfo.getHeight());
		int userCaloricIntake = calculateCalories(userInfo.getSexes(), userInfo.getWeight(), userInfo.getHeight(), 
				userInfo.getAge(), userInfo.getWorkoutFrequency());
		userInfo.setBMI(userBMI);
		userInfo.setCaloriesNeeded(userCaloricIntake);
		
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
			String randomID = UUID.randomUUID().toString();
			String currentTime = TimeManager.getInstance().getDateFormat().format(Calendar.getInstance().getTime());
			UserToken newToken = new UserToken(randomID, username, currentTime);
			MongoCollection<UserToken> tokenCollection = MongoDBRequest.getInstance().getUserTokenCollection(database);
			tokenCollection.insertOne(newToken);

			response.put("code", 1);
			response.put("token", randomID);
		} else {
			response.put("code", 0);
		}
		
		client.close();
		return response;
	}
	
	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException {
//		System.out.println(calculateCalories("Female", 62, 168, 21, 0));
//		String test = "{\"username\":\"sushi\",\"password\":\"sushi\",\"weight\":\"20\",\"height\":\"30\",\"workoutBoolean\":true,\"sexes\":\"female\",\"age\":\"14\",\"bodyFat\":\"1\",\"foodRestriction\":\"Vegan\",\"workoutFrequency\":\"7\",\"workoutType\":\"Cardio\",\"healthProblems\":[\"diabetes\",\" sushiSickness\"],\"allergies\":[\"human\"],\"dislikeFoods\":[\"you\"]}";
//		UserInfo info = new ObjectMapper().readValue(test, UserInfo.class);
//		
//		System.out.println(new ObjectMapper().writeValueAsString(info));
//		
//		
//		UserInfo userInfo = new ObjectMapper().readValue(test, UserInfo.class);
//		String username = userInfo.getUsername();
//		String password = userInfo.getPassword();
//		System.out.println("Username = " + username + " , password = " + password);
//		
//		// establish mongodb connection
//		
//		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB("localhost", 27017);
//		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
//		MongoCollection<UserInfo> collection = MongoDBRequest.getInstance().getUserInfoCollection(database);
//		
//		// check if the user exists in the database
//		UserInfo currUserInfo = collection.find(and(eq("username", username), eq("password", password))).first();
//		
//		// generate response
//		ObjectNode response = new ObjectMapper().createObjectNode();
//		
//		if (currUserInfo == null) {
//			// if the user does not exist, insert the user into the database
//			collection.insertOne(userInfo);
//			response.put("code", 1);
//		} 
	}
}
