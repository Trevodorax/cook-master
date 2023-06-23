package gaudeaux.paul.cookmasterandroid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;

public class CoursesActivity extends AppCompatActivity {
    private ListView coursesList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_courses);

        this.coursesList = findViewById(R.id.coursesList);

        CourseAdapter courseAdapter = new CourseAdapter(getCourses(), CoursesActivity.this);
        this.coursesList.setAdapter(courseAdapter);

        this.coursesList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Course currentCourse = (Course) courseAdapter.getItem(position);

                Intent courseActivity = new Intent(CoursesActivity.this, CourseActivity.class);
                courseActivity.putExtra("id", currentCourse.getId());
                startActivity(courseActivity);
            }
        });
    }

    public List<Course> getCourses() {
        List<Course> courses = new ArrayList<>();

        courses.add(new Course("How to cook like a Spanish", "0"));
        courses.add(new Course("How to cook like a French", "1"));
        courses.add(new Course("How to cook like a Chinese", "2"));
        courses.add(new Course("How to cook like a Russian", "3"));
        courses.add(new Course("How to cook like a German", "4"));
        courses.add(new Course("How to cook like a Canadian", "5"));
        courses.add(new Course("How to cook like a Indian", "6"));

        return courses;
    }
}