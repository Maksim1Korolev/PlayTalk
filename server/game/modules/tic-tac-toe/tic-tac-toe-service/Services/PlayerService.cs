﻿using System.Text;
using System.Text.Json;
using TicTacToe.Models;

namespace TicTacToe.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly HttpClient _httpClient;
        private readonly string _repositoryServiceUrl;

        public PlayerService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _repositoryServiceUrl = configuration["TIC_TAC_TOE_REPOSITORY_SERVICE_URL"] ?? "http://tic_tac_toe_repository_service:8082/api";
        }

        public Player[] GetPlayers(string player1Username, string player2Username)
        {
            return [new Player(player1Username), new Player(player2Username)];
        }

        public async Task UpdatePlayersAsync(Player player1NewData, Player player2NewData)
        {
            var player1Data = new
            {
                username = player1NewData.Username.ToLower(),
                wins = player1NewData.Wins
            };

            var player2Data = new
            {
                username = player2NewData.Username.ToLower(),
                wins = player2NewData.Wins
            };

            var updatedData = new
            {
                player1NewData = player1Data,
                player2NewData = player2Data
            };

            var content = new StringContent(
                JsonSerializer.Serialize(updatedData),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PutAsync($"{_repositoryServiceUrl}/players", content);

            if (!response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Response Code: {response.StatusCode}, Response Content: {responseContent}");
                throw new Exception("Failed to update players in the repository service.");
            }
        }
    }
}