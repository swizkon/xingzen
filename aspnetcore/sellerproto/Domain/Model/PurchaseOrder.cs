namespace XingZen.Domain.Model
{
    public class PurchaseOrder
    {
        public string PurchaseOrderId { get; set; }

        public string StoreId { get; set; }

        public string SalesPerson { get; set; }

        public decimal Amount { get; set; }

        public string Currency { get; }

        public PurchaseOrder(string purchaseOrderId, string storeId, string salesPerson, decimal amount, string currency)
        {
            PurchaseOrderId = purchaseOrderId;
            SalesPerson = salesPerson;
            Amount = amount;
            Currency = currency;
        }
    }
}