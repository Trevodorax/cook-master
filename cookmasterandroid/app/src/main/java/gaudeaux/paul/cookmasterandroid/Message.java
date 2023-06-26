package gaudeaux.paul.cookmasterandroid;

public class Message {
    private String senderId;
    private String recipientId;
    private String content;

    private boolean isFromMe;

    public Message(String senderId, String recipientId, String content, boolean isFromMe) {
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
        this.isFromMe = isFromMe;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isFromMe() {
        return isFromMe;
    }

    public void setFromMe(boolean fromMe) {
        isFromMe = fromMe;
    }
}
