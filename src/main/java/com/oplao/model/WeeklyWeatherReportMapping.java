package com.oplao.model;

public class WeeklyWeatherReportMapping {

    private int dayOfMonth;
    private String monthOfYear;
    private String dayOfWeek;
    private String time;
    private String weatherUrl;
    private int temperatureC;
    private int temperatureF;
    private int feelsLikeC;
    private int feelsLikeF;
    private double precipChance;
    private double precip;
    private int windM;
    private int windKm;
    private int gustM;
    private int gustKmh;
    private int pressure;


    public WeeklyWeatherReportMapping(){

    }
    public WeeklyWeatherReportMapping(int dayOfMonth, String monthOfYear, String dayOfWeek, String time, String weatherUrl, int temperatureC,
                                      int temperatureF, int feelsLikeC, int feelsLikeF,
                                      double precipChance, double precip,
                                      int windM,
                                      int windKm,
                                      int gustM, int gustKmh, int pressure){
        this.dayOfMonth = dayOfMonth;
        this.monthOfYear = monthOfYear;
        this.dayOfWeek = dayOfWeek;
        this.time = time;
        this.weatherUrl = weatherUrl;
        this.temperatureC = temperatureC;
        this.temperatureF = temperatureF;
        this.feelsLikeC = feelsLikeC;
        this.feelsLikeF = feelsLikeF;
        this.precipChance = precipChance;
        this.precip = precip;
        this.windM = windM;
        this.windKm = windKm;
        this.gustM = gustM;
        this.gustKmh = gustKmh;
        this.pressure = pressure;
    }

    public int getDayOfMonth() {
        return dayOfMonth;
    }

    public void setDayOfMonth(int dayOfMonth) {
        this.dayOfMonth = dayOfMonth;
    }

    public String getMonthOfYear() {
        return monthOfYear;
    }

    public void setMonthOfYear(String monthOfYear) {
        this.monthOfYear = monthOfYear;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getWeatherUrl() {
        return weatherUrl;
    }

    public void setWeatherUrl(String weatherUrl) {
        this.weatherUrl = weatherUrl;
    }

    public int getTemperatureC() {
        return temperatureC;
    }

    public void setTemperatureC(int temperatureC) {
        this.temperatureC = temperatureC;
    }

    public int getTemperatureF() {
        return temperatureF;
    }

    public void setTemperatureF(int temperatureF) {
        this.temperatureF = temperatureF;
    }

    public int getFeelsLikeC() {
        return feelsLikeC;
    }

    public void setFeelsLikeC(int feelsLikeC) {
        this.feelsLikeC = feelsLikeC;
    }

    public int getFeelsLikeF() {
        return feelsLikeF;
    }

    public void setFeelsLikeF(int feelsLikeF) {
        this.feelsLikeF = feelsLikeF;
    }

    public double getPrecipChance() {
        return precipChance;
    }

    public void setPrecipChance(double precipChance) {
        this.precipChance = precipChance;
    }

    public double getPrecip() {
        return precip;
    }

    public void setPrecip(double precip) {
        this.precip = precip;
    }

    public int getWindM() {
        return windM;
    }

    public void setWindM(int windM) {
        this.windM = windM;
    }

    public int getWindKm() {
        return windKm;
    }

    public void setWindKm(int windKm) {
        this.windKm = windKm;
    }

    public int getGustM() {
        return gustM;
    }

    public void setGustM(int gustM) {
        this.gustM = gustM;
    }

    public int getGustKmh() {
        return gustKmh;
    }

    public void setGustKmh(int gustKmh) {
        this.gustKmh = gustKmh;
    }

    public int getPressure() {
        return pressure;
    }

    public void setPressure(int pressure) {
        this.pressure = pressure;
    }
}