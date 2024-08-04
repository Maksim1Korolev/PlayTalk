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

        public GameController(IGameService gameService)
        {
            _gameService = gameService;
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
        public IActionResult StartGame(Player player1, Player player2)
        {
            try
            {
                var currentPlayer = _gameService.StartGame(player1, player2);
                return Ok(new { CurrentPlayer = currentPlayer });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("move")]
        public IActionResult MakeMove(Player player1, Player player2, Player interactingPlayer, byte interactingIndex)
        {
            try
            {
                var moveResult = _gameService.MakeMove(player1, player2, interactingPlayer, interactingIndex);
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
