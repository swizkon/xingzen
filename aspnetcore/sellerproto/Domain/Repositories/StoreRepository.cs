
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

    public class StoreRepository : RepositoryBase<Store, StoreMap>, IStoreRepository
    {
        private const string STORES = "stores";

        public StoreRepository(IConfiguration configuration, ILogger<StoreRepository> logger)
            : base(configuration: configuration, tableName: STORES, logger: logger)
        {
        }

        public async Task Add(Store store)
        {
            await Put(store);
        }

        protected override Store ToDomainEntity(StoreMap tableEntity)
        {
            return new Store(id: tableEntity.StoreId, name: tableEntity.StoreName);
        }

        protected override StoreMap ToTableEntity(Store domainEntity)
        {
            var result = new StoreMap();
            result.PartitionKey = "stores";
            result.RowKey = domainEntity.Id;
            result.StoreName = domainEntity.Name;
            result.StoreId = domainEntity.Id;

            return result;
        }

        // public async Task<IEnumerable<Store>> GetAll()
        // {
        //     var result = await base.GetAllDomainEntities();
        //     return result;
        // }
    }
}