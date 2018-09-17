using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace XingZen.Domain.Repositories
{
    public abstract class RepositoryBase<TDomain, TMapping> 
        where TDomain : class
        where TMapping : ITableEntity, new()
    {
        private readonly CloudTableClient _tableClient;
        private readonly CloudTable _table;
        private readonly ILogger _logger;

        protected RepositoryBase(IConfiguration configuration, string tableName, ILogger logger)
        {
            _logger = logger;
            var connectionString = configuration["Azure:StorageConnectionString"];

            var cloudStorageAccount = CloudStorageAccount.Parse(connectionString);
            _tableClient = cloudStorageAccount.CreateCloudTableClient();
            _table = _tableClient.GetTableReference(tableName.ToLower());
            _table.CreateIfNotExistsAsync().Wait();
        }

        protected abstract TMapping ToTableEntity(TDomain domainEntity);

        protected abstract TDomain ToDomainEntity(TMapping tableEntity);

        protected async Task<TMapping> Put(TDomain domainEntity)
        {
            var tableEntity = ToTableEntity(domainEntity);
            
            var result = await _table.ExecuteAsync(TableOperation.Insert(tableEntity));
            return (TMapping) result.Result;
        }


        public async Task<IEnumerable<TDomain>> GetAll()
        {
            return await GetAllDomainEntities();
        }

        private async Task<IEnumerable<TDomain>> GetAllDomainEntities()
        {
            // var q = TableQuery.GenerateFilterCondition("", QueryComparisons.Equal, "");
            var query = new TableQuery<TMapping>();
            // .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "boards"));

            var data = await _table.ExecuteQuerySegmentedAsync<TMapping>(query, null);
            return data.Results.Select(ToDomainEntity);
        }

    }
}