package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

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
}
