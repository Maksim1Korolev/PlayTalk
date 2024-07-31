namespace TicTacToe.Models
{
    public class Game
    {
        public Player Player1 { get; }
        public Player Player2 { get; }

        public Player CurrentPlayer { get; private set; }
        public bool HasEnded { get; private set; } = false;
        public Player? Winner { get; private set; } = null;

        private char[] _board = new char[9];
        private byte _turn = 0;

        public Game(Player player1, Player player2)
        {
            Player1 = player1;
            Player2 = player2;

            Array.Fill(_board, '-');

            CurrentPlayer = GetFirstPlayer();
        }

        public bool MakeMove(Player interactingPlayer, byte interactedIndex)
        {
            if (HasEnded || interactingPlayer != CurrentPlayer || interactedIndex < 0 || interactedIndex >= _board.Length || _board[interactedIndex] != '-')
            {
                return false;
            }

            _board[interactedIndex] = interactingPlayer.Sign;
            _turn++;

            if (_turn >= 5 && CheckWinner(interactingPlayer))
            {
                HasEnded = true;
                interactingPlayer.Wins++;
                Winner = interactingPlayer;
                return true;
            }

            if (_turn == 9)
            {
                HasEnded = true;
                return true;
            }

            SwitchPlayer();
            return true;
        }

        private bool CheckWinner(Player player)
        {
            char sign = player.Sign;
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

        private void SwitchPlayer()
        {
            CurrentPlayer = CurrentPlayer == Player1 ? Player2 : Player1;
        }
    }
}
