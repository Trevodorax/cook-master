package gaudeaux.paul.cookmasterandroid;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.List;

public class ConversationAdapter extends BaseAdapter {
    private List<Conversation> conversations;
    private Context context;

    public ConversationAdapter(List<Conversation> conversations, Context context) {
        this.conversations = conversations;
        this.context = context;
    }

    @Override
    public int getCount() {
        return this.conversations.size();
    }

    @Override
    public Object getItem(int position) {
        return this.conversations.get(position);
    }

    @Override
    public long getItemId(int position) {
        return 0; // we don't have an ID in this example, so this won't be used
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if(convertView == null) {
            LayoutInflater inflater = LayoutInflater.from(this.context);
            convertView = inflater.inflate(R.layout.conversation_row, null);
        }

        TextView otherUserName = convertView.findViewById(R.id.otherUserName);

        Conversation currentConversation = (Conversation) getItem(position);

        otherUserName.setText(currentConversation.getOtherUserName());

        return convertView;
    }
}
