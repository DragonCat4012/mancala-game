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

        Pit selectedPit = game.getPitByIndex(pitIndex);

        //Exception
        checkException(game);

        //Rules
        Pit lastPin = doSow(game, pitIndex, selectedPit);

        //End Game
        if (checkEndGame(game))
            return game;

        //player turn
        setPlayerTurn(game, lastPin);

        return game;
    }

    private void setPlayerTurn(Game game, Pit lastPin) {

        game.setPlayerTurn(PlayerTurnEnum.togglePlayerTurn(game.getPlayerTurn()));

    }

    private boolean checkEndGame(Game game) {
        Integer stoneSumOfFirstPlayer = 0;
        for (int i = 1; i < 7; i++) {
            stoneSumOfFirstPlayer = stoneSumOfFirstPlayer + game.getPitByIndex(i).getStones();
        }
        Integer stoneSumOfSecondPlayer = 0;
        for (int i = 8; i < 14; i++) {
            stoneSumOfSecondPlayer = stoneSumOfSecondPlayer + game.getPitByIndex(i).getStones();
        }

        return false;
    }

    private Pit doSow(Game game, Integer pitIndex, Pit selectedPit) {
        Integer currentPitIndex = pitIndex;
        for (int i = 1; i <= selectedPit.getStones() - 1; i++) {
            currentPitIndex = calculateNextPitIndex(game, currentPitIndex);

            game.getPitByIndex(currentPitIndex).sow();
        }

        selectedPit.setStones(0);

        currentPitIndex = calculateNextPitIndex(game, currentPitIndex);
        Pit lastPin = game.getPitByIndex(currentPitIndex);
        Pit oppositePit = game.getPitByIndex(14 - currentPitIndex != 0 ? 14 - currentPitIndex : 7);

        //Capture

        lastPin.sow();

        return lastPin;
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
