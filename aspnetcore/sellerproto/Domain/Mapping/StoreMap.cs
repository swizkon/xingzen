

namespace XingZen.Domain.Mapping
{
    using Microsoft.WindowsAzure.Storage.Table;
    
    public class StoreMap : TableEntity
    {
        public string StoreId { get; set; }

        public string StoreName { get; set; }
        
        public string DefaultCurrency { get; set; }

        public StoreMap()
        {

        }
    }
}