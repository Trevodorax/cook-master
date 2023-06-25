package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
    Button loginButton;
    Button coursesButton;
    Button fidelityButton;
    Button chatButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.loginButton = findViewById(R.id.loginButton);
        this.coursesButton = findViewById(R.id.coursesButton);
        this.fidelityButton = findViewById(R.id.fidelityButton);
        this.chatButton = findViewById(R.id.chatButton);

        this.loginButton.setOnClickListener(v -> {
            Intent loginActivity = new Intent(MainActivity.this, LoginActivity.class);
            startActivity(loginActivity);
        });

        this.coursesButton.setOnClickListener(v -> {
            Intent coursesActivity = new Intent(MainActivity.this, CoursesActivity.class);
            startActivity(coursesActivity);
        });

        this.fidelityButton.setOnClickListener(v -> {
            Intent fidelityActivity = new Intent(MainActivity.this, FidelityActivity.class);
            startActivity(fidelityActivity);
        });

        this.chatButton.setOnClickListener(v -> {
            Intent conversationsActivity = new Intent(MainActivity.this, ConversationsActivity.class);
            startActivity(conversationsActivity);
        });
    }

    @Override
    protected void onResume() {
        super.onResume();

        getUser(new UserCallback() {
            @Override
            public void onSuccess(User user) {
                SharedPreferences userDictionary = getSharedPreferences( "userDictionary" , Context.MODE_PRIVATE) ;
                SharedPreferences.Editor userDictionaryEditor = userDictionary.edit();
                
                userDictionaryEditor.putString("id", user.getId());
                userDictionaryEditor.putString("firstName", user.getFirstName());
                userDictionaryEditor.putString("lastName", user.getLastName());
                userDictionaryEditor.putInt("fidelityPoints", user.getFidelityPoints());
                userDictionaryEditor.putBoolean("isClient", user.isClient());

                userDictionaryEditor.apply();
            }

            @Override
            public void onError(VolleyError error) {

            }
        });
    }


    public interface UserCallback {
        void onSuccess(User user);
        void onError(VolleyError error);
    }

    public void getUser(UserCallback callback) {
        User user;

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "https://cookmaster.site/api/users/me";

        StringRequest request = new StringRequest(
                Request.Method.GET,
                url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        User user;
                        try {
                            JSONObject responseJSON = new JSONObject(response);

                            JSONObject client = responseJSON.optJSONObject("client");

                            if(client != null) {
                                user = new User(
                                        responseJSON.getString("id"),
                                        responseJSON.getString("firstName"),
                                        responseJSON.getString("lastName"),
                                        client.getInt("fidelityPoints"),
                                        true
                                );
                            } else {
                                user = new User(
                                        responseJSON.getString("id"),
                                        responseJSON.getString("firstName"),
                                        responseJSON.getString("lastName"),
                                        -1,
                                        false
                                );
                            }

                            callback.onSuccess(user);
                        } catch (Exception e) {
                            Toast.makeText(MainActivity.this, "Fetch error", Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error instanceof com.android.volley.NetworkError) {
                            Toast.makeText(MainActivity.this, "Cannot connect to Internet", Toast.LENGTH_SHORT).show();
                        } else if (error.networkResponse != null) {
                            String body;
                            if(error.networkResponse.data!=null) {
                                try{
                                    // get error message
                                    body = new String(error.networkResponse.data,"UTF-8");
                                    JSONObject bodyJSON = new JSONObject(body);

                                    String errorMessage = "";

                                    // handle the error
                                    if(error.networkResponse.statusCode == 400) {
                                        JSONArray messageArray = bodyJSON.getJSONArray("message");
                                        errorMessage = messageArray.getString(0);
                                    } else if (error.networkResponse.statusCode == 403) {
                                        errorMessage = bodyJSON.getString("message");
                                    } else if (error.networkResponse.statusCode == 401) {
                                        Intent loginActivity = new Intent(MainActivity.this, LoginActivity.class);
                                        startActivity(loginActivity);
                                    }

                                    Toast.makeText(MainActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
                                }catch (Exception e){
                                    e.printStackTrace();
                                }
                            }
                        }
                        callback.onError(error);  // Notify callback
                    }
                }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<String, String>();
                SharedPreferences authDictionary = getSharedPreferences("authDictionary", Context.MODE_PRIVATE);
                String token = authDictionary.getString("token", "");
                headers.put("Authorization", "Bearer " + token);
                return headers;
            }

        };
        requestQueue.add(request);
    }
}
