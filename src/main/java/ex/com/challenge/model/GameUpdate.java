package ex.com.challenge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class GameUpdate {
    private UpdateType topic = UpdateType.GameUpdate;
    private Game game;

    public GameUpdate(Game game) {
        this.game = game;
    }
}
