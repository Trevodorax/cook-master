package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
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

import io.noties.markwon.Markwon;
import io.noties.markwon.ext.tables.TablePlugin;

public class LessonActivity extends AppCompatActivity {
    private TextView lessonTitle;
    private TextView lessonDescription;
    private TextView lessonContent;
    private Markwon markwon;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lesson);

        this.markwon = Markwon.builder(LessonActivity.this)
                .usePlugin(TablePlugin.create(LessonActivity.this))
                .build();

        this.lessonTitle = findViewById(R.id.lessonTitle);
        this.lessonDescription = findViewById(R.id.lessonDescription);
        this.lessonContent = findViewById(R.id.lessonContent);

        Intent intent = getIntent();
        String lessonId = intent.getStringExtra("id");
        String lessonName = intent.getStringExtra("name");

        lessonTitle.setText(lessonName);

        getLesson(new LessonCallback() {
            @Override
            public void onSuccess(Lesson lesson) {
                lessonTitle.setText(lesson.getName());
                lessonDescription.setText(lesson.getDescription());
                markwon.setMarkdown(lessonContent, lesson.getContent());
            }

            @Override
            public void onError(VolleyError error) {

            }
        });
    }

    public interface LessonCallback {
        void onSuccess(Lesson lesson);
        void onError(VolleyError error);
    };

    public void getLesson(LessonCallback callback) {
        List<Lesson> lessons = new ArrayList<>();

        RequestQueue requestQueue = Volley.newRequestQueue(this);

        Intent intent = getIntent();
        String lessonId = intent.getStringExtra("id");

        String url = "https://cookmaster.site/api/lessons/" + lessonId;

        StringRequest request = new StringRequest(
                Request.Method.GET,
                url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        if(response.equals("-1")) {
                            Toast.makeText(LessonActivity.this, "You haven't unlocked this lesson.", Toast.LENGTH_SHORT).show();
                            return;
                        }
                        try {
                            JSONObject responseJSON = new JSONObject(response);
                            Lesson lesson = new Lesson(
                                    responseJSON.getString("id"),
                                    responseJSON.getString("name"),
                                    responseJSON.getString("description"),
                                    responseJSON.getString("content")
                            );

                            callback.onSuccess(lesson);

                        } catch (Exception e) {
                            Toast.makeText(LessonActivity.this, "Fetch error", Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error instanceof com.android.volley.NetworkError) {
                            Toast.makeText(LessonActivity.this, "Cannot connect to Internet", Toast.LENGTH_SHORT).show();
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
                                        Intent loginActivity = new Intent(LessonActivity.this, LoginActivity.class);
                                        startActivity(loginActivity);
                                    }

                                    Toast.makeText(LessonActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
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