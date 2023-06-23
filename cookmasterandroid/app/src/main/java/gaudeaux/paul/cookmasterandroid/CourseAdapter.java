package gaudeaux.paul.cookmasterandroid;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.List;

import gaudeaux.paul.cookmasterandroid.Course;

public class CourseAdapter extends BaseAdapter {
    private List<Course> students;
    private Context context;

    public CourseAdapter(List<Course> students, Context context) {
        this.students = students;
        this.context = context;
    }

    @Override
    public int getCount() {
        return this.students.size();
    }

    @Override
    public Object getItem(int position) {
        return this.students.get(position);
    }

    @Override
    public long getItemId(int position) {
        return 0; // we don't have an ID in this example, so this won't be used
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if(convertView == null) {
            LayoutInflater inflater = LayoutInflater.from(this.context);
            convertView = inflater.inflate(R.layout.course_row, null);
        }

        TextView title = convertView.findViewById(R.id.title);

        Course currentCourse = (Course) getItem(position);

        title.setText(currentCourse.getTitle());


        return convertView;
    }
}
