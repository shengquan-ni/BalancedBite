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

import edu.uci.ics.balancedbite.web.api.UserInfo;
import edu.uci.ics.balancedbite.web.api.UserToken;
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
	public JsonNode checkLoginInformationExist(String userInformationJson) 
			throws JsonParseException, JsonMappingException, IOException {
		
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
		
		// return json object
		ObjectNode response = new ObjectMapper().createObjectNode();

		// if the user does not exist, then return a code 0
		if (currUserInfo == null) {
			response.put("code", 0);
		} else {
			String randomID = UUID.randomUUID().toString();
			String currentTime = new SimpleDateFormat("yyyyMMdd_HHmmss").format(Calendar.getInstance().getTime());
			UserToken newToken = new UserToken(randomID, username, currentTime);
			MongoCollection<UserToken> tokenCollection = MongoDBRequest.getInstance().getUserTokenCollection(database);
			tokenCollection.insertOne(newToken);
			
			
			response.put("code", 1);
			response.put("token", randomID);
			
			System.out.println("Finish");			
		}
		
		client.close();
		return response;
	}
	
	
	public static void main(String[] args) throws IOException, InterruptedException, ParseException {
//		SimpleDateFormat format = new SimpleDateFormat("yy/MM/dd HH:mm:ss");  
//		String dateStart = "11/03/14 09:29:58";
//		String dateStop = "11/03/15 09:33:43";
//		Date d1 = null;
//		Date d2 = null;
//	    d1 = format.parse(dateStart);
//	    d2 = format.parse(dateStop);
//	    long diff = d2.getTime() - d1.getTime();
//	    long diffSeconds = diff / 1000 % 60;  
//	    long diffMinutes = diff / (60 * 1000) % 60; 
//	    long diffHours = diff / (60 * 60 * 1000) % 60;
//	    long days = diff / (24 * 60 * 60 * 1000);
//	    System.out.println("Time in seconds: " + diffSeconds + " seconds.");         
//	    System.out.println("Time in minutes: " + diffMinutes + " minutes.");         
//	    System.out.println("Time in hours: " + diffHours + " hours."); 
//	    System.out.println("Time in days: " + days + " days."); 
//		Date diff2 = new Date(d2.getTime() - d1.getTime());
//		
//		Calendar calendar = Calendar.getInstance();
//		calendar.setTime(diff2);
//		int hours = calendar.get(Calendar.HOUR_OF_DAY);
//		int minutes = calendar.get(Calendar.MINUTE);
//		int seconds = calendar.get(Calendar.SECOND);
//		System.out.println(hours);
//		System.out.println(minutes);
//		System.out.println(seconds);
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
//		UserInfo t = collection.find().first();
//		System.out.println(new ObjectMapper().writeValueAsString(t));
//		
////		UserLoginInfo user1 = new UserLoginInfo("sampleUser", "samplePassword");
////		collection.insertOne(user1);
//		
//		UserInfo t = collection.find(and(eq("username", "henrychen02200"), eq("password", "henrychen0220"))).first();
//		System.out.println(new ObjectMapper().writeValueAsString(t));
//		
//		UserToken newToken = new UserToken("random");
//		MongoCollection<UserToken> tokenCollection = MongoDBRequest.getInstance().getUserTokenCollection(database);
//		tokenCollection.insertOne(newToken);
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
