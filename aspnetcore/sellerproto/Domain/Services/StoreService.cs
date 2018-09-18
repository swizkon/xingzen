namespace XingZen.Domain.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using Microsoft.Extensions.Configuration;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Table;
    using XingZen.Domain.Model;
    using XingZen.Domain.Repositories.Interfaces;

    public class StoreService : IStoreService
    {
        private readonly IRepository<Store> _storeRepository;

        public StoreService(IRepository<Store> storeRepository)
        {
            _storeRepository = storeRepository;
        }

        public Store CreateStore(string name, ClaimsPrincipal owner)
        {
            var storeId = Guid.NewGuid().ToString();
            var store = new Store(id: storeId, name: name);

            var partitionKey = Infra.PartitionKeyGenerator.FromClaimsPrincipal(owner);
            _storeRepository.Add(partitionKey, store);

            return store;
        }

        public IList<Store> StoresByUser(ClaimsPrincipal owner)
        {
            var partitionKey = Infra.PartitionKeyGenerator.FromClaimsPrincipal(owner);
            return _storeRepository.All(partitionKey).Result.ToList();
        }
    }
}