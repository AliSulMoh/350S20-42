package edu.upenn.cis350.hw4.data;
import android.os.AsyncTask;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.*;
import java.net.URL;
import java.util.Scanner;

public class HospitalWebTask extends AsyncTask<URL, String, String[]> {
    /*This method is called in background when this object's "execute" method is invoked.The arguments passed to "execute" are passed to this method.*/
    protected String[] doInBackground(URL... urls) {
        try {
            // get the first URL from the array
            System.out.println("Attempting");
            URL url = urls[0];
            // create connection and send HTTP request
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setRequestMethod("GET");
            System.out.println("MADE IT HERE");
            conn.connect();
            System.out.println("???");
            // read first line of data that is returned
            Scanner in = new Scanner(url.openStream());
            String msg = in.nextLine();
            // use Android JSON library to parse JSON
            JSONArray arr = new JSONArray(msg);
            String[] hospitals = new String[arr.length()];
            // Goes through all appointments in JSON Array, adds them to Appointment Array
            for (int i = 0; i < arr.length(); i++) {
                String curr = (String) arr.getString(i);
                hospitals[i] = curr;
            }
            return hospitals;
        } catch (IOException e) {
            throw new IllegalStateException();
        } catch (Exception e) {
            System.out.print(e.toString());
            return null;
        }

    }

    /*This method is called in foreground after doInBackground finishes.It can access and update Views in user interface.*/
    protected void onPostExecute(String msg) {
        // not implemented but you can use this if you’d like}}
    }
}
