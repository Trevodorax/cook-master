package gaudeaux.paul.cookmasterandroid;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.core.content.res.ResourcesCompat;

import java.util.List;

public class MessageAdapter extends BaseAdapter {
    private List<Message> messages;
    private Context context;

    public MessageAdapter(List<Message> messages, Context context) {
        this.messages = messages;
        this.context = context;
    }

    @Override
    public int getCount() {
        return this.messages.size();
    }

    @Override
    public Object getItem(int position) {
        return this.messages.get(position);
    }

    @Override
    public long getItemId(int position) {
        return 0; // we don't have an ID in this example, so this won't be used
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            LayoutInflater inflater = LayoutInflater.from(this.context);
            convertView = inflater.inflate(R.layout.message_row, null);
        }

        TextView content = convertView.findViewById(R.id.content);

        Message currentMessage = (Message) getItem(position);

        content.setText(currentMessage.getContent());

        RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) content.getLayoutParams();

        // Check if the message is from the user
        if (currentMessage.isFromMe()) {
            // Align the message to the right
            params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
            params.removeRule(RelativeLayout.ALIGN_PARENT_LEFT);
            // Align the text inside TextView to the right
            content.setBackground(ResourcesCompat.getDrawable(context.getResources(), R.drawable.message_bubble_me, null));
            content.setTextColor(ResourcesCompat.getColor(context.getResources(), R.color.black, null));
        } else {
            // Align the message to the left
            params.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
            params.removeRule(RelativeLayout.ALIGN_PARENT_RIGHT);
            content.setBackground(ResourcesCompat.getDrawable(context.getResources(), R.drawable.message_bubble_other, null));
            content.setTextColor(ResourcesCompat.getColor(context.getResources(), R.color.white, null));
        }

        content.setLayoutParams(params); // apply the updated layout params

        return convertView;
    }




}
