
namespace XingZen.Domain.Repositories
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Table;
    using XingZen.Domain.Model;
    using XingZen.Domain.Repositories.Interfaces;

    public class StoreRepository : RepositoryBase, IStoreRepository
    {
        private const string STORES = "stores";

        public StoreRepository(IConfiguration configuration)
            : base(configuration: configuration, tableName: STORES)
        {
        }

        public void Add(Store t)
        {
            var entity = new 
            // var connectionString = _configuration["Azure:StorageConnectionString"];
            // var cloudStorageAccount = CloudStorageAccount.Parse(connectionString);
            // _tableClient = cloudStorageAccount.CreateCloudTableClient();

            // base.Put()
        }
    }
}