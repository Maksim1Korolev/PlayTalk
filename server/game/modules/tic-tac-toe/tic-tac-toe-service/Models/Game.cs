using Newtonsoft.Json;
using TicTacToe.Enums;

namespace TicTacToe.Models
{
    public class Game
    {
        [JsonProperty]
        private char[] _board = new char[9];

        [JsonProperty]
        public Player Player1 { get; private set; }

        [JsonProperty]
        public Player Player2 { get; private set; }

        [JsonProperty]
        public Player CurrentPlayer { get; private set; }

        [JsonProperty]
        public byte Turn { get; private set; } = 1;

        [JsonProperty]
        public bool HasEnded { get; private set; } = false;

        [JsonProperty]
        public Player? Winner { get; private set; } = null;

        [JsonConstructor]
        private Game() { }
        public Game(Player player1, Player player2)
        {
            Player1 = player1 ?? throw new ArgumentNullException(nameof(player1));
            Player2 = player2 ?? throw new ArgumentNullException(nameof(player2));

            Array.Fill(_board, '-');

            CurrentPlayer = GetFirstPlayer();
            SetSigns();
        }

        public MoveResult MakeMove(string interactingPlayerUsername, byte interactedIndex)
        {
            if (HasEnded || interactingPlayerUsername != CurrentPlayer.Username || interactedIndex < 0 || interactedIndex >= _board.Length || _board[interactedIndex] != '-')
            {
                return MoveResult.InvalidMove;
            }

            _board[interactedIndex] = CurrentPlayer.Sign.ToChar();
            Turn++;

            if (Turn >= 5 && CheckWinner(CurrentPlayer))
            {
                Finish();
                return MoveResult.Win;
            }

            if (Turn == 9)
            {
                Finish();
                return MoveResult.Draw;
            }

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
                    return;
                }

                Player1.Wins++;
                return;
            }

            Winner = CurrentPlayer;
            CurrentPlayer.Wins++;
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
                if (_board[winningCombinations[i, 0]] == sign &&
                    _board[winningCombinations[i, 1]] == sign &&
                    _board[winningCombinations[i, 2]] == sign)
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
