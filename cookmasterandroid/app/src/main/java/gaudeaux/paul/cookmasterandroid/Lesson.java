package gaudeaux.paul.cookmasterandroid;

public class Lesson {
    private String id;
    private String name;
    private String description;
    private String content;

    public Lesson(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public Lesson(String id, String name, String description, String content) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
