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

        public async Task<IActionResult> PurchaseOrders()
        {
            var model = await _purchaseOrderRepository.All(3806);
            return View(model: model.ToList());
        }
    }
}
