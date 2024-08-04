using TicTacToe.Enums;
using TicTacToe.Models;

namespace TicTacToe.Services
{
    public interface IGameService
    {
        Game GetGame(string username1, string username2);
        Player StartGame(Player player1, Player player2);
        MoveResult MakeMove(Player player1, Player player2, Player interactingPlayer, byte interactingIndex);
        void Surrender(Player player1, Player player2, string surrenderedPlayerUsername);
    }
}
