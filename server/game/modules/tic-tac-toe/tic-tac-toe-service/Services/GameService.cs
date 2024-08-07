using StackExchange.Redis;
using System.Text.Json;
using TicTacToe.Enums;
using TicTacToe.Models;

namespace TicTacToe.Services
{
    public class GameService : IGameService
    {
        private readonly IDatabase _redisDb;

        public GameService(IConnectionMultiplexer redis)
        {
            _redisDb = redis.GetDatabase();
        }

        private string GenerateGameKey(string username1, string username2)
        {
            var sortedUsernames = new[] { username1, username2 }.OrderBy(u => u).ToArray();
            return string.Join("_", sortedUsernames);
        }

        public Game GetGame(string username1, string username2)
        {
            string gameKey = GenerateGameKey(username1, username2);
            var gameData = _redisDb.StringGet(gameKey);

            if (gameData.IsNullOrEmpty)
            {
                throw new ArgumentException("No game exists between these players.");
            }

            return DeserializeGame(gameData);
        }

        public Player StartGame(Player player1, Player player2)
        {
            if (player1 == null || player2 == null)
            {
                throw new ArgumentNullException("Player1 and Player2 cannot be null.");
            }

            string gameKey = GenerateGameKey(player1.Username, player2.Username);

            if (_redisDb.KeyExists(gameKey))
            {
                throw new ArgumentException("A game between these players already exists.");
            }

            var newGame = new Game(player1, player2);
            _redisDb.StringSet(gameKey, SerializeGame(newGame));
            return newGame.CurrentPlayer;
        }

        public MoveResult MakeMove(string player1Username, string player2Username, string interactingPlayerUsername, byte interactingIndex)
        {
            var game = GetGame(player1Username, player2Username);
            var moveResult = game.MakeMove(interactingPlayerUsername, interactingIndex);

            if (game.HasEnded)
            {
                RemoveGame(game);
            }
            else
            {
                string gameKey = GenerateGameKey(player1Username, player2Username);
                _redisDb.StringSet(gameKey, SerializeGame(game));
            }

            return moveResult;
        }

        public void Surrender(string player1Username, string player2Username, string surrenderedPlayerUsername)
        {
            var game = GetGame(player1Username, player2Username);
            game.Finish(surrenderedPlayerUsername);
            RemoveGame(game);
        }

        private void RemoveGame(Game game)
        {
            string gameKey = GenerateGameKey(game.Player1.Username, game.Player2.Username);
            _redisDb.KeyDelete(gameKey);
        }

        private string SerializeGame(Game game)
        {
            return JsonSerializer.Serialize(game);
        }

        private Game DeserializeGame(string gameData)
        {
            var deserializedData = JsonSerializer.Deserialize<Game>(gameData);

            if (deserializedData == null)
            {
                throw new ArgumentNullException(nameof(deserializedData), "Data cannot be null.");
            }

            return deserializedData;
        }
    }
}
