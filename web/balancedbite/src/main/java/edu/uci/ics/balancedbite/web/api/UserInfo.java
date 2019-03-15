package edu.uci.ics.balancedbite.web.api;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserInfo {
	
	private String username;	
	private String password;
	private Integer caloriesTakenCurrently = 0;
	private List<String> foodsEatenCurrently = new ArrayList<> ();
	
	private Integer weight = 0; 
	private Integer height = 0;
	private Integer age = 0;
	private Integer caloriesNeeded = 0;
	private double BMI=0.0;
	
	
	private String sexes = "Male";
	private Integer bodyFat = 0;
	private String foodRestriction = "None";
	private List<String> allergies = new ArrayList<> ();
	private List<String> dislikeFoods = new ArrayList<> ();
	private List<String> healthProblems = new ArrayList<> ();
	private boolean workoutBoolean = false;
	private Integer workoutFrequency = 0;
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
	public Integer getCaloriesTakenCurrently() {
		return caloriesTakenCurrently;
	}
	
	@JsonProperty
	public List<String> getFoodsEatenCurrently() {
		return foodsEatenCurrently;
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
	public Integer getCaloriesNeeded() {
		return caloriesNeeded;
	}
	
	@JsonProperty
	public double getBMI () {
		return BMI;
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
	public List<String> getDislikeFoods() {
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
	public void setCaloriesTakenCurrently(Integer caloriesTakenCurrently) {
		this.caloriesTakenCurrently = caloriesTakenCurrently;
	}
	
	@JsonProperty
	public void setFoodsEatenCurrently(List<String> foodsEatenCurrently) {
		this.foodsEatenCurrently = foodsEatenCurrently;
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
	public void setCaloriesNeeded(Integer caloriesNeeded) {
		this.caloriesNeeded = caloriesNeeded;
	}
	
	@JsonProperty
	public void setBMI(double BMI) {
		this.BMI = BMI;
	}
	
	@JsonProperty
	public void setSexes(String sexes) {
		this.sexes = sexes;
	}
	
	@JsonProperty
	public void setBodyFat(Integer bodyFat) {
		this.bodyFat = bodyFat;
	}
	
	
	@JsonProperty
	public void setFoodRestriction (String foodRestriction) {
		this.foodRestriction = foodRestriction;
	}
	
	@JsonProperty
	public void setAllergies(List<String> allergies) {
		this.allergies = allergies;
	}
	
	@JsonProperty
	public void setDislikeFoods(List<String> dislikeFoods) {
		this.dislikeFoods =  dislikeFoods;
	}
	
	@JsonProperty
	public void setHealthProblems(List<String> healthProblems) {
		this.healthProblems = healthProblems;
	}
	
	@JsonProperty
	public void setWorkoutBoolean(boolean workoutBoolean) {
		this.workoutBoolean = workoutBoolean;
	}
	
	@JsonProperty
	public void setWorkoutFrequency(Integer workoutFrequency) {
		this.workoutFrequency = workoutFrequency;
	}
	
	@JsonProperty
	public void setWorkoutType(String workoutType) {
		this.workoutType = workoutType;
	}
	
}
