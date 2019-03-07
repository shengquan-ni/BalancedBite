package edu.uci.ics.balancedbite.web.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FoodComment {
	
	private int rating;
	private String author;
	private String date;
	private String comment;
	
	public FoodComment() { }
	
	@JsonProperty
	public int getRating() {
		return rating;
	}
	
	@JsonProperty
	public String getAuthor() {
		return author;
	}
	
	@JsonProperty
	public String getDate() {
		return date;
	}
	
	@JsonProperty
	public String getComment() {
		return comment;
	}
	
	@JsonProperty
	public void setRating(int rating) {
		this.rating = rating;
	}
	
	@JsonProperty
	public void setAuthor(String author) {
		this.author = author;
	}
	
	@JsonProperty
	public void setDate(String date) {
		this.date = date;
	}
	
	@JsonProperty
	public void setComment(String comment) {
		this.comment = comment;
	}
}
