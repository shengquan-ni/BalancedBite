package edu.uci.ics.balancedbite.web.db;

import java.util.Arrays;
import java.util.Iterator;

import org.bson.Document;
import org.bson.codecs.configuration.CodecRegistry;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.pojo.PojoCodecProvider;

import com.mongodb.client.MongoClient;
import com.mongodb.MongoCompressor;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import edu.uci.ics.balancedbite.web.api.UserLoginInfo;


public class MongoDBRequest {
	
	private static MongoDBRequest mongoDBRequest = null;
	
	private CodecRegistry pojoCodecRegistry;
	
	private static String username = "henry";
	private static String password = "henry123";
	private static String dbname = "balancedbite";
	
	
	public MongoDBRequest(CodecRegistry pojoCodec) {
		this.pojoCodecRegistry = pojoCodec;
	}
	
	public static MongoDBRequest getInstance() {
		if (mongoDBRequest == null) {
			CodecRegistry pojoCodec = fromRegistries(MongoClientSettings.getDefaultCodecRegistry(),
	                fromProviders(PojoCodecProvider.builder().automatic(true).build()));
			mongoDBRequest = new MongoDBRequest(pojoCodec);
		}
		
		return mongoDBRequest;
	}
	
	public MongoClient connectToMongoDB(String host, int port) {
		MongoCredential credential = MongoCredential.createCredential(username, dbname, password.toCharArray());
		MongoClientSettings settings = MongoClientSettings.builder()
				.credential(credential)
				.codecRegistry(pojoCodecRegistry)
				.applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(host, port))))
				.compressorList(Arrays.asList(MongoCompressor.createZlibCompressor()))
				.build();
		MongoClient newClient = MongoClients.create(settings);
	    return newClient;
	}
	
	public MongoDatabase getMongoDatabase(MongoClient client) {
		return client.getDatabase(dbname);
	}
	
	public MongoCollection<UserLoginInfo> getUserInfoCollection(MongoDatabase database) {
		return database.getCollection("UserInfo", UserLoginInfo.class);
	}

}
