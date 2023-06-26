package gaudeaux.paul.cookmasterandroid;

public class User {
    public User(String id, String firstName, String lastName, int fidelityPoints, boolean isClient) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fidelityPoints = fidelityPoints;
        this.isClient = isClient;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getFidelityPoints() {
        return fidelityPoints;
    }

    public void setFidelityPoints(int fidelityPoints) {
        this.fidelityPoints = fidelityPoints;
    }

    public boolean isClient() {
        return isClient;
    }

    public void setClient(boolean client) {
        isClient = client;
    }

    private String id;
    private String firstName;
    private String lastName;
    private int fidelityPoints;
    private boolean isClient;


}
