using Microsoft.AspNetCore.Mvc;

namespace TicTacToe.Controllers
{
    public class PlayerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
