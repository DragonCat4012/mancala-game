package ex.com.challenge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class GameConnectUpdate {
    private final UpdateType topic = UpdateType.PlayerConnect;
    private Player player;

    /*GameConnectUpdate(Player player) {
        this.player = player;
    }*/
}
