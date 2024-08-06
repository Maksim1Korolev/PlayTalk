namespace TicTacToe.Enums
{
    public enum PlayerSign
    {
        X = 'X',
        O = 'O'
    }

    public static class PlayerSignExtensions
    {
        public static char ToChar(this PlayerSign sign)
        {
            return (char)sign;
        }
    }
}
