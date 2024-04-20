Shyv
---
Websocket Game Base idk yet xd

## Features
* Connect to game, send cat/dog, end games from list of unfinished Games
* View current active games

Technologies
------------
- `Spring Boot`
- `WebSocket`  for getting changes and refreshing game board
- `MongoDB` for persisting the Game information
- `HTML and js` for providing simple UI and calling rest service
- `Docker` for containerization of services
- `Docker-Compose`  to link the containers

### How to launch
In your CMD Run
```Shell
mvnw.cmd spring-boot:run
```
Visit `http://localhost:8080` to see the app c:

NOTE: If you shouldnt be using windows try run `./mvnw` instead of `mvnw.cmd`

## Deployment
Packaging the Project into `.jar`, run:
```Shell
mvnw.cmd clean package
```
Info: run in cmd not powershell....
To run the projct on docker visit [spring-boot-docker](https://spring.io/guides/topicals/spring-boot-docker)

[Base Source](https://ehsanasadev.github.io/Create_interactive_game_with_Spring_Boot_and_WebSocket/)
