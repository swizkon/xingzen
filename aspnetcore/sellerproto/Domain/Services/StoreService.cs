namespace XingZen.Domain.Services
{
    using System;
    using System.Security.Claims;
    using Microsoft.Extensions.Configuration;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Table;
    using XingZen.Domain.Model;
    using XingZen.Domain.Repositories.Interfaces;

    public class StoreService : IStoreService
    {
        private const string STORES = "stores";
        private readonly IStoreRepository _storeRepository;

        public StoreService(IStoreRepository configuration)
        {
            _storeRepository = configuration;
        }

        public Store CreateStore(string name, ClaimsPrincipal owner)
        {
            var storeId = Guid.NewGuid().ToString();
            var store = new XingZen.Domain.Model.Store(id: storeId, name: name);

            _storeRepository.Add(store);

            return store;
        }
    }
}