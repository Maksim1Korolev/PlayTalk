using System.ComponentModel.DataAnnotations;

namespace TicTacToe.Models
{
    public class Player
    {
        [Required]
        public string Username { get; set; }
        public char Sign { get; set; }
        public int Wins { get; set; }
    }
}
