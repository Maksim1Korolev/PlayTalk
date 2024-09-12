using Serilog;
using Serilog.Context;
using System.Text;
using System.Text.Json;
using TicTacToe.Models;

namespace TicTacToe.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly HttpClient _httpClient;
        private readonly string _repositoryServiceUrl;
        private readonly string _internalServiceHeaderKey;
        private readonly string _serviceName;

        public PlayerService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _repositoryServiceUrl = configuration["TIC_TAC_TOE_REPOSITORY_SERVICE_URL"] ?? "http://tic_tac_toe_repository_service:8082/api";
            _internalServiceHeaderKey = Environment.GetEnvironmentVariable("INTERNAL_SERVICE_HEADER")
                ?? configuration["ServiceSettings:InternalServiceHeader"]
                ?? "internal-service";
            _serviceName = "tic_tac_toe_service";
        }

        public Player[] GetPlayers(string player1Username, string player2Username)
        {
            Log.Information("Fetching player data for {Player1} and {Player2}.", player1Username, player2Username);
            return [new Player(player1Username), new Player(player2Username)];
        }

        public async Task UpdatePlayersAsync(Player player1NewData, Player player2NewData)
        {
            using (LogContext.PushProperty("Context", "PlayerService.UpdatePlayersAsync"))
            {
                Log.Information("Updating player data for {Player1} and {Player2}.", player1NewData.Username, player2NewData.Username);

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

                var request = new HttpRequestMessage(HttpMethod.Put, $"{_repositoryServiceUrl}/players")
                {
                    Content = content
                };

                request.Headers.Add(_internalServiceHeaderKey, _serviceName);

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Log.Error("Failed to update players. Response Code: {StatusCode}, Response Content: {ResponseContent}", response.StatusCode, responseContent);
                    throw new Exception("Failed to update players in the repository service.");
                }

                Log.Information("Successfully updated player data for {Player1} and {Player2}.", player1NewData.Username, player2NewData.Username);
            }
        }
    }
}
