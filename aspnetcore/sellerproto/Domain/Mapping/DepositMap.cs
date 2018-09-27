using Microsoft.WindowsAzure.Storage.Table;

namespace XingZen.Domain.Mapping
{
    public class DepositMap : TableEntity
    {
        public string DepositId { get; set; }

        public string WalletId { get;set;  }

        public double Amount { get;set;  }

        public string Currency { get; set; }

        public DepositMap()
        {

        }
    }
}