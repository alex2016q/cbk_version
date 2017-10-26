package com.oplao.service;

import com.oplao.Utils.AddressGetter;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.*;

@Service
public class SearchService {
    public static final String cookieName = "lastCitiesVisited";
    public List<HashMap> findSearchOccurences(String searchRequest){
        List list = null;
        if((Character.isDigit(searchRequest.trim().charAt(0)) || Character.isDigit(searchRequest.trim().charAt(1))) && searchRequest.contains(",")){
            String [] parsedRequest = searchRequest.split(",");
            String lat = "";
            String lon = "";
            if(parsedRequest.length==4){
                lat= parsedRequest[0].trim() + "." + parsedRequest[1].replaceAll("°", "").trim();
                lon = parsedRequest[2].trim() +"." +parsedRequest[3].replaceAll("°", "").trim();
            }else {
                lat = parsedRequest[0].replace(",", ".").replaceAll("°", "").trim();
                try {
                    lon = parsedRequest[1].replaceAll(",", ".").replaceAll("°", "").trim();
                }catch (ArrayIndexOutOfBoundsException e){
                }
            }

            if(lat.contains(".")&& lon.contains(".")) {
                list = findByCoordinates(lat, lon);
            }else {
                return null;
            }
        }else if(searchRequest.length()==3 && Objects.equals(searchRequest, searchRequest.toUpperCase())) {
            list = findByAirports(searchRequest);
        }
        else {
            try {
                list = findByCity(searchRequest);
            }catch (NullPointerException e){
            }
        }
        try {
            List<HashMap> maps = new ArrayList<>();
            for (int i = 0; i < list.size(); i++) {
                maps.add((HashMap) ((JSONObject) list.get(i)).toMap());
            }
            return maps;
        }catch (NullPointerException e){
        }
        return new ArrayList<>();
    }


    public HashMap selectCity(int geonameId, String currentCookieValue, HttpServletRequest request, HttpServletResponse response){
        List<JSONObject> list = null;
        JSONObject city = null;
        try{
            try {
                list = findByGeonameId(geonameId);
                city = list.get(0);
            }catch (Exception e){
                list = findByGeonameIdAirports(geonameId);
                city = list.get(0);
            }

            city.put("status", "selected");
            JSONArray arr = new JSONArray(currentCookieValue);
            for (int i = 0; i < arr.length(); i++) {
                arr.getJSONObject(i).put("status", "unselected");
            }

            if(checkDuplicateCookie(request, response,city) != 0) {
                if(arr.length()>4){
                    arr.remove(4);
                    arr.put(4, city);
                }else{
                    arr.put(city);
                }
                clearCookies(request, response);

                Cookie c = new Cookie(SearchService.cookieName, arr.toString());
                c.setMaxAge(60 * 60 * 24);
                c.setPath("/");
                response.addCookie(c);

                return (HashMap)city.toMap();
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return (HashMap)city.toMap();
    }


    private int checkDuplicateCookie(HttpServletRequest request, HttpServletResponse response,
                                     JSONObject city){
        for (int i = 0; i < request.getCookies().length; i++) {
            if(request.getCookies()[i].getName().equals(SearchService.cookieName)){
                JSONArray array = new JSONArray(request.getCookies()[i].getValue());
                for (int j = 0; j < array.length(); j++) {
                    if(Objects.equals("" + (array.getJSONObject(j)).get("geonameId"),
                            "" + city.get("geonameId"))){
                        setCitySelected(array, j);
                        clearCookies(request, response);

                        Cookie c = new Cookie(SearchService.cookieName, array.toString());
                        c.setMaxAge(60 * 60 * 24);
                        c.setPath("/");
                        response.addCookie(c);

                        return 0;
                    }
                }
            }
        }
        return 1;
    }

    private void setCitySelected(JSONArray array, int index){

        for (int i = 0; i < array.length(); i++) {
            array.getJSONObject(i).put("status", "unselected");
        }

        array.getJSONObject(index).put("status", "selected");
    }

    private static List<JSONObject> findByOccurences(String url) throws IOException, JSONException {
        InputStream is = null;
        try {
            is = new URL(url).openStream();
            BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
            String jsonText = WeatherService.readAll(rd);
            List<JSONObject> objects = new ArrayList<>();

            JSONArray jsonArray = new JSONArray(jsonText);
            for (int i = 0; i < jsonArray.length(); i++) {
                objects.add((JSONObject)jsonArray.get(i));
            }
            return objects;
        } finally {
            is.close();
        }
    }

    private List<JSONObject> findByCoordinates(String lat, String lon){
        List<JSONObject> list = null;
        try {
            list = SearchService.findByOccurences("https://bd.oplao.com/geoLocation/find.json?lang=en&max=10&lat=" + lat + "&lng=" + lon);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list;
    }

    private List<JSONObject> findByGeonameIdAirports(int geonameId){
        List<JSONObject> list = null;
        try {
            list = SearchService.findByOccurences("https://bd.oplao.com/geoLocation/find.json?lang=en&max=10&geonameId=" + geonameId + "&featureClass=S");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list;
    }

    private List<JSONObject> findByGeonameId(int geonameId){
        List<JSONObject> list = null;
        try {
            list = SearchService.findByOccurences("https://bd.oplao.com/geoLocation/find.json?lang=en&max=10&geonameId=" + geonameId);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list;
    }
    private List<JSONObject> findByAirports(String name){
        List<JSONObject> list = null;
        try {
            list = SearchService.findByOccurences("https://bd.oplao.com/geoLocation/find.json?lang=en&max=10&nameStarts="+name.trim()+"&featureClass=S");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list;
    }


    private List<JSONObject> findByCity(String city){
        List<JSONObject> list = null;
        try {
            list = SearchService.findByOccurences("https://bd.oplao.com/geoLocation/find.json?lang=en&max=10&nameStarts=" + city.replaceAll(" ", "%20"));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list;
    }
   private void clearCookies(HttpServletRequest request, HttpServletResponse response){
       for (int i = 0; i < request.getCookies().length; i++) {
               request.getCookies()[i].setPath("/");
               request.getCookies()[i].setValue("");
               request.getCookies()[i].setMaxAge(0);
               response.addCookie(request.getCookies()[i]);
       }
   }


   public JSONObject findSelectedCity(HttpServletRequest request, HttpServletResponse response, String currentCookieValue){

       if(!Objects.equals(currentCookieValue, "")){
       JSONArray array = new JSONArray(currentCookieValue);
       for (int i = 0; i < array.length(); i++) {
           if(array.getJSONObject(i).get("status").equals("selected")){
               return array.getJSONObject(i);
           }
       }
       }else {
           JSONObject location = null;

               while(location == null) {
                   try {
                       location = WeatherService.readJsonFromUrl("http://api.ipinfodb.com/v3/ip-city/?key=3b83e3cd0aa958682a0a0e43710b624c067bfef60689d8d7c6ecd2f93f0e80cd&ip=" + AddressGetter.getCurrentIpAddress(request) + "&format=json");
                   } catch (IOException e) {
                   }
               }
           List<JSONObject> list = null;
           try {
               list = SearchService.findByOccurences("https://bd.oplao.com/geoLocation/find.json?lang=en&max=10&nameStarts=" + location.get("cityName"));
               JSONObject obj = list.get(0);
               obj.put("status", "selected");
               JSONArray arr = new JSONArray("["+obj.toString()+"]");
               Cookie c = new Cookie(cookieName,arr.toString());
               c.setMaxAge(60 * 60 * 24);
               c.setPath("/");
               response.addCookie(c);
               return obj;
           } catch (IOException e) {
               e.printStackTrace();
           }
       }
       return null;
   }


    public List<HashMap> createRecentCitiesTabs(String currentCookieValue) {

        if (!currentCookieValue.equals("")) {
            JSONArray array = new JSONArray(currentCookieValue);

            ArrayList<HashMap> data = new ArrayList<>();
            for (int i = 0; i < array.length(); i++) {
                data.add(getRecentCityInfo(array.getJSONObject(i)));
            }
            return data;
        }
        return null;
    }

    private HashMap getRecentCityInfo(JSONObject city){

        String cityName = city.getString("name");
        if(cityName.contains("'")){
            cityName = cityName.replace("'", "");
        }
        cityName = cityName.replace(" ", "%20");
        DateTime dateTime = new DateTime(DateTimeZone.forID((String)((JSONObject)city.get("timezone")).get("timeZoneId")));
        JSONObject jsonObject = null;
        try {
            jsonObject = WeatherService.readJsonFromUrl("http://api.worldweatheronline.com/premium/v1/weather.ashx?key=gwad8rsbfr57wcbvwghcps26&format=json&show_comments=no&mca=no&cc=yes&tp=1&date=" + dateTime.getYear() + "-" + dateTime.getMonthOfYear() + "-" + dateTime.getDayOfMonth() + "&q=" + String.valueOf(city.get("lat") + "," + String.valueOf(city.get("lng"))));
        } catch (IOException e) {
            e.printStackTrace();
        }
        HashMap map = (HashMap)jsonObject.toMap().get("data");
        HashMap currentCondition = ((HashMap)((ArrayList)map.get("current_condition")).get(0));
        HashMap<String, Object> result = new HashMap<>();
        result.put("weatherCode",(WeatherService.EXT_STATES.get(Integer.parseInt((String)currentCondition.get("weatherCode")))));
        result.put("tempC", currentCondition.get("temp_C"));
        result.put("tempF", currentCondition.get("temp_F"));
        result.put("city", cityName.replace("%20", " "));
        result.put("countryCode", city.getString("countryCode"));
        result.put("countryName", city.getString("countryName"));
        result.put("geonameId", city.getInt("geonameId"));
        result.put("hours", dateTime.getHourOfDay());
        return result;
    }

    public Cookie deleteCity(String currentCookieValue, String geonameId, HttpServletRequest request, HttpServletResponse response){
        JSONArray array = new JSONArray(currentCookieValue);
        for (int i = 0; i < array.length(); i++) {
            if(String.valueOf(array.getJSONObject(i).get("geonameId")).equals(geonameId)){
                array.remove(i);
                clearCookies(request, response);
                Cookie c = new Cookie(cookieName,array.toString());
                c.setMaxAge(60 * 60 * 24);
                c.setPath("/");
                return c;
            }
        }
        return null;
    }

    public List<String> getTopHolidaysDestinations(int numOfCities) throws IOException{

            String excelFilePath = System.getProperty("user.dir") + "\\src\\main\\resources\\Top_Holiday_Destinations.xlsx";
            FileInputStream inputStream = new FileInputStream(new File(excelFilePath));

            List<String> list = new ArrayList<>();
            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet firstSheet = workbook.getSheetAt(0);
            Iterator<Row> iterator = firstSheet.iterator();

            while (iterator.hasNext()) {
                Row nextRow = iterator.next();
                Iterator<Cell> cellIterator = nextRow.cellIterator();

                while (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();

                    switch (cell.getCellType()) {
                        case Cell.CELL_TYPE_STRING:
                            list.add(cell.getStringCellValue());
                            break;
                    }
                }
            }

            workbook.close();
            inputStream.close();

            return validateTopHolidaysDestinations(list, numOfCities);
        }

    private List<String> validateTopHolidaysDestinations(List<String> destinations, int numOfCities){

        List<String> cities = new ArrayList<>();
        for (int i = 5; i < destinations.size(); i+=3) {
            cities.add(destinations.get(i));
        }
        Random random = new Random();
        List<String> result = new ArrayList<>();
        for (int i = 0; i < numOfCities; i++) {
            int index = random.nextInt(cities.size());
            result.add(cities.get(index));
            cities.remove(index);
        }
        return result;
    }

    public List<HashMap> getCountryWeather(JSONObject city) {

        JSONArray jsonArray = null;
        try {
            jsonArray = WeatherService.readJsonArrayFromUrl("https://bd.oplao.com/geoLocation/find.json?lang=en&max=10&countryCode=" + String.valueOf(city.get("countryCode")) + "&featureCode=PPLA");
        } catch (IOException e) {
            e.printStackTrace();
        }

        DateTime dateTime = new DateTime(DateTimeZone.forID((String) ((JSONObject) city.get("timezone")).get("timeZoneId")));

        return jsonArray.length() >= 6 ? validateCountryWeather(jsonArray, dateTime, city, 6) : validateCountryWeather(jsonArray, dateTime, city, jsonArray.length());

    }

    private List<HashMap> validateCountryWeather(JSONArray jsonArray, DateTime dateTime, JSONObject city, int numOfCities) {

        List<HashMap> result = new ArrayList<>();
        for (int i = 0; i < numOfCities; i++) {
            HashMap map = (HashMap) jsonArray.getJSONObject(i).toMap();
            APIWeatherFinder apiWeatherFinder = new APIWeatherFinder(dateTime, "",
                    false, true, 6, String.valueOf(map.get("lat")), String.valueOf(map.get("lng")));
            HashMap weather = apiWeatherFinder.findWeatherByDate();
            HashMap currentConditions = ((HashMap) ((ArrayList) weather.get("current_condition")).get(0));
            map.put("temp_C", currentConditions.get("temp_C"));
            map.put("temp_F", currentConditions.get("temp_F"));
            map.put("weatherCode", WeatherService.EXT_STATES.get(Integer.parseInt("" + (currentConditions.get("weatherCode")))));
            map.put("isDay", dateTime.getHourOfDay()>6 && dateTime.getHourOfDay()<18);
            result.add(map);
        }
        return result;
    }

    public List<HashMap> getHolidaysWeather(JSONObject city) {
        List<String> cities = new ArrayList<>();
        try {
            cities = getTopHolidaysDestinations(6);
        } catch (IOException e) {
            e.printStackTrace();
        }

        List<HashMap> result = new ArrayList<>();
        for (int i = 0; i < cities.size(); i++) {
            HashMap hm = new HashMap();
            DateTime dateTime = new DateTime(DateTimeZone.forID((String) ((JSONObject) city.get("timezone")).get("timeZoneId")));
            try {
                hm = findSearchOccurences(cities.get(i)).get(0);
            }catch (IndexOutOfBoundsException e){
                System.out.println(findSearchOccurences(cities.get(i)));
            }
            APIWeatherFinder apiWeatherFinder = new APIWeatherFinder(dateTime, "",
                    false, true, 6, String.valueOf(hm.get("lat")), String.valueOf(hm.get("lng")));
            HashMap weather = apiWeatherFinder.findWeatherByDate();
            HashMap currentConditions = ((HashMap) ((ArrayList) weather.get("current_condition")).get(0));
            hm.put("temp_C", currentConditions.get("temp_C"));
            hm.put("temp_F", currentConditions.get("temp_F"));
            hm.put("weatherCode", WeatherService.EXT_STATES.get(Integer.parseInt("" + (currentConditions.get("weatherCode")))));
            hm.put("isDay", dateTime.getHourOfDay()>6 && dateTime.getHourOfDay()<18);
            result.add(hm);
        }



        return result;

    }

    public String generateUrlRequestWeather(String location, String currentCookieValue, HttpServletRequest request, HttpServletResponse response){

        if(!location.equals("undefined")) {
            String city = location.substring(0, location.indexOf('_'));
            String countryCode = location.substring(location.indexOf('_') + 1, location.length());

            JSONArray jsonArray = null;
            try {
                jsonArray = WeatherService.readJsonArrayFromUrl("https://bd.oplao.com/geoLocation/find.json?lang=en&max=10&nameStarts=" + city.replaceAll(" ", "%20") + "&countryCode=" + countryCode);
            } catch (IOException e) {
                e.printStackTrace();
            }
            JSONObject obj = null;
            if (jsonArray != null) {
                if (!jsonArray.toString().equals("[]")) {
                    obj = jsonArray.getJSONObject(0);

                } else {
                    obj = findByCity(city.substring(0, city.length() - 1)).get(0);
                }
            }

            if (obj != null) {
                selectCity(obj.getInt("geonameId"), currentCookieValue, request, response);
            }
        }

        return null;
    }

    public String getSelectedCity(String currentCookieValue){
        JSONArray array = new JSONArray(currentCookieValue);
        if(currentCookieValue!="") {
            for (int i = 0; i < array.length(); i++) {
                if (array.getJSONObject(i).getString("status").equals("selected")) {

                    return array.getJSONObject(i).getString("name")+ "_" + array.getJSONObject(i).getString("countryCode");
                }
            }
        }
        return null;
    }
}
