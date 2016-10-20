using System;

namespace WebAPIApplication.Domain
{
    public class TransactionOrder
    {
        public Guid TransactionOrderId { get; set; }

        public decimal Amount { get; set; }
    }
}
