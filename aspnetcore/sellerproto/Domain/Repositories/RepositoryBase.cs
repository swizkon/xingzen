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

        public async Task Add(object partition, TDomain domainEntity)
        {
            var tableEntity = ToTableEntity(domainEntity);
            tableEntity.PartitionKey = partition.ToString();
            var result = await _table.ExecuteAsync(TableOperation.Insert(tableEntity));
        }

        public Task<IEnumerable<TDomain>> All(object partition)
        {
            return GetAllDomainEntities(partition);
        }

        public async Task<TDomain> Find(object partition, object row)
        {
            var query = new TableQuery<TMapping>();

            var data = await _table.ExecuteQuerySegmentedAsync<TMapping>(query, null);
            return data.Results.Where(x => x.PartitionKey == partition.ToString() && x.RowKey == row.ToString())
                                .Select(ToDomainEntity)
                                .FirstOrDefault();
        }

        private async Task<TMapping> Put(object partition, TDomain domainEntity)
        {
            var tableEntity = ToTableEntity(domainEntity);
            tableEntity.PartitionKey = partition.ToString();
            var result = await _table.ExecuteAsync(TableOperation.Insert(tableEntity));
            return (TMapping)result.Result;
        }

        private async Task<IEnumerable<TDomain>> GetAllDomainEntities(object partition)
        {
            // var q = TableQuery.GenerateFilterCondition("", QueryComparisons.Equal, "");
            var query = new TableQuery<TMapping>();
            // .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "boards"));

            var data = await _table.ExecuteQuerySegmentedAsync<TMapping>(query, null);
            return data.Results.Where(x => x.PartitionKey == partition.ToString()).Select(ToDomainEntity);
        }

    }
}