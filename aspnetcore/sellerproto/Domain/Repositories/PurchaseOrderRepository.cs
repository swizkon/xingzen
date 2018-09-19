using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using XingZen.Domain.Mapping;
using XingZen.Domain.Model;
using XingZen.Domain.Repositories.Interfaces;

namespace XingZen.Domain.Repositories
{
    public class PurchaseOrderRepository : RepositoryBase<PurchaseOrder, PurchaseOrderMap>, IRepository<PurchaseOrder>
    {
        public PurchaseOrderRepository(IConfiguration configuration, ILogger<PurchaseOrderRepository> logger)
            : base(configuration: configuration, logger: logger)
        {
        }

        protected override PurchaseOrder ToDomainEntity(PurchaseOrderMap tableEntity)
        {
            return new PurchaseOrder(purchaseOrderId: tableEntity.PurchaseOrderId,
            storeId: tableEntity.StoreId,
            salesPerson: tableEntity.SalesPerson,
             amount: tableEntity.Amount,
             currency: tableEntity.Currency);

        }

        protected override PurchaseOrderMap ToTableEntity(PurchaseOrder domainEntity)
        {
            var result = new PurchaseOrderMap();
            result.RowKey = domainEntity.PurchaseOrderId;
            result.Amount = domainEntity.Amount;
            result.StoreId = domainEntity.StoreId;
            result.Currency = domainEntity.Currency;
            result.PurchaseOrderId = domainEntity.PurchaseOrderId;
            result.SalesPerson = domainEntity.SalesPerson;
            result.Amount = domainEntity.Amount;

            return result;
        }
    }
}