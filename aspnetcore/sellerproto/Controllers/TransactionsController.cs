using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using sellerproto.Models;
using Microsoft.AspNetCore.SignalR;
using Hubs;

namespace sellerproto.Controllers
{
    public class TransactionsController : Controller
    {
        private readonly IHubContext<TransactionHub> _transactionHub;

        public TransactionsController(IHubContext<TransactionHub> transactionHub)        
        {
            _transactionHub = transactionHub;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Notify(string message)
        {
            _transactionHub.Clients.All.SendCoreAsync("Notify", new [] { message });
            return new OkObjectResult(message);
        }

        [HttpPost]
        public IActionResult NotifyStoreBalance(string storeId, string balance, string currency)
        {
            _transactionHub.Clients.Group(storeId).SendAsync("StoreBalance", balance, currency);
            _transactionHub.Clients.Group("Store" + storeId).SendAsync("StoreBalance", balance, currency);
            return new OkObjectResult(balance);
        }

        public IActionResult QRCode(string data)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new SvgQRCode(qrCodeData);
            var qrCodeImage = qrCode.GetGraphic(10);
            return new ContentResult() { Content = qrCodeImage, ContentType ="image/svg+xml" };
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }
    }
}
