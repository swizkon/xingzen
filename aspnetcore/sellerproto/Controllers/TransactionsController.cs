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
using Swizkon.Infrastructure.Generators.Interfaces;
using Microsoft.Extensions.Logging;

namespace sellerproto.Controllers
{
    public class TransactionsController : Controller
    {
        private readonly IRepository<PurchaseOrder> purchaseOrderRepository;
        private readonly IRepository<Deposit> _depositRepository;

        private readonly IGenerator _generator;

        private readonly IHubContext<TransactionHub> _transactionHub;

        private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(IRepository<PurchaseOrder> purchaseOrderRepository, IRepository<Deposit> depositRepository, IGenerator generator, IHubContext<TransactionHub> transactionHub, ILogger<TransactionsController> logger)
        {
            this.purchaseOrderRepository = purchaseOrderRepository;
            _depositRepository = depositRepository;
            _generator = generator;
            _transactionHub = transactionHub;
            _logger = logger;
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
            _logger.LogInformation($"PlacePurchaseOrder {purchaseOrder.Amount} {purchaseOrder.Currency} from {purchaseOrder.SalesPerson} to {purchaseOrder.StoreId}");
            
            var order = new PurchaseOrder(purchaseOrderId: _generator.Next().ToString(),
                                            storeId: purchaseOrder.StoreId,
                                            salesPerson: purchaseOrder.SalesPerson,
                                            amount: purchaseOrder.Amount,
                                          currency: purchaseOrder.Currency);

            purchaseOrderRepository.Add(purchaseOrder.StoreId, order);

            _transactionHub.Clients
                            .Group("Store" + order.StoreId)
                            .SendCoreAsync("PurchaseOrderRegistered", new object[] { order.StoreId, order.PurchaseOrderId, order.Amount, order.Currency });
            // Temp for debug purpose
            _transactionHub.Clients
                            .Group("Stores")
                            .SendCoreAsync("PurchaseOrderRegistered", new object[] { order.StoreId, order.PurchaseOrderId, order.Amount, order.Currency });

            return new OkObjectResult(purchaseOrder);
        }


        [HttpPost]
        public async Task<IActionResult> AcceptPurchase([FromBody] AcceptPurchaseTask purchaseOrder)
        {
            _logger.LogInformation($"AcceptPurchase {purchaseOrder.Amount} {purchaseOrder.Currency} from {purchaseOrder.BuyerName} to {purchaseOrder.StoreId}");
            
            // TODO Fix correct domain for this transaction, ie bi-transaction or purchase
            var deposit = new Deposit(
                    depositId: _generator.Next().ToString(),
                    walletId: purchaseOrder.WalletId,
                    amount: -(decimal)purchaseOrder.Amount,
                    currency: purchaseOrder.Currency);

            await _depositRepository.Add(deposit.WalletId, deposit);

            await _transactionHub.Clients
                            .Group("Store" + purchaseOrder.StoreId)
                            .SendCoreAsync("PurchaseOrderAccepted",
                                        new object[] { purchaseOrder.StoreId,
                                                    purchaseOrder.PurchaseOrderId,
                                                     purchaseOrder.WalletId,
                                                     purchaseOrder.Amount,
                                                     purchaseOrder.Currency,
                                                     purchaseOrder.BuyerId,
                                                     purchaseOrder.BuyerName });

            await _transactionHub.Clients
                            .Group("Wallet" + purchaseOrder.WalletId)
                            .SendCoreAsync("PurchaseOrderAccepted",
                                        new object[] { purchaseOrder.StoreId,
                                                     purchaseOrder.PurchaseOrderId,
                                                     purchaseOrder.WalletId,
                                                     purchaseOrder.Amount,
                                                     purchaseOrder.Currency,
                                                     purchaseOrder.BuyerId,
                                                     purchaseOrder.BuyerName });

            return new OkObjectResult(purchaseOrder);
        }

        [HttpPost]
        public async Task<IActionResult> MakeDeposit([FromBody] MakeDepositTask depositTask)
        {
            _logger.LogInformation($"Deposit {depositTask.Amount} {depositTask.Currency} to {depositTask.WalletId}");
            var deposit = new Deposit(
                    depositId: _generator.Next().ToString(),
                    walletId: depositTask.WalletId,
                    amount: depositTask.Amount,
                    currency: depositTask.Currency);

            await _depositRepository.Add(deposit.WalletId, deposit);

            await _transactionHub.Clients
                            .Group("Wallet" + deposit.WalletId)
                            .SendCoreAsync("WalletDepositRegistered", new object[] { deposit.WalletId, deposit.DepositId, deposit.Amount, deposit.Currency });

            var deposits = await _depositRepository.All(deposit.WalletId);

            var newBalance = deposits.Where(x =>x.Currency == deposit.Currency)
                                     .Select(x => x.Amount).Sum();

            await _transactionHub.Clients
                            .Group("Wallet" + deposit.WalletId)
                            .SendCoreAsync("WalletDepositConfirmed", new object[] { deposit.WalletId, deposit.DepositId, newBalance, deposit.Currency });

            return new OkObjectResult(deposit);
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
