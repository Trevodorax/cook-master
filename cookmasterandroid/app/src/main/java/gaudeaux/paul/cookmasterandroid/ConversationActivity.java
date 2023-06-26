package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
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
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class ConversationActivity extends AppCompatActivity {
    private List<Message> messages = new ArrayList<>();

    private ListView messagesList;
    private TextView title;
    private EditText messageEditText;
    private Button sendButton;
    private String token;
    private String otherUserId;
    private String myId;
    private Socket mSocket;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_conversation);

        try {
            mSocket = IO.socket("https://cookmaster.site");
        } catch (URISyntaxException e) {
            System.out.println("Socket io connection error : " + e.getMessage());
        }

        SharedPreferences authDictionary = getSharedPreferences("authDictionary", Context.MODE_PRIVATE);
        this.token = authDictionary.getString("token", "");

        mSocket.on("message", onNewMessage);

        mSocket.connect();

        try {
            JSONObject authObject = new JSONObject();
            authObject.put("token", this.token);
            mSocket.emit("auth", authObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        this.title = findViewById(R.id.title);
        this.messagesList = findViewById(R.id.messagesList);
        this.sendButton = findViewById(R.id.sendButton);
        this.messageEditText = findViewById(R.id.messageInput);

        SharedPreferences userDictionary = getSharedPreferences("userDictionary", Context.MODE_PRIVATE);
        this.myId = userDictionary.getString("id", "");

        Intent intent = getIntent();
        this.otherUserId = intent.getStringExtra("otherUserId");
        String otherUserName = intent.getStringExtra("otherUserName");

        title.setText(otherUserName);

        this.sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    // Initialize the JSONObject and populate it with payload data.
                    JSONObject payload = new JSONObject();
                    payload.put("token", token);
                    payload.put("content", messageEditText.getText());
                    payload.put("recipientId", Integer.parseInt(otherUserId));

                    messageEditText.setText("");

                    // Emit the "message" event with the payload.
                    mSocket.emit("message", payload.toString());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });

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
                                } catch (Exception e){
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
                headers.put("Authorization", "Bearer " + token);
                return headers;
            }

        };
        requestQueue.add(request);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        mSocket.disconnect();
        mSocket.off("message", onNewMessage);
    }

    private Emitter.Listener onNewMessage = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String senderId;
                    String recipientId;
                    String content;
                    try {
                        senderId = data.getString("senderId");
                        recipientId = data.getString("recipientId");
                        content = data.getString("content");
                    } catch (JSONException e) {
                        return;
                    }

                    Message newMessage = new Message(
                            senderId,
                            recipientId,
                            content,
                            senderId.equals(myId)
                    );

                    // add the message to view
                    addMessage(newMessage);
                }
            });
        }
    };

    private void scrollToBottom() {
        messagesList.post(new Runnable() {
            @Override
            public void run() {
                // Select the last item in the adapter
                messagesList.setSelection(messagesList.getCount() - 1);
            }
        });
    }

    private void addMessage(Message addedMessage) {
        messages.add(addedMessage);  // Add the message to the list

        // Create or update the adapter for the ListView
        if (messagesList.getAdapter() == null) {
            MessageAdapter messageAdapter = new MessageAdapter(messages, ConversationActivity.this);
            messagesList.setAdapter(messageAdapter);
        } else {
            ((MessageAdapter) messagesList.getAdapter()).notifyDataSetChanged();
        }

        scrollToBottom();  // Scroll to the bottom of the ListView
    }
}