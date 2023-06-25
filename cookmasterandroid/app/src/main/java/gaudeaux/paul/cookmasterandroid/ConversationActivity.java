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

public class ConversationActivity extends AppCompatActivity {
    private ListView messagesList;
    private TextView title;

    private String otherUserId;
    private String myId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_conversation);

        this.title = findViewById(R.id.title);
        this.messagesList = findViewById(R.id.messagesList);

        SharedPreferences userDictionary = getSharedPreferences("userDictionary", Context.MODE_PRIVATE);
        this.myId = userDictionary.getString("id", "");

        Intent intent = getIntent();
        System.out.println(intent.getStringExtra("otherUserId"));
        this.otherUserId = intent.getStringExtra("otherUserId");
        String otherUserName = intent.getStringExtra("otherUserName");

        title.setText(otherUserName);

        getMessages(new MessagesCallback() {
            @Override
            public void onSuccess(List<Message> messages) {
                MessageAdapter messageAdapter = new MessageAdapter(messages, ConversationActivity.this);
                messagesList.setAdapter(messageAdapter);
                scrollToBottom();
            }

            @Override
            public void onError(VolleyError error) {

            }
        });



    }

    public interface MessagesCallback {
        void onSuccess(List<Message> messages);
        void onError(VolleyError error);
    }

    public void getMessages(MessagesCallback callback) {
        List<Message> messages = new ArrayList<>();

        RequestQueue requestQueue = Volley.newRequestQueue(this);

        String url = "https://cookmaster.site/api/chat/" + otherUserId;

        StringRequest request = new StringRequest(
                Request.Method.GET,
                url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONArray responseJSONArray = new JSONArray(response);

                            for (int i = 0; i < responseJSONArray.length(); i++) {
                                JSONObject conversationObject = responseJSONArray.getJSONObject(i);
                                boolean isFromMe = Integer.toString(conversationObject.getInt("recipientId")).equals(otherUserId);
                                Message addedMessage = new Message(
                                        Integer.toString(conversationObject.getInt("senderId")),
                                        Integer.toString(conversationObject.getInt("recipientId")),
                                        conversationObject.getString("content"),
                                        isFromMe
                                );
                                messages.add(addedMessage);
                            }
                            callback.onSuccess(messages);  // Notify callback

                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                            Toast.makeText(ConversationActivity.this, "Fetch error", Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error instanceof com.android.volley.NetworkError) {
                            Toast.makeText(ConversationActivity.this, "Cannot connect to Internet", Toast.LENGTH_SHORT).show();
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
                                        Intent loginActivity = new Intent(ConversationActivity.this, LoginActivity.class);
                                        startActivity(loginActivity);
                                    }

                                    Toast.makeText(ConversationActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
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

    private void scrollToBottom() {
        messagesList.post(new Runnable() {
            @Override
            public void run() {
                // Select the last item in the adapter
                messagesList.setSelection(messagesList.getCount() - 1);
            }
        });
    }


}