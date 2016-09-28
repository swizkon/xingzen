using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XingZen.Core
{
    public class Transaction
    {
        public Guid CorrelationId { get; private set; }
        public Guid TransactionId { get; private set; }

        public Guid AccountId { get; private set; }

        public decimal Amount { get; private set; }
    }
}
