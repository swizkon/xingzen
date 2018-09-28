using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sellerproto.Models;
using XingZen.Domain.Repositories.Interfaces;
using XingZen.Domain.Services;
using XingZen.Domain.Model;
using Microsoft.AspNetCore.Authorization;

namespace sellerproto.Controllers
{
    [Authorize]
    public class DebugController : Controller
    {
        private readonly IStoreService _storeService;

        private readonly IRepository<PurchaseOrder> _purchaseOrderRepository;

        private readonly ILogger _logger;

        public DebugController(IStoreService storeService, IRepository<PurchaseOrder> purchaseOrderRepository, ILogger<DebugController> logger)
        {
            _storeService = storeService;
            _purchaseOrderRepository = purchaseOrderRepository;
            _logger = logger;
        }

        public override void OnActionExecuting(Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext context)
        {
            base.OnActionExecuting(context);
            ViewData["mode"] = "embedded";
        }

        [HttpGet]
        public IActionResult StoreDemo(string id = "2250")
        { 
            return View(model: id);
        }

        [HttpGet]
        public IActionResult WalletDemo(string id = "DefaultWallet")
        {
            ViewData["WalletId"] = id;
            return View(model: id);
        }

        [HttpGet]
        public IActionResult DepositDemo(string id = "DefaultWallet")
        {
            ViewData["WalletId"] = id;
            return View(model: id);
        }

        public IActionResult ScannerDemo(string id)
        {
            return View(model: id);
        }

        public async Task<IActionResult> PurchaseOrders(string id)
        {
            var model = await _purchaseOrderRepository.All(id);
            return View(model: model.ToList());
        }

        public async Task<IActionResult> PurchaseOrderDetails(string storeId, string purchaseOrderId)
        {
            // var orders = await _purchaseOrderRepository.All(storeId);

            // https://www.gravatar.com/avatar/' + o.userKey + '?d=mm&s=200

            var order = await _purchaseOrderRepository.Find(storeId, purchaseOrderId);
            _logger.LogInformation(order?.PurchaseOrderId);
            var model = order; // ?? orders.FirstOrDefault(x => x.PurchaseOrderId == purchaseOrderId);
            // return View(model: model);
            return Json( model);
        }
    }
}
