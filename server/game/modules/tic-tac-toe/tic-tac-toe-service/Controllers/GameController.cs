using Microsoft.AspNetCore.Mvc;
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
            try
            {
                var gameInfo = _gameService.GetCurrentGameInfo(player1Username, player2Username);

                return Ok(new { game = gameInfo });
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }


        [HttpPost("start")]
        public IActionResult StartGame(string player1Username, string player2Username)
        {
            try
            {
                var players = _playerService.GetPlayers(player1Username, player2Username);
                var currentPlayer = _gameService.StartGame(players[0], players[1]);

                return Ok(new { CurrentPlayer = currentPlayer.Username });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("move")]
        public IActionResult MakeMove(string player1Username, string player2Username, string interactingPlayerUsername, byte interactingIndex)
        {
            try
            {
                var moveResult = _gameService.MakeMove(player1Username, player2Username, interactingPlayerUsername, interactingIndex);

                var game = _gameService.GetGame(player1Username, player2Username);

                if (game.HasEnded)
                {
                    _playerService.UpdatePlayersAsync(game.Player1, game.Player2);
                    _gameService.RemoveGame(game);
                }

                return Ok(new { MoveResult = moveResult.ToString() });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("surrender")]
        public IActionResult Surrender(string player1Username, string player2Username, string surrenderedPlayerUsername)
        {
            try
            {
                _gameService.Surrender(player1Username, player2Username, surrenderedPlayerUsername);

                var game = _gameService.GetGame(player1Username, player2Username);

                _playerService.UpdatePlayersAsync(game.Player1, game.Player2);
                _gameService.RemoveGame(game);

                return Ok("Game ended by surrender.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
