package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LoginActivity extends AppCompatActivity {
    private Button okButton;
    private EditText emailInput;
    private EditText passwordInput;
    private TextView errorMessageTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SharedPreferences authDictionary = getSharedPreferences( "authDictionary" , Context.MODE_PRIVATE) ;
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        this.okButton = findViewById(R.id.okButton);
        this.emailInput = findViewById(R.id.emailInput);
        this.passwordInput = findViewById(R.id.passwordInput);
        this.errorMessageTextView = findViewById(R.id.errorMessage);

        this.okButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                errorMessageTextView.setText("");
                RequestQueue requestQueue = Volley.newRequestQueue(LoginActivity.this);
                String url = "https://cookmaster.site/api/auth/signin";
                StringRequest request = new StringRequest(
                        Request.Method.POST,
                        url,
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String response) {
                                try {
                                    JSONObject responseJSON = new JSONObject(response);
                                    String token = responseJSON.getString("access_token");
                                    SharedPreferences.Editor authDictionaryEditor = authDictionary.edit();
                                    authDictionaryEditor.putString("token", token);
                                    authDictionaryEditor.apply();

                                    Intent mainActivity = new Intent(LoginActivity.this, MainActivity.class);
                                    startActivity(mainActivity);
                                } catch (Exception e) {
                                    Toast.makeText(LoginActivity.this, "Fetch error", Toast.LENGTH_SHORT).show();
                                }
                            }
                        },
                        new Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error) {
                                if (error instanceof com.android.volley.NetworkError) {
                                    Toast.makeText(LoginActivity.this, "Cannot connect to Internet", Toast.LENGTH_SHORT).show();
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
                                            }

                                            errorMessageTextView.setText(errorMessage);
                                        }catch (Exception e){
                                            e.printStackTrace();
                                        }
                                    }
                                }
                            }
                        }){
                    @Override
                    protected Map<String,String> getParams(){
                        Map<String,String> params = new HashMap<String,String>();
                        params.put("email", emailInput.getText().toString());
                        params.put("password", passwordInput.getText().toString());

                        return params;
                    }

                    @Override
                    public String getBodyContentType() {
                        return "application/x-www-form-urlencoded; charset=UTF-8";
                    }
                };

                requestQueue.add(request);


                // Intent mainActivity = new Intent(LoginActivity.this, MainActivity.class);
                // startActivity(mainActivity);
                // finish();
            }
        });
    }
}
