namespace TicTacToe.Models
{
    public class Game
    {
        public Player Player1 { get; }
        public Player Player2 { get; }
        public char[] Board { get; set; }

        public Game(Player player1, Player player2)
        {
            Player1 = player1;
            Player2 = player2;

            Board = new char[9];
            for (int i = 0; i < Board.Length; i++)
            {
                Board[i] = '-';
            }
        }
    }
}
