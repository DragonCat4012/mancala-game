package ex.com.challenge.service;

import ex.com.challenge.exception.GameException;
import ex.com.challenge.model.*;
import org.springframework.stereotype.Service;

/**
 * @author Ehsan Sh
 */

@Service
public class SowService {

    public Game sow(Game game, Integer pitIndex) {

        //Exception
        checkException(game);

        //Rules

        //End Game
        if (checkEndGame(game))
            return game;

        //player turn

        return game;
    }

    private void setPlayerTurn(Game game, Pit lastPin) {
        game.setPlayerTurn(PlayerTurnEnum.togglePlayerTurn(game.getPlayerTurn()));
    }

    private boolean checkEndGame(Game game) {
        return false;
    }

    private Pit doSow(Game game, Integer pitIndex, Pit selectedPit) {
        Integer currentPitIndex = pitIndex;
        for (int i = 1; i <= selectedPit.getStones() - 1; i++) {
            currentPitIndex = calculateNextPitIndex(game, currentPitIndex);
        }

        selectedPit.setStones(0);

        currentPitIndex = calculateNextPitIndex(game, currentPitIndex);

        //Capture

        return null;
    }

    private void checkException(Game game) {
        if (game.getStatus() == GameStatusEnum.FINISHED) {
            throw new GameException("The status of game is finished!");
        }
    }

    private Integer calculateNextPitIndex(Game game, Integer currentPitIndex) {
        currentPitIndex = (currentPitIndex + 1) % 15 == 0 ? (currentPitIndex + 1) % 15 + 1 : (currentPitIndex + 1) % 15;

        if (ifCurrentPitIndexIs_a_LargeRightPit_but_belongToThePlayerWhoNowIsNotTurn(game, currentPitIndex)) {
            currentPitIndex = (currentPitIndex + 1) % 15 == 0 ? (currentPitIndex + 1) % 15 + 1
                    : (currentPitIndex + 1) % 15;
        }
        return currentPitIndex;
    }

    private boolean ifCurrentPitIndexIs_a_LargeRightPit_but_belongToThePlayerWhoNowIsNotTurn(Game game,
            Integer currentPitIndex) {
        return false;

    }

}
