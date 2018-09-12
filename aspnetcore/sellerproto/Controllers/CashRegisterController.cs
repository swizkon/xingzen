using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sellerproto.Models;
using XingZen.Domain.Services;

namespace sellerproto.Controllers
{
    public class CashRegisterController : Controller
    {
        private readonly IStoreService _storeService;
        private readonly ILogger _logger;

        public CashRegisterController(IStoreService storeService, ILogger<CashRegisterController> logger)
        {
            _storeService = storeService;
            _logger = logger;
        }

        [Authorize]
        [HttpGet]
        public IActionResult Index()
        {
            var claims = User.Claims?.Select(c => c.Type + ": " + c.Value).ToArray();
            var userClaims = User.Identity.Name + ": " + string.Join(" | ", claims);

            ViewData["Message"] = "Your application description page.";
            ViewData["UserClaims"] = userClaims;
            return View();
        }

        [Authorize]
        [HttpGet]
        public IActionResult Display()
        {
            ViewData["Message"] = "Your application description page.";
            ViewData["Store"] = base.HttpContext.Request.Query.FirstOrDefault(x => x.Key == "store").Value;
            return View();
        }

        [Authorize]
        [HttpGet]
        public IActionResult Numpad()
        {
            ViewData["Message"] = "Your contact page.";
            ViewData["Store"] = base.HttpContext.Request.Query.FirstOrDefault(x => x.Key == "store").Value;
            return View();
        }

        [Authorize]
        [HttpPost]
        public IActionResult CreateStore(CreateStoreModel storeModel)
        {
            if(ModelState.IsValid)
            {
                var store = _storeService.CreateStore(storeModel.Name, User);
                return RedirectToAction(nameof(CashRegisterController.Index), "CashRegister", "StoreCreated=" + store.Id);
            }
            
            return RedirectToAction(nameof(CashRegisterController.Index), "CashRegister");
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}