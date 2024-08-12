using TicTacToe.Enums;
using TicTacToe.Models;

namespace TicTacToe.Services
{
    public interface IGameService
    {
        Game GetGame(string username1, string username2);
        Player StartGame(Player player1, Player player2);
        MoveResult MakeMove(string player1Username, string player2Username, string interactingPlayerUsername, byte interactingIndex);
        void Surrender(string player1Username, string player2Username, string surrenderedPlayerUsername);
        void RemoveGame(Game game);
    }
}
