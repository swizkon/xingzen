using Microsoft.WindowsAzure.Storage.Table;

namespace XingZen.Domain.Mapping
{
    public class DepositMap : TableEntity
    {
        public string DepositId { get; }

        public string WalletId { get; }

        public decimal Amount { get; }

        public string Currency { get; }

        public DepositMap()
        {

        }
    }
}