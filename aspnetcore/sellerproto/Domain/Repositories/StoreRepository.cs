
namespace XingZen.Domain.Repositories
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.WindowsAzure.Storage;
    using XingZen.Domain.Model;
    using XingZen.Domain.Repositories.Interfaces;

    public class StoreRepository : RepositoryBase, IStoreRepository
    {
        public StoreRepository(IConfiguration configuration)
            : base(configuration: configuration, tableName: "stores")
        {
        }

        public void Add(Store t)
        {
            // var connectionString = _configuration["Azure:StorageConnectionString"];
            // var cloudStorageAccount = CloudStorageAccount.Parse(connectionString);
            // _tableClient = cloudStorageAccount.CreateCloudTableClient();

            // base.Put()
        }
    }
}