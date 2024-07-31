namespace TicTacToe.Models
{
    public class Player
    {
        public string Username { get; }

        private char _sign;
        public char Sign
        {
            get => _sign;
            set
            {
                if (value != 'X' && value != 'O')
                {
                    throw new ArgumentException("Sign must be either 'X' or 'O'.");
                }
                _sign = value;
            }
        }

        private int _wins;
        public int Wins
        {
            get => _wins;
            set
            {
                if (value < 0)
                {
                    throw new ArgumentException("Wins cannot be less than 0.");
                }
                _wins = value;
            }
        }

        public Player(string username)
        {
            Username = username ?? throw new ArgumentNullException(nameof(username));
            Wins = 0;
        }
    }
}
