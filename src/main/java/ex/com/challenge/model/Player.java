package ex.com.challenge.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author: e.shakeri
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Player {
    private String name;
    private String nationName = "No Name :c";
    private String color;
    private String sessionID;
    private Boolean connected = true;

    public Player(String name, String color) {
        this.name = name;
        this.color = color;
        this.sessionID = "x";
        this.connected = true;
    }
}
