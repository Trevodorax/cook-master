package gaudeaux.paul.cookmasterandroid;

import java.util.List;

public class Conversation {
    String otherUserId;
    String otherUserName;
    List<String> messages;

    public Conversation(String otherUserId, String otherUserName) {
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
    }

    public Conversation(String otherUserId, String otherUserName, List<String> messages) {
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
        this.messages = messages;
    }

    public String getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(String otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserName() {
        return otherUserName;
    }

    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }

    public List<String> getMessages() {
        return messages;
    }

    public void setMessages(List<String> messages) {
        this.messages = messages;
    }
}
