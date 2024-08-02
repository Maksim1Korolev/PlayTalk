﻿using TicTacToe.Enums;
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

        public Player StartGame(Player player1, Player player2)
        {
            if (player1 == null || player2 == null)
            {
                throw new ArgumentNullException("Player1 and Player2 cannot be null.");
            }

            string gameKey = GenerateGameKey(player1.Username, player2.Username);

            if (_activeGames.ContainsKey(gameKey))
            {
                throw new ArgumentException("A game between these players already exists.");
            }

            var newGame = new Game(player1, player2);
            _activeGames[gameKey] = newGame;
            return GetCurrentPlayer(player1, player2);
        }

        public Player GetCurrentPlayer(Player player1, Player player2)
        {
            if (player1 == null || player2 == null)
            {
                throw new ArgumentNullException("Player1 and Player2 cannot be null.");
            }

            var game = GetGame(player1.Username, player2.Username);

            if (game == null)
            {
                throw new ArgumentException("No game exists between these players.");
            }

            return game.CurrentPlayer;
        }

        public MoveResult MakeMove(Player player1, Player player2, Player interactingPlayer, byte interactingIndex)
        {
            var game = GetGame(player1.Username, player2.Username);

            if (game == null)
            {
                throw new ArgumentException("No game exists between these players.");
            }

            var moveResult = game.MakeMove(interactingPlayer, interactingIndex);

            switch (moveResult)
            {
                case MoveResult.InvalidMove:
                    throw new ArgumentException("Impossible to make that move.");

                case MoveResult.Win:
                    HandleGameEnd(game, $"Player {game.Winner.Username} wins!");

                    break;

                case MoveResult.Draw:
                    HandleGameEnd(game, "The game is a draw!");

                    break;
            }

            return moveResult;
        }

        private void HandleGameEnd(Game game, string message)
        {
            Console.WriteLine(message);
            // string gameKey = GenerateGameKey(game.CurrentPlayer.Username, game.Winner.Username);
            // _activeGames.Remove(gameKey);
        }
    }
}
