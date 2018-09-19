
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using XingZen.Domain.Mapping;
using XingZen.Domain.Model;
using XingZen.Domain.Repositories.Interfaces;

namespace XingZen.Domain.Repositories
{
    public class StoreRepository : RepositoryBase<Store, StoreMap> , IRepository<Store>
    {
        public StoreRepository(IConfiguration configuration, ILogger<StoreRepository> logger)
            : base(configuration: configuration, logger: logger)
        {
        }

        protected override Store ToDomainEntity(StoreMap tableEntity)
        {
            return new Store(id: tableEntity.StoreId, name: tableEntity.StoreName, defaultCurrency: tableEntity.DefaultCurrency);
        }

        protected override StoreMap ToTableEntity(Store domainEntity)
        {
            var result = new StoreMap();
            result.PartitionKey = "stores";
            result.RowKey = domainEntity.Id;
            result.StoreName = domainEntity.Name;
            result.StoreId = domainEntity.Id;
            result.DefaultCurrency = domainEntity.DefaultCurrency;

            return result;
        }
    }
}