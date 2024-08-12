using TicTacToe.Models;

namespace TicTacToe.Services
{
    public interface IPlayerService
    {
        Player[] GetPlayers(string player1Username, string player2Username);
        Task UpdatePlayersAsync(Player player1NewData, Player player2NewData);
    }
}
