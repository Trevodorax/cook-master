package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.TextView;

public class FidelityActivity extends AppCompatActivity {
    TextView fidelityPointsTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fidelity);

        this.fidelityPointsTextView = findViewById(R.id.fidelityPointsText);

        SharedPreferences userDictionary = getSharedPreferences("userDictionary", Context.MODE_PRIVATE);
        String fidelityPoints = Integer.toString(userDictionary.getInt("fidelityPoints", -1));

        if(fidelityPoints.equals("-1")) {
            finish();
        }

        fidelityPointsTextView.setText(fidelityPoints);
    }
}