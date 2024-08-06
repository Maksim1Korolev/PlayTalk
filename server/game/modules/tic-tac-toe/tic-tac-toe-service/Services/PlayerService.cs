using TicTacToe.Models;

namespace TicTacToe.Services
{
    public class PlayerService : IPlayerService
    {
        public Player[] GetPlayers(string player1Username, string player2Username)
        {
            var players = new Player[] { new Player(player1Username), new Player(player2Username) };
            return players;
        }

        public Player UpdatePlayer(Player player)
        {
            return player;
        }
    }
}
