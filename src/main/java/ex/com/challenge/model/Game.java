package ex.com.challenge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Ehsan Sh
 */

@AllArgsConstructor
@Data
@Builder
public class Game {
    @Id
    private String id;
    private List<String> connectedPlayers;
    private GameStatusEnum status;
    private Player firstPlayer;
    private Player secondPlayer;
    private Player winner;
    private String lastStr;
    private PlayerTurnEnum playerTurn;
    private Date createdAt;

    public Game() {
        this.lastStr = "None";
        this.connectedPlayers = new ArrayList<>();
        this.createdAt = new Date();

        playerTurn = PlayerTurnEnum.FIRST_PLAYER;
    }
}
