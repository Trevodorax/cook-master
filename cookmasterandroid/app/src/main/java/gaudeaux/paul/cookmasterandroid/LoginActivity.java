package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class LoginActivity extends AppCompatActivity {
    private Button okButton;
    private EditText emailInput;
    private EditText passwordInput;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SharedPreferences authDictionary = getSharedPreferences( "authDictionary" , Context.MODE_PRIVATE) ;
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        this.okButton = findViewById(R.id.okButton);
        this.emailInput = findViewById(R.id.emailInput);
        this.passwordInput = findViewById(R.id.passwordInput);

        this.okButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences.Editor authDictionaryEditor = authDictionary.edit();
                authDictionaryEditor.putString("login", emailInput.getText().toString());
                authDictionaryEditor.putString("password", passwordInput.getText().toString());
                authDictionaryEditor.apply();

                Intent mainActivity = new Intent(LoginActivity.this, MainActivity.class);
                startActivity(mainActivity);
            }
        });
    }
}
