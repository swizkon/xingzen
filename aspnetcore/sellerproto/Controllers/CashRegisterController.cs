using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sellerproto.Models;

namespace sellerproto.Controllers
{
    public class CashRegisterController : Controller
    {
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        public IActionResult Display()
        {
            ViewData["Message"] = "Your application description page.";
            ViewData["Store"] = base.HttpContext.Request.Query.FirstOrDefault(x => x.Key == "store").Value;
            return View();
        }

        [Authorize]
        public IActionResult Numpad()
        {
            ViewData["Message"] = "Your contact page.";
            ViewData["Store"] = base.HttpContext.Request.Query.FirstOrDefault(x => x.Key == "store").Value;
            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
