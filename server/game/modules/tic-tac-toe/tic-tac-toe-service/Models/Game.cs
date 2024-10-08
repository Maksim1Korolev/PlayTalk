﻿using Newtonsoft.Json;
using TicTacToe.Enums;

namespace TicTacToe.Models
{
    public class Game
    {
        [JsonProperty]
        private byte _turn = 1;
        [JsonProperty]
        public char[] Board { get; private set; } = new char[9];
        [JsonProperty]
        public Player Player1 { get; private set; } = null!;
        [JsonProperty]
        public Player Player2 { get; private set; } = null!;
        [JsonProperty]
        public Player CurrentPlayer { get; private set; } = null!;
        [JsonProperty]
        public bool HasEnded { get; private set; } = false;

        [JsonConstructor]
        private Game() { }

        public Game(Player player1, Player player2)
        {
            Player1 = player1 ?? throw new ArgumentNullException(nameof(player1));
            Player2 = player2 ?? throw new ArgumentNullException(nameof(player2));

            Array.Fill(Board, '-');

            CurrentPlayer = GetFirstPlayer();
            SetSigns();
        }

        public MoveResult MakeMove(string interactingPlayerUsername, byte interactingIndex)
        {
            if (HasEnded || interactingPlayerUsername != CurrentPlayer.Username || interactingIndex < 0 || interactingIndex >= Board.Length || Board[interactingIndex] != '-')
            {
                return MoveResult.InvalidMove;
            }

            Board[interactingIndex] = CurrentPlayer.Sign.ToChar();

            if (_turn >= 5 && CheckWinner(CurrentPlayer))
            {
                Finish();
                return MoveResult.Win;
            }

            if (_turn == 9)
            {
                Finish();
                return MoveResult.Draw;
            }

            _turn++;
            SwitchPlayer();
            return MoveResult.Success;
        }

        public void Finish(string surrenderedPlayerUsername = "")
        {
            HasEnded = true;

            if (surrenderedPlayerUsername != "")
            {
                if (surrenderedPlayerUsername == Player1.Username)
                {
                    Player2.Wins++;
                }
                else
                {
                    Player1.Wins++;
                }
                return;
            }


            //Have to check according to usernames, because redis get returns different instance of CurrentPlayer
            if (CurrentPlayer.Username == Player1.Username)
            {
                Player1.Wins++;
            }
            else
            {
                Player2.Wins++;
            }
        }


        private bool CheckWinner(Player player)
        {
            char sign = player.Sign.ToChar();
            byte[,] winningCombinations = new byte[,]
            {
                { 0, 1, 2 }, { 3, 4, 5 }, { 6, 7, 8 },
                { 0, 3, 6 }, { 1, 4, 7 }, { 2, 5, 8 },
                { 0, 4, 8 }, { 2, 4, 6 }
            };

            for (int i = 0; i < winningCombinations.GetLength(0); i++)
            {
                if (Board[winningCombinations[i, 0]] == sign &&
                    Board[winningCombinations[i, 1]] == sign &&
                    Board[winningCombinations[i, 2]] == sign)
                {
                    return true;
                }
            }
            return false;
        }

        private Player GetFirstPlayer()
        {
            Random random = new Random();
            return random.Next(2) == 0 ? Player1 : Player2;
        }

        private void SetSigns()
        {
            if (CurrentPlayer == Player1)
            {
                Player1.Sign = PlayerSign.X;
                Player2.Sign = PlayerSign.O;
            }
            else
            {
                Player1.Sign = PlayerSign.O;
                Player2.Sign = PlayerSign.X;
            }
        }

        private void SwitchPlayer()
        {
            CurrentPlayer = CurrentPlayer.Username == Player1.Username ? Player2 : Player1;
        }
    }
}
