using Microsoft.WindowsAzure.Storage.Table;

namespace XingZen.Domain.Mapping
{
    public class StoreMap : TableEntity
    {
        public string StoreId { get; set; }

        public string StoreName { get; set; }
        
        public string DefaultCurrency { get; internal set; }

        public StoreMap()
        {

        }
    }
}