using Microsoft.WindowsAzure.Storage.Table;

namespace XingZen.Domain.Mapping
{
    public class PurchaseOrderMap : TableEntity
    {
        public string PurchaseOrderId { get; set; }

        public string StoreId { get; set; }

        public string SalesPerson { get; set; }

        public double Amount { get; set; }

        public string Currency { get; set; }

        public PurchaseOrderMap()
        {

        }
    }
}