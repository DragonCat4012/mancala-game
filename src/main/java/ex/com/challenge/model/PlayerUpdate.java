package ex.com.challenge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PlayerUpdate {
    private UpdateType topic = UpdateType.PlayerUpdate;
    private String player;

    public PlayerUpdate(String name) {
        this.player = name;
    }
}
