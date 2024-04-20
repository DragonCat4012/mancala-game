package ex.com.challenge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class GamePlayerUpdate {
    private final UpdateType topic = UpdateType.PlayerConnect;
    private String sessionID;
}
