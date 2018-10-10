using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using sellerproto.Models;
using Swizkon.Infrastructure.Utils;
using XingZen.Domain.Model;
using XingZen.Domain.Repositories.Interfaces;
using XingZen.Domain.Services;

namespace sellerproto.Controllers
{
    [Authorize]
    public class WalletController : Controller
    {
        private readonly IRepository<Deposit> _depositRepository;

        private readonly IStoreService _storeService;

        private readonly ILogger _logger;

        public WalletController(IStoreService storeService, IRepository<Deposit> depositRepository, ILogger<WalletController> logger)
        {
            _storeService = storeService;
            _depositRepository = depositRepository;
            _logger = logger;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);
            ViewData["mode"] = "embedded";
        }

        [Authorize, HttpGet]
        public async Task<IActionResult> Index(string walletId = "DefaultWallet", bool onlyContent = false)
        {
            var deposits = await _depositRepository.All(walletId);

            var balances = deposits.GroupBy(d => d.Currency)
            .Select(g =>
               new sellerproto.ViewModels.WalletBalance
               {
                   Currency = g.Key,
                   Balance = g.Sum(x => x.Amount).ToString("N2")
               }
            ).Where(b => b.Balance != "0,00");
            
            var claims = User.Claims?.Select(c => c.Type + ": " + c.Value).ToArray();
            var userClaims = User.Identity.Name + ": " + string.Join(" | ", claims);

            ViewData["UserClaims"] = userClaims;

            if(onlyContent)
                return PartialView(model: balances.ToList());
            else
                return View(model: balances.ToList());
        }

        [HttpGet]
        public IActionResult Display(string id)
        {
            var store = _storeService.StoresByUser(owner: User).FirstOrDefault(x => x.Id == id);
            if (store == null)
            {
                return RedirectToAction(nameof(WalletController.Index), "Wallet");
            }

            return View(model: store);
        }


        [HttpGet]
        public IActionResult Deposit(string id = "DefaultWallet")
        {
            ViewData["WalletId"] = id;
            return View(model: id);
        }

        [HttpGet]
        public IActionResult Scanner(string id)
        {
            var email = XingZen.Domain.Services.IdentityService.Email(User);
           
            ViewData["Buyer"] = HashingUtil.CalculateMD5Hash( email.ToLower());

            return View(model: id);
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}