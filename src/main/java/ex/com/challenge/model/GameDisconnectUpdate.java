package ex.com.challenge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class GameDisconnectUpdate {
    private final UpdateType topic = UpdateType.PlayerDisconnect;
    private String sessionID;

    /*GameDisconnectUpdate(String sessionID) {
        this.sessionID = sessionID;
        this.topic = UpdateType.PlayerConnect;
    }*/
}
