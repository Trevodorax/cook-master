package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;
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

public class CourseActivity extends AppCompatActivity {
    private ListView lessonsList;
    private TextView title;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_course);

        this.lessonsList = findViewById(R.id.lessonsList);
        this.title = findViewById(R.id.title);

        Intent intent = getIntent();
        String courseName = intent.getStringExtra("name");
        title.setText(courseName);

        getLessons(new LessonsCallback() {
            @Override
            public void onSuccess(List<Lesson> lessons) {
                LessonAdapter lessonAdapter = new LessonAdapter(lessons, CourseActivity.this);
                lessonsList.setAdapter(lessonAdapter);

                lessonsList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                        Lesson currentLesson = (Lesson) lessonAdapter.getItem(position);

                        Intent lessonActivity = new Intent(CourseActivity.this, LessonActivity.class);
                        lessonActivity.putExtra("id", currentLesson.getId());
                        lessonActivity.putExtra("name", currentLesson.getName());
                        startActivity(lessonActivity);
                    }
                });
            }

            @Override
            public void onError(VolleyError error) {

            }
        });



    }

    public interface LessonsCallback {
        void onSuccess(List<Lesson> courses);
        void onError(VolleyError error);
    }

    public void getLessons(LessonsCallback callback) {
        List<Lesson> lessons = new ArrayList<>();

        RequestQueue requestQueue = Volley.newRequestQueue(this);

        Intent intent = getIntent();
        String courseId = intent.getStringExtra("id");

        String url = "https://cookmaster.site/api/courses/" + courseId + "/lessons";

        StringRequest request = new StringRequest(
                Request.Method.GET,
                url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONArray responseJSONArray = new JSONArray(response);

                            for (int i = 0; i < responseJSONArray.length(); i++) {
                                JSONObject courseObject = responseJSONArray.getJSONObject(i);
                                Lesson addedLesson = new Lesson(courseObject.getString("name"), Integer.toString(courseObject.getInt("id")));
                                lessons.add(addedLesson);
                            }
                            callback.onSuccess(lessons);  // Notify callback
                        } catch (Exception e) {
                            Toast.makeText(CourseActivity.this, "Fetch error", Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error instanceof com.android.volley.NetworkError) {
                            Toast.makeText(CourseActivity.this, "Cannot connect to Internet", Toast.LENGTH_SHORT).show();
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
                                        Intent loginActivity = new Intent(CourseActivity.this, LoginActivity.class);
                                        startActivity(loginActivity);
                                    }

                                    Toast.makeText(CourseActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
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