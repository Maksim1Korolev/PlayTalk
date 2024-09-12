using Newtonsoft.Json;
using Serilog;
using Serilog.Context;
using StackExchange.Redis;
using TicTacToe.Enums;
using TicTacToe.Models;

namespace TicTacToe.Services
{
    public class GameService : IGameService
    {
        private readonly IDatabase _redisDb;
        private const string RedisGameHashKey = "ticTacToeUsernamesGame";

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
            Log.Information("Fetching game for {Player1} and {Player2} with gameKey: {GameKey}", username1, username2, gameKey);

            var gameData = _redisDb.HashGet(RedisGameHashKey, gameKey);

            if (gameData.IsNullOrEmpty)
            {
                Log.Warning("No game found between {Player1} and {Player2}.", username1, username2);
                throw new ArgumentException("No game exists between these players.");
            }

            return DeserializeGame(gameData!);
        }

        public object GetCurrentGameInfo(string username1, string username2)
        {
            using (LogContext.PushProperty("Context", "GameService.GetCurrentGameInfo"))
            {
                var game = GetGame(username1, username2);

                Log.Information("Retrieving current game info for {Player1} and {Player2}.", username1, username2);

                var updatedGame = new
                {
                    player1 = new
                    {
                        username = game.Player1.Username,
                        sign = game.Player1.Sign.ToChar()
                    },
                    player2 = new
                    {
                        username = game.Player2.Username,
                        sign = game.Player2.Sign.ToChar()
                    },
                    currentPlayer = game.CurrentPlayer.Username,
                    board = game.Board
                };

                return updatedGame;
            }
        }

        public Player StartGame(Player player1, Player player2)
        {
            using (LogContext.PushProperty("Context", "GameService.StartGame"))
            {
                if (player1 == null || player2 == null)
                {
                    Log.Error("Player1 or Player2 is null. Unable to start the game.");
                    throw new ArgumentNullException("Player1 and Player2 cannot be null.");
                }

                string gameKey = GenerateGameKey(player1.Username, player2.Username);
                Log.Information("Starting new game between {Player1} and {Player2}. GameKey: {GameKey}", player1.Username, player2.Username, gameKey);

                if (_redisDb.HashExists(RedisGameHashKey, gameKey))
                {
                    Log.Warning("Game already exists between {Player1} and {Player2}.", player1.Username, player2.Username);
                    throw new ArgumentException("A game between these players already exists.");
                }

                var newGame = new Game(player1, player2);
                _redisDb.HashSet(RedisGameHashKey, gameKey, SerializeGame(newGame));
                Log.Information("Game started successfully between {Player1} and {Player2}.", player1.Username, player2.Username);
                return newGame.CurrentPlayer;
            }
        }

        public MoveResult MakeMove(string player1Username, string player2Username, string interactingPlayerUsername, byte interactingIndex)
        {
            using (LogContext.PushProperty("Context", "GameService.MakeMove"))
            {
                Log.Information("Player {InteractingPlayer} making move at index {Index} in game between {Player1} and {Player2}.", interactingPlayerUsername, interactingIndex, player1Username, player2Username);

                var game = GetGame(player1Username, player2Username);
                var moveResult = game.MakeMove(interactingPlayerUsername, interactingIndex);

                string gameKey = GenerateGameKey(player1Username, player2Username);
                _redisDb.HashSet(RedisGameHashKey, gameKey, SerializeGame(game));

                Log.Information("Move result for {InteractingPlayer}: {MoveResult}", interactingPlayerUsername, moveResult.ToString());

                return moveResult;
            }
        }

        public void RemoveGame(Game game)
        {
            using (LogContext.PushProperty("Context", "GameService.RemoveGame"))
            {
                string gameKey = GenerateGameKey(game.Player1.Username, game.Player2.Username);
                Log.Information("Removing game between {Player1} and {Player2}.", game.Player1.Username, game.Player2.Username);
                _redisDb.HashDelete(RedisGameHashKey, gameKey);
            }
        }

        private string SerializeGame(Game game)
        {
            Log.Debug("Serializing game between {Player1} and {Player2}.", game.Player1.Username, game.Player2.Username);
            string serializedData = JsonConvert.SerializeObject(game);
            return serializedData;
        }

        private Game DeserializeGame(string gameData)
        {
            Log.Debug("Deserializing game data.");
            var deserializedData = JsonConvert.DeserializeObject<Game>(gameData);

            if (deserializedData == null)
            {
                Log.Error("Failed to deserialize game data.");
                throw new ArgumentNullException(nameof(deserializedData), "Data cannot be null.");
            }

            return deserializedData;
        }
    }
}
