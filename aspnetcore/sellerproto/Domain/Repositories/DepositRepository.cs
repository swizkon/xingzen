using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using XingZen.Domain.Mapping;
using XingZen.Domain.Model;
using XingZen.Domain.Repositories.Interfaces;

namespace XingZen.Domain.Repositories
{
    public class DepositRepository : RepositoryBase<Deposit, DepositMap>, IRepository<Deposit>
    {
        public DepositRepository(IConfiguration configuration, ILogger<PurchaseOrderRepository> logger)
            : base(configuration: configuration, logger: logger)
        {
        }

        protected override Deposit ToDomainEntity(DepositMap tableEntity)
        {
            return new Deposit(depositId: tableEntity.DepositId,
            walletId: tableEntity.WalletId,
             amount: tableEntity.Amount,
             currency: tableEntity.Currency);

        }

        protected override DepositMap ToTableEntity(Deposit domainEntity)
        {
            var result = new DepositMap();
            result.RowKey = domainEntity.DepositId;
            result.Amount = domainEntity.Amount;
            result.WalletId = domainEntity.WalletId;
            result.Currency = domainEntity.Currency;
            result.DepositId = domainEntity.DepositId;

            return result;
        }
    }
}