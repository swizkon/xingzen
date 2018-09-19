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
    using XingZen.Infrastructure.Services.Generators.Interfaces;

    public class StoreService : IStoreService
    {
        private readonly IRepository<Store> _storeRepository;
        private readonly IGenerator _generator;

        public StoreService(IRepository<Store> storeRepository, IGenerator generator)
        {
            _storeRepository = storeRepository;
            _generator = generator;
        }

        public Store CreateStore(string name, ClaimsPrincipal owner)
        {
            var storeId = _generator.Next().ToString(); // Guid.NewGuid().ToString();
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