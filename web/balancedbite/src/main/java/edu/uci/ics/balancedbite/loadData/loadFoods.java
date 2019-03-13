package edu.uci.ics.balancedbite.loadData;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import edu.uci.ics.balancedbite.web.api.FoodInfo;
import edu.uci.ics.balancedbite.web.db.MongoDBRequest;

// mvn exec:java -Dexec.mainClass="edu.uci.ics.balancedbite.loadData.loadFoods"  
public class loadFoods {
	public static List<FoodInfo> readAllFoods(String fileName) throws JsonParseException, JsonMappingException, IOException {
		String filePath = "src/main/resources/foodData/" + fileName + ".json";
		File file = new File(filePath);
		FoodInfo[] allFoodCrawled = new ObjectMapper().readValue(file, FoodInfo[].class);
		List<FoodInfo> foodList = Arrays.asList(allFoodCrawled);
		return foodList;
	}
	
	public static void insertFoodsToDB(List<FoodInfo> allFoods) {
		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB("localhost", 27017);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<FoodInfo> collections = MongoDBRequest.getInstance().getFoodInfoCollection(database);
		collections.insertMany(allFoods);	
		client.close();
	}
	
	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException, ParseException {		
		List<String> foodFilesName = new ArrayList<String> ();
		foodFilesName.add("breakfast");
		foodFilesName.add("lunch");
		foodFilesName.add("dinner");
		foodFilesName.add("other");
		for (String fileName : foodFilesName) {
			insertFoodsToDB(readAllFoods(fileName));
		}
	}
}
