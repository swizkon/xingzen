using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace XingZen.Domain.Repositories
{
    public abstract class RepositoryBase
    {
        private readonly CloudTableClient _tableClient;
        private readonly string _tableName;

        public RepositoryBase(IConfiguration configuration, string tableName)
        {
            var connectionString = configuration["Azure:StorageConnectionString"];
            var cloudStorageAccount = CloudStorageAccount.Parse(connectionString);
            _tableClient = cloudStorageAccount.CreateCloudTableClient();
            _tableName = tableName;
        }

        protected CloudTable GetTableReference()
        {
            var table = _tableClient.GetTableReference(_tableName.ToLower());
            table.CreateIfNotExistsAsync().Wait();

            return table;
        }
    }
}