package ex.com.challenge.controller;

import ex.com.challenge.dto.ConnectRequest;
import ex.com.challenge.exception.GameException;
import ex.com.challenge.model.Game;
import ex.com.challenge.model.GameUpdate;
import ex.com.challenge.model.Sow;
import ex.com.challenge.model.UpdateType;
import ex.com.challenge.model.Player;
import ex.com.challenge.model.PlayerUpdate;
import ex.com.challenge.model.GameConnectUpdate;
import ex.com.challenge.model.GameDisconnectUpdate;
import ex.com.challenge.service.GameService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * @author: e.shakeri
 */

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
public class GameController {

    @EventListener
    public void onConnectedEvent(SessionConnectEvent event) {
        log.warn("New Client with connected");
    }

    @EventListener
    public void onDisconnectEvent(SessionDisconnectEvent event) {
        log.warn("Client with {} disconnected", event.getSessionId());
        // TODO: send game?
        simpMessagingTemplate.convertAndSend("/topic/game-progress",
                new GameDisconnectUpdate(event.getSessionId()));
        // gameService.disconnectPlayer(event.getSessionId());
    }

    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/create")
    public ResponseEntity<Game> create(@RequestBody Player player) {
        log.info("create game request: {}", player);
        return ResponseEntity.ok(gameService.createGame(player));
    }

    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectRequest request) throws GameException {
        log.info("connect request: {}", request);
        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + request.getGameId(),
                new PlayerUpdate(request.getPlayer()));

        simpMessagingTemplate.convertAndSend("/topic/game-progress",
                new GameConnectUpdate(request.getPlayer()));
        return ResponseEntity.ok(gameService.connectToGame(request.getPlayer(), request.getGameId()));
    }

    @PostMapping("/connect/random")
    public ResponseEntity<Game> connectRandom(@RequestBody Player player) throws GameException {
        log.info("connect random {}", player);
        return ResponseEntity.ok(gameService.connectToRandomGame(player));
    }

    @PostMapping("/sow")
    public ResponseEntity<Game> sow(@RequestBody Sow sow) throws GameException {
        log.info("sow: {}", sow);
        Game game = gameService.sow(sow);
        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + game.getId(), new GameUpdate(game));
        // simpMessagingTemplate.convertAndSend("/topic/game-progress/" + game.getId(), game);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/move")
    public ResponseEntity<Game> move(@RequestBody Sow sow) throws GameException {
        log.info("move: {}", sow);
        Game game = gameService.sow(sow);
        game.setLastStr(sow.getNewName());

        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + game.getId(), new GameUpdate(game));
        return ResponseEntity.ok(game);
    }

    @GetMapping("/gameslog")
    public ResponseEntity<List<Game>> gameslog() throws GameException {
        log.info("gameslog request:");
        return ResponseEntity.ok(gameService.getAllCurrentGames());
    }

    @PostMapping("/endgame")
    public ResponseEntity<Void> endGame(@RequestBody String id) throws GameException {
        log.info("game endend via request: {}", id);
        gameService.endGame(id);
        return ResponseEntity.ok().build();
    }
}
