using TicTacToe.Models;

namespace TicTacToe.Services
{
    public class GameService
    {
        private Dictionary<string, Game> _activeGames = new Dictionary<string, Game>();

        private string GenerateGameKey(string username1, string username2)
        {
            var sortedUsernames = new[] { username1, username2 }.OrderBy(u => u).ToArray();
            return string.Join("_", sortedUsernames);
        }

        private Game? GetGame(string username1, string username2)
        {
            string gameKey = GenerateGameKey(username1, username2);
            _activeGames.TryGetValue(gameKey, out var game);
            return game;
        }

        public void StartGame(Player player1, Player player2)
        {
            string gameKey = GenerateGameKey(player1.Username, player2.Username);
            Game newGame = new Game(player1, player2);
            _activeGames[gameKey] = newGame;
        }
    }
