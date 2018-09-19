using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using Microsoft.AspNetCore.SignalR;
using Hubs;
using sellerproto.Tasks;

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
        public IActionResult PlacePurchaseOrder([FromBody] CreatePurchaseOrderTask purchaseOrder)
        {
            _transactionHub.Clients
                            .Group("Store" + purchaseOrder.StoreId)
                            .SendCoreAsync("PurchaseOrderRegistered", new object[] { purchaseOrder.StoreId, purchaseOrder.Amount, purchaseOrder.Currency });

            return new OkObjectResult(purchaseOrder);
        }

        [HttpPost]
        public IActionResult NotifyStoreBalance([FromBody] NotifyStoreBalanceTask notifyStoreBalance)
        {
            _transactionHub.Clients
                            .Group("Store" + notifyStoreBalance.StoreId)
                            .SendCoreAsync("StoreBalanceAdjusted", new object[] { notifyStoreBalance.StoreId, notifyStoreBalance.Balance, notifyStoreBalance.Currency });

            return new OkObjectResult(notifyStoreBalance);
        }

        public IActionResult QRCode(string data)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new SvgQRCode(qrCodeData);
            var qrCodeImage = qrCode.GetGraphic(10);
            return new ContentResult() { Content = qrCodeImage, ContentType ="image/svg+xml" };
        }
    }
}
