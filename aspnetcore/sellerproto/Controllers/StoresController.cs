using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sellerproto.Tasks;
using XingZen.Domain.Services;

namespace sellerproto.Controllers
{
    [Authorize]
    public class StoresController : Controller
    {
        private readonly IStoreService _storeService;
        
        private readonly ILogger _logger;

        public StoresController(IStoreService storeService, ILogger<StoresController> logger)
        {
            _storeService = storeService;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var claims = User.Claims?.Select(c => c.Type + ": " + c.Value).ToArray();
            var userClaims = User.Identity.Name + ": " + string.Join(" | ", claims);

            ViewData["UserClaims"] = userClaims;

            var stores = _storeService.StoresByUser(owner: User);
            _logger.LogDebug($"Got stores {stores.Count}");
            return View(model: stores);
        }

        [HttpGet]
        public IActionResult Display(string id)
        {
            var store = _storeService.StoresByUser(owner: User).FirstOrDefault(x => x.Id == id);
            if(store == null)
            {
                return RedirectToAction(nameof(StoresController.Index), "Stores");
            }

            return View(model: store);
        }

        [HttpGet]
        public IActionResult CashRegister(string id)
        {
            var store = _storeService.StoresByUser(owner: User).FirstOrDefault(x => x.Id == id);
            
            if(store == null)
            {
                return RedirectToAction(nameof(StoresController.Index), "Stores");
            }

            return View(model: store);
        }

        [HttpPost]
        public IActionResult CreateStore(CreateStoreTask storeModel)
        {
            if(ModelState.IsValid)
            {
                var store = _storeService.CreateStore(storeModel.Name, User);
                return RedirectToAction(nameof(StoresController.Index), "Stores", "StoreCreated=" + store.Id);
            }
            
            return RedirectToAction(nameof(StoresController.Index), "Stores");
        }
    }
}