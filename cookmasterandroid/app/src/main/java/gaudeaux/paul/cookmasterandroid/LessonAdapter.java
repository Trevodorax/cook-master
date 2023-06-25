package gaudeaux.paul.cookmasterandroid;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.List;

public class LessonAdapter extends BaseAdapter {
    private List<Lesson> lessons;
    private Context context;

    public LessonAdapter(List<Lesson> lessons, Context context) {
        this.lessons = lessons;
        this.context = context;
    }

    @Override
    public int getCount() {
        return this.lessons.size();
    }

    @Override
    public Object getItem(int position) {
        return this.lessons.get(position);
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if(convertView == null) {
            LayoutInflater inflater = LayoutInflater.from(this.context);
            convertView = inflater.inflate(R.layout.lesson_row, null);
        }

        TextView name = convertView.findViewById(R.id.name);

        Lesson currentLesson = (Lesson) getItem(position);

        name.setText(currentLesson.getName());

        return convertView;
    }
}
