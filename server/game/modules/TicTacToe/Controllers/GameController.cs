using Microsoft.AspNetCore.Mvc;
using TicTacToe.Models;
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
        public IActionResult GetGame(string username1, string username2)
        {
            try
            {
                var game = _gameService.GetGame(username1, username2);
                return Ok(game);
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

                return Ok(new { CurrentPlayer = currentPlayer });
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
                return Ok(new { MoveResult = moveResult });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("surrender")]
        public IActionResult Surrender(Player player1, Player player2, string surrenderedPlayerUsername)
        {
            try
            {
                _gameService.Surrender(player1, player2, surrenderedPlayerUsername);
                return Ok("Game ended by surrender.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
