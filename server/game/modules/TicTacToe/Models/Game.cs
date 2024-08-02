using TicTacToe.Enums;

namespace TicTacToe.Models
{
    public class Game
    {
        private Player _player1;
        private Player _player2;
        private PlayerSign[] _board = new PlayerSign[9];
        private byte _turn = 0;

        public Player CurrentPlayer { get; private set; }
        public bool HasEnded { get; private set; } = false;
        public Player? Winner { get; private set; } = null;

        public Game(Player player1, Player player2)
        {
            _player1 = player1 ?? throw new ArgumentNullException(nameof(player1));
            _player2 = player2 ?? throw new ArgumentNullException(nameof(player2));

            for (int i = 0; i < _board.Length; i++)
            {
                _board[i] = (PlayerSign)'-'; // Use '-' to represent an empty position
            }

            CurrentPlayer = GetFirstPlayer();
            SetSigns();
        }

        public MoveResult MakeMove(Player interactingPlayer, byte interactedIndex)
        {
            if (HasEnded || interactingPlayer != CurrentPlayer || interactedIndex < 0 || interactedIndex >= _board.Length || _board[interactedIndex] != (PlayerSign)'-')
            {
                return MoveResult.InvalidMove;
            }

            _board[interactedIndex] = interactingPlayer.Sign;
            _turn++;

            if (_turn >= 5 && CheckWinner(interactingPlayer))
            {
                HasEnded = true;
                interactingPlayer.Wins++;
                Winner = interactingPlayer;
                return MoveResult.Win;
            }

            if (_turn == 9)
            {
                HasEnded = true;
                return MoveResult.Draw;
            }

            SwitchPlayer();
            return MoveResult.Success;
        }

        private bool CheckWinner(Player player)
        {
            PlayerSign sign = player.Sign;
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
            return random.Next(2) == 0 ? _player1 : _player2;
        }

        private void SetSigns()
        {
            if (CurrentPlayer == _player1)
            {
                _player1.Sign = PlayerSign.X;
                _player2.Sign = PlayerSign.O;
            }
            else
            {
                _player1.Sign = PlayerSign.O;
                _player2.Sign = PlayerSign.X;
            }
        }

        private void SwitchPlayer()
        {
            CurrentPlayer = CurrentPlayer == _player1 ? _player2 : _player1;
        }
    }
}
