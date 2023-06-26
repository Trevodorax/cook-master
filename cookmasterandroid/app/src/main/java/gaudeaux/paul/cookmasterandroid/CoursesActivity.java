package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
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

public class CoursesActivity extends AppCompatActivity {
    private ListView coursesList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_courses);

        this.coursesList = findViewById(R.id.coursesList);

        getCourses(new CoursesCallback() {
            @Override
            public void onSuccess(List<Course> courses) {
                CourseAdapter courseAdapter = new CourseAdapter(courses, CoursesActivity.this);
                coursesList.setAdapter(courseAdapter);

                coursesList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                        Course currentCourse = (Course) courseAdapter.getItem(position);

                        Intent courseActivity = new Intent(CoursesActivity.this, CourseActivity.class);
                        courseActivity.putExtra("id", currentCourse.getId());
                        courseActivity.putExtra("name", currentCourse.getName());
                        startActivity(courseActivity);
                    }
                });
            }

            @Override
            public void onError(VolleyError error) {

            }
        });
    }

    public interface CoursesCallback {
        void onSuccess(List<Course> courses);
        void onError(VolleyError error);
    }

    public void getCourses(CoursesCallback callback) {
        List<Course> courses = new ArrayList<>();

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "https://cookmaster.site/api/clients/me/courses";

        StringRequest request = new StringRequest(
                Request.Method.GET,
                url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONArray responseJSONArray = new JSONArray(response);

                            // Go through each item in the array
                            for (int i = 0; i < responseJSONArray.length(); i++) {
                                JSONObject courseObject = responseJSONArray.getJSONObject(i);
                                Course addedCourse = new Course(courseObject.getString("name"), Integer.toString(courseObject.getInt("id")));
                                courses.add(addedCourse);
                            }
                            callback.onSuccess(courses);  // Notify callback
                        } catch (Exception e) {
                            Toast.makeText(CoursesActivity.this, "Fetch error", Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error instanceof com.android.volley.NetworkError) {
                            Toast.makeText(CoursesActivity.this, "Cannot connect to Internet", Toast.LENGTH_SHORT).show();
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
                                        Intent loginActivity = new Intent(CoursesActivity.this, LoginActivity.class);
                                        startActivity(loginActivity);
                                    }

                                    Toast.makeText(CoursesActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
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