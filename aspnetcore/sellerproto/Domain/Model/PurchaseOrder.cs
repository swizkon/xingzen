namespace XingZen.Domain.Model
{
    public class PurchaseOrder
    {
        public string PurchaseOrderId { get; }

        public string StoreId { get; }

        public string SalesPerson { get; }

        public double Amount { get; }

        public string Currency { get; }

        public PurchaseOrder(string purchaseOrderId, string storeId, string salesPerson, double amount, string currency)
        {
            PurchaseOrderId = purchaseOrderId;
            StoreId = storeId;
            SalesPerson = salesPerson;
            Amount = amount;
            Currency = currency;
        }
    }
}