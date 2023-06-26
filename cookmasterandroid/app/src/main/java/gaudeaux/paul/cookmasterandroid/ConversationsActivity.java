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

public class ConversationsActivity extends AppCompatActivity {
    private ListView conversationsList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_conversations);

        this.conversationsList = findViewById(R.id.conversationsList);

        getConversations(new ConversationsCallback() {
            @Override
            public void onSuccess(List<Conversation> conversations) {
            ConversationAdapter conversationAdapter = new ConversationAdapter(conversations, ConversationsActivity.this);
                conversationsList.setAdapter(conversationAdapter);

                conversationsList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                        Conversation currentConversation = (Conversation) conversationAdapter.getItem(position);

                    Intent conversationActivity = new Intent(ConversationsActivity.this, ConversationActivity.class);
                        conversationActivity.putExtra("otherUserId", currentConversation.getOtherUserId());
                        conversationActivity.putExtra("otherUserName", currentConversation.getOtherUserName());
                        startActivity(conversationActivity);
                    }
                });
            }

            @Override
            public void onError(VolleyError error) {

            }
        });
    }

    public interface ConversationsCallback {
        void onSuccess(List<Conversation> conversations);
        void onError(VolleyError error);
    }

    public void getConversations(ConversationsCallback callback) {
        List<Conversation> conversations = new ArrayList<>();

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "https://cookmaster.site/api/users/me/conversations";

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
                                JSONObject conversationObject = responseJSONArray.getJSONObject(i);
                                String otherUserId = Integer.toString(conversationObject.getInt("id"));
                                String otherUserFirstName = conversationObject.getString("firstName");
                                String otherUserLastName = conversationObject.getString("lastName");
                                Conversation addedConversation = new Conversation(
                                        otherUserId,
                                        otherUserFirstName + " " + otherUserLastName
                                );
                                conversations.add(addedConversation);
                            }
                            callback.onSuccess(conversations);  // Notify callback
                        } catch (Exception e) {
                        Toast.makeText(ConversationsActivity.this, "Fetch error", Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error instanceof com.android.volley.NetworkError) {
                        Toast.makeText(ConversationsActivity.this, "Cannot connect to Internet", Toast.LENGTH_SHORT).show();
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
                                    Intent loginActivity = new Intent(ConversationsActivity.this, LoginActivity.class);
                                        startActivity(loginActivity);
                                    }

                                Toast.makeText(ConversationsActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
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