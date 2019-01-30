package edu.uci.ics.balancedbite.web.api;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserInfo {
	
	private String username;	
	private String password;
	
	private Integer weight = null; 
	private Integer height = null;
	private Integer age = null;
	
	private String sexes = "Male";
	private Integer bodyFat = null;
	private String foodRestriction = "None";
	private List<String> allergies = new ArrayList<> ();
	private List<String> dislikeFoods = new ArrayList<> ();
	private List<String> healthProblems = new ArrayList<> ();
	private boolean workoutBoolean = false;
	private Integer workoutFrequency = null;
	private String workoutType = "None";

	
	public UserInfo() {}
	
	public UserInfo(String username, String password) {
		this.username = username;
		this.password = password;
	}
	
	@JsonProperty
	public String getUsername() {
		return username;
	}
	
	@JsonProperty
	public String getPassword() {
		return password;
	}

	@JsonProperty
	public Integer getWeight() {
		return weight;
	}
	
	@JsonProperty
	public Integer getHeight() {
		return height;
	}
	
	@JsonProperty
	public Integer getAge() {
		return age;
	}
	
	@JsonProperty
	public String getSexes() {
		return sexes;
	}
	
	@JsonProperty
	public Integer getBodyFat() {
		return bodyFat;
	}
	
	
	@JsonProperty
	public String getFoodRestriction () {
		return foodRestriction;
	}
	
	@JsonProperty
	public List<String> getAllergies() {
		return allergies;
	}
	
	@JsonProperty
	public List<String> getDisklikeFoods() {
		return dislikeFoods;
	}
	
	@JsonProperty
	public List<String> getHealthProblems() {
		return healthProblems;
	}
	
	@JsonProperty
	public boolean getWorkoutBoolean() {
		return workoutBoolean;
	}
	
	@JsonProperty
	public Integer getWorkoutFrequency() {
		return workoutFrequency;
	}
	
	@JsonProperty
	public String getWorkoutType() {
		return workoutType;
	}
	
	
	// serialize
	
	
	@JsonProperty
	public void setUsername(String username) {
		this.username = username;
	}
	
	@JsonProperty
	public void setPassword(String password) {
		this.password = password;
	}
	
	@JsonProperty
	public void setWeight(Integer weight) {
		this.weight = weight;
	}
	
	@JsonProperty
	public void setHeight(Integer height) {
		this.height = height;
	}
	
	@JsonProperty
	public void setAge(Integer age) {
		this.age = age;
	}
	
	@JsonProperty
	public void setSexes(String sexes) {
		this.sexes = sexes;
	}
	
	@JsonProperty
	public void getBodyFat(Integer bodyFat) {
		this.bodyFat = bodyFat;
	}
	
	
	@JsonProperty
	public void getFoodRestriction (String foodRestriction) {
		this.foodRestriction = foodRestriction;
	}
	
	@JsonProperty
	public void getAllergies(List<String> allergies) {
		this.allergies = allergies;
	}
	
	@JsonProperty
	public void getDisklikeFoods(List<String> dislikeFoods) {
		this.dislikeFoods =  dislikeFoods;
	}
	
	@JsonProperty
	public void getHealthProblems(List<String> healthProblems) {
		this.healthProblems = healthProblems;
	}
	
	@JsonProperty
	public void getWorkoutBoolean(boolean workoutBoolean) {
		this.workoutBoolean = workoutBoolean;
	}
	
	@JsonProperty
	public void getWorkoutFrequency(Integer workoutFrequency) {
		this.workoutFrequency = workoutFrequency;
	}
	
	@JsonProperty
	public void getWorkoutType(String workoutType) {
		this.workoutType = workoutType;
	}
	
}
