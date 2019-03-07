package edu.uci.ics.balancedbite.loadData;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
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

import edu.uci.ics.balancedbite.web.api.Tag;
import edu.uci.ics.balancedbite.web.db.MongoDBRequest;

public class loadTags {
	
	public static List<Tag> readAllTags() throws JsonParseException, JsonMappingException, IOException {
		File file = new File("src/main/resources/foodData/available_tags.json");
		String[] allTagsCrawled = new ObjectMapper().readValue(file, String[].class);
		List<Tag> tagList = new ArrayList<Tag> ();
		for (String tagName: allTagsCrawled) {
			tagList.add(new Tag(tagName));
		}
		return tagList;
	}
	
	public static void insertTagsToDB(List<Tag> allTags) {
		MongoClient client = MongoDBRequest.getInstance().connectToMongoDB("localhost", 27017);
		MongoDatabase database = MongoDBRequest.getInstance().getMongoDatabase(client);
		MongoCollection<Tag> collections = MongoDBRequest.getInstance().getTagsCollection(database);
		
		collections.insertMany(allTags);	
		client.close();
	}
	
	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException, ParseException {
		insertTagsToDB(readAllTags());
	}
}
