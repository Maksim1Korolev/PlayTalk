﻿using TicTacToe.Models;

namespace TicTacToe.Services
{
    public interface IPlayerService
    {
        Player[] GetPlayers(string player1Username, string player2Username);
        Player UpdatePlayer(Player player);
    }
}
