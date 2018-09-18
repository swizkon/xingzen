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
    public class WalletController : Controller
    {
        private readonly IStoreService _storeService;
        
        private readonly ILogger _logger;

        public WalletController(IStoreService storeService, ILogger<WalletController> logger)
        {
            _storeService = storeService;
            _logger = logger;
        }

        [Authorize, HttpGet]
        public IActionResult Index()
        {
            var claims = User.Claims?.Select(c => c.Type + ": " + c.Value).ToArray();
            var userClaims = User.Identity.Name + ": " + string.Join(" | ", claims);

            ViewData["UserClaims"] = userClaims;

            var stores = _storeService.StoresByUser(owner: User);
            _logger.LogDebug($"Got stores {stores.Count}");
            return View(model: stores);
        }

        [Authorize]
        [HttpGet]
        public IActionResult Display(string id)
        {
            var store = _storeService.StoresByUser(owner: User).FirstOrDefault(x => x.Id == id);
            if(store == null)
            {
                return RedirectToAction(nameof(WalletController.Index), "Wallet");
            }

            return View(model: store);
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}