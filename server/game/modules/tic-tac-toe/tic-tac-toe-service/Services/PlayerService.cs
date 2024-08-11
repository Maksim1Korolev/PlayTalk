using TicTacToe.Models;

namespace TicTacToe.Services
{
    public class PlayerService : IPlayerService
    {
        public Player[] GetPlayers(string player1Username, string player2Username)
        {
            return [new Player(player1Username), new Player(player2Username)];
        }

        public void UpdatePlayers(Player player1NewData, Player player2NewData)
        {
            return;
        }
    }
}
