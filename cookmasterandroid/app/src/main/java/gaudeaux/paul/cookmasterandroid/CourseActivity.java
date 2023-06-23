package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

public class CourseActivity extends AppCompatActivity {
    private TextView title;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_course);

        title = findViewById(R.id.title);

        Intent intent = getIntent();
        String id = (String) intent.getSerializableExtra("id");

        title.setText("Course " + id);
    }
}