using Microsoft.AspNetCore.Mvc;
using Serilog;
using Serilog.Context;
using TicTacToe.Services;

namespace TicTacToe.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IPlayerService _playerService;

        public GameController(IGameService gameService, IPlayerService playerService)
        {
            _gameService = gameService;
            _playerService = playerService;
        }

        [HttpGet("game")]
        public IActionResult GetGame(string player1Username, string player2Username)
        {
            using (LogContext.PushProperty("Context", "GameController.GetGame"))
            {
                Log.Information("Fetching game between {Player1} and {Player2}", player1Username, player2Username);

                try
                {
                    var gameInfo = _gameService.GetCurrentGameInfo(player1Username, player2Username);
                    Log.Information("Successfully fetched game info between {Player1} and {Player2}", player1Username, player2Username);

                    return Ok(new { game = gameInfo });
                }
                catch (ArgumentException ex)
                {
                    Log.Warning("Game between {Player1} and {Player2} not found: {ErrorMessage}", player1Username, player2Username, ex.Message);
                    return NotFound(ex.Message);
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Error fetching game between {Player1} and {Player2}", player1Username, player2Username);
                    return StatusCode(500, "Internal server error");
                }
            }
        }

        [HttpPost("start")]
        public IActionResult StartGame(string player1Username, string player2Username)
        {
            using (LogContext.PushProperty("Context", "GameController.StartGame"))
            {
                Log.Information("Starting game between {Player1} and {Player2}", player1Username, player2Username);

                try
                {
                    var players = _playerService.GetPlayers(player1Username, player2Username);
                    var currentPlayer = _gameService.StartGame(players[0], players[1]);

                    Log.Information("Game started successfully between {Player1} and {Player2}. Current player: {CurrentPlayer}", player1Username, player2Username, currentPlayer.Username);

                    return Ok(new { CurrentPlayer = currentPlayer.Username });
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Error starting game between {Player1} and {Player2}", player1Username, player2Username);
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpPost("move")]
        public IActionResult MakeMove(string player1Username, string player2Username, string interactingPlayerUsername, byte interactingIndex)
        {
            using (LogContext.PushProperty("Context", "GameController.MakeMove"))
            {
                Log.Information("Making move for {InteractingPlayer} in game between {Player1} and {Player2} at index {InteractingIndex}", interactingPlayerUsername, player1Username, player2Username, interactingIndex);

                try
                {
                    var moveResult = _gameService.MakeMove(player1Username, player2Username, interactingPlayerUsername, interactingIndex);
                    var game = _gameService.GetGame(player1Username, player2Username);

                    if (game.HasEnded)
                    {
                        Log.Information("Game between {Player1} and {Player2} has ended. Updating players and removing game.", player1Username, player2Username);

                        _playerService.UpdatePlayersAsync(game.Player1, game.Player2);
                        _gameService.RemoveGame(game);
                    }

                    Log.Information("Move successful for {InteractingPlayer} in game between {Player1} and {Player2}. Move result: {MoveResult}", interactingPlayerUsername, player1Username, player2Username, moveResult);

                    return Ok(new { MoveResult = moveResult.ToString() });
                }
                catch (ArgumentException ex)
                {
                    Log.Warning("Invalid move for {InteractingPlayer} in game between {Player1} and {Player2}: {ErrorMessage}", interactingPlayerUsername, player1Username, player2Username, ex.Message);
                    return BadRequest(ex.Message);
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Error making move for {InteractingPlayer} in game between {Player1} and {Player2}", interactingPlayerUsername, player1Username, player2Username);
                    return StatusCode(500, "Internal server error");
                }
            }
        }

        [HttpPost("surrender")]
        public IActionResult Surrender(string player1Username, string player2Username, string surrenderedPlayerUsername)
        {
            using (LogContext.PushProperty("Context", "GameController.Surrender"))
            {
                Log.Information("{SurrenderedPlayer} surrendered in game between {Player1} and {Player2}", surrenderedPlayerUsername, player1Username, player2Username);

                try
                {
                    var game = _gameService.GetGame(player1Username, player2Username);
                    game.Finish(surrenderedPlayerUsername);

                    _playerService.UpdatePlayersAsync(game.Player1, game.Player2);
                    _gameService.RemoveGame(game);

                    Log.Information("Game ended by surrender for {Player1} and {Player2}. Surrendered player: {SurrenderedPlayer}", player1Username, player2Username, surrenderedPlayerUsername);

                    return Ok("Game ended by surrender.");
                }
                catch (ArgumentException ex)
                {
                    Log.Warning("Error in surrender: {ErrorMessage}", ex.Message);
                    return BadRequest(ex.Message);
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Error during surrender in game between {Player1} and {Player2}", player1Username, player2Username);
                    return StatusCode(500, "Internal server error");
                }
            }
        }
    }
}
