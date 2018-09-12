using Microsoft.WindowsAzure.Storage.Table;

namespace XingZen.Domain.Mapping
{
    public class StoreMap : TableEntity
    {
        public string StoreId { get; set; }

        public string StoreName { get; set; }
        
        public StoreMap(string id, string name)
        {
            this.StoreId = id;
            this.StoreName = name;
        }

        public StoreMap()
        {

        }
    }
}