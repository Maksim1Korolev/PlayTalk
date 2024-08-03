using TicTacToe.Enums;
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

        private Game GetGame(string username1, string username2)
        {
            string gameKey = GenerateGameKey(username1, username2);

            if (!_activeGames.TryGetValue(gameKey, out var game))
            {
                throw new ArgumentException("No game exists between these players.");
            }

            return game;
        }

        public Player StartGame(Player player1, Player player2)
        {
            string gameKey = GenerateGameKey(player1.Username, player2.Username);

            if (_activeGames.ContainsKey(gameKey))
            {
                throw new ArgumentException("A game between these players already exists.");
            }

            var newGame = new Game(player1, player2);
            _activeGames[gameKey] = newGame;
            return newGame.CurrentPlayer;
        }

        public Player GetCurrentPlayer(Player player1, Player player2)
        {
            var game = GetGame(player1.Username, player2.Username);
            return game.CurrentPlayer;
        }

        public MoveResult MakeMove(Player player1, Player player2, Player interactingPlayer, byte interactingIndex)
        {
            var game = GetGame(player1.Username, player2.Username);
            var moveResult = game.MakeMove(interactingPlayer, interactingIndex);

            if (game.HasEnded)
            {
                RemoveGame(game);
            }

            return moveResult;
        }

        public void Surrender(Player player1, Player player2, string surrenderedPlayerUsername)
        {
            var game = GetGame(player1.Username, player2.Username);
            game.Finish(surrenderedPlayerUsername);
            RemoveGame(game);
        }

        private void RemoveGame(Game game)
        {
            string gameKey = GenerateGameKey(game.Player1.Username, game.Player2.Username);
            _activeGames.Remove(gameKey);
        }
    }
}
