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
using XingZen.Domain.Repositories.Interfaces;
using XingZen.Domain.Model;
using XingZen.Infrastructure.Services.Generators.Interfaces;

namespace sellerproto.Controllers
{
    public class TransactionsController : Controller
    {
        private readonly IRepository<PurchaseOrder> purchaseOrderRepository;

        private readonly IGenerator _generator;

        private readonly IHubContext<TransactionHub> _transactionHub;

        public TransactionsController(IRepository<PurchaseOrder> purchaseOrderRepository, IGenerator generator, IHubContext<TransactionHub> transactionHub)
        {
            this.purchaseOrderRepository = purchaseOrderRepository;
            _generator = generator;
            _transactionHub = transactionHub;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Notify(string message)
        {
            _transactionHub.Clients.All.SendCoreAsync("Notify", new[] { message });

            return new OkObjectResult(message);
        }

        [HttpPost]
        public IActionResult PlacePurchaseOrder([FromBody] CreatePurchaseOrderTask purchaseOrder)
        {
            var order = new PurchaseOrder(purchaseOrderId: _generator.Next().ToString(),
                                            storeId: purchaseOrder.StoreId,
                                            salesPerson: purchaseOrder.SalesPerson,
                                            amount: purchaseOrder.Amount,
                                          currency: purchaseOrder.Currency);


            purchaseOrderRepository.Add(purchaseOrder.StoreId, order);

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
            return new ContentResult() { Content = qrCodeImage, ContentType = "image/svg+xml" };
        }
    }
}
