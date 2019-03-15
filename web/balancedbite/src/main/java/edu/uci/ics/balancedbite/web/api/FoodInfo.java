package edu.uci.ics.balancedbite.web.api;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FoodInfo {
	
	private List<String> index = new ArrayList<String>();
	private String title;
	private int avg_rating;
	private List<FoodComment> comments = new ArrayList<FoodComment>();
	private List<String> related = new ArrayList<String>();
	private String tips;
	private double cals;
	private String total_time;
	private String prep_time;
	private String servings;
	private List<String> ingredients = new ArrayList<String>();
	private List<String> tags = new ArrayList<String>();
	private String summary;
	private String author;
	private String source;
	private List<String> instructions = new ArrayList<String>();
	private String image_url;
	private String meal_type="other";

	
	public FoodInfo() {	}
	
	@JsonProperty
	public List<String> getIndex() {
		return index;
	}
	
	@JsonProperty
	public String getTitle() {
		return title;
	}
	
	@JsonProperty
	public int getAvg_rating () {
		return avg_rating;
	}
	
	@JsonProperty
	public List<FoodComment> getComments() {
		return comments;
	}
	
	@JsonProperty
	public List<String> getRelated() {
		return related;
	}
	
	@JsonProperty
	public String getTips() {
		return tips;
	}
	
	@JsonProperty
	public double getCals() {
		return cals;
	}
	
	@JsonProperty
	public String getTotal_time() {
		return total_time;
	}
	
	@JsonProperty
	public String getPrep_time() {
		return prep_time;
	}
	
	@JsonProperty
	public String getServings() {
		return servings;
	}
	
	@JsonProperty
	public List<String> getIngredients() {
		return ingredients;
	}
	
	@JsonProperty
	public List<String> getTags() {
		return tags;
	}
	
	@JsonProperty
	public String getSummary() {
		return summary;
	}
	
	@JsonProperty
	public String getAuthor() {
		return author;
	}
	
	@JsonProperty
	public String getSource() {
		return source;
	}
	
	@JsonProperty
	public List<String> getInstructions() {
		return instructions;
	}
	
	@JsonProperty
	public String getImage_url() {
		return image_url;
	}

	@JsonProperty
	public String getMeal_type() {
		return meal_type;
	}
	
	// deserialize
	
	@JsonProperty
	public void setIndex(List<String> index) {
		this.index = index;
	}
	
	@JsonProperty
	public void setTitle(String title) {
		this.title = title;
	}
	
	@JsonProperty
	public void setAvg_rating (int avg_rating) {
		this.avg_rating = avg_rating;
	}
	
	@JsonProperty
	public void setComments(List<FoodComment> comments) {
		this.comments = comments;
	}
	
	@JsonProperty
	public void setRelated(List<String> related) {
		this.related = related;
	}
	
	@JsonProperty
	public void setTips(String tips) {
		this.tips = tips;
	}
	
	@JsonProperty
	public void setCals(double cals) {
		this.cals = cals;
	}
	
	@JsonProperty
	public void setTotal_time(String total_time) {
		this.total_time = total_time;
	}
	
	@JsonProperty
	public void setPrep_time(String prep_time) {
		this.prep_time = prep_time;
	}
	
	@JsonProperty
	public void setServings(String servings) {
		this.servings = servings;
	}
	
	@JsonProperty
	public void setIngredients(List<String> ingredients) {
		this.ingredients = ingredients;
	}
	
	@JsonProperty
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	
	@JsonProperty
	public void setSummary(String summary) {
		this.summary = summary;
	}
	
	@JsonProperty
	public void setAuthor(String author) {
		this.author = author;
	}
	
	@JsonProperty
	public void setSource(String source) {
		this.source = source;
	}
	
	@JsonProperty
	public void setInstructions(List<String> instructions) {
		this.instructions = instructions;
	}
	
	@JsonProperty
	public void setImage_url(String image_url) {
		this.image_url = image_url;
	}

	@JsonProperty
	public void setMeal_type(String meal_type) {
		this.meal_type = meal_type;
	}
	
	
}
