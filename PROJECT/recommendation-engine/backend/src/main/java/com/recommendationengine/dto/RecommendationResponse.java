package com.recommendationengine.dto;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Top-level API response for recommendations including DSA statistics.
 */
public class RecommendationResponse {

    private boolean success;
    private String userId;
    private String userName;
    private int count;
    private ArrayList<MovieRecommendationDTO> recommendations = new ArrayList<>();
    private HashMap<String, Object> dsaStats = new HashMap<>();

    public RecommendationResponse() {}

    public RecommendationResponse(boolean success, String userId, String userName, 
                                  ArrayList<MovieRecommendationDTO> recommendations, 
                                  HashMap<String, Object> dsaStats) {
        this.success = success;
        this.userId = userId;
        this.userName = userName;
        this.recommendations = (recommendations != null) ? recommendations : new ArrayList<>();
        this.count = this.recommendations.size();
        this.dsaStats = (dsaStats != null) ? dsaStats : new HashMap<>();
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }

    public ArrayList<MovieRecommendationDTO> getRecommendations() { return recommendations; }
    public void setRecommendations(ArrayList<MovieRecommendationDTO> recommendations) {
        this.recommendations = (recommendations != null) ? recommendations : new ArrayList<>();
        this.count = this.recommendations.size();
    }

    public HashMap<String, Object> getDsaStats() { return dsaStats; }
    public void setDsaStats(HashMap<String, Object> dsaStats) { this.dsaStats = dsaStats; }
}
