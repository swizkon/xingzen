using System;

namespace WebAPIApplication.Domain
{
    public class PurchaseOrder 
    {
        public Guid PurchaseOrderId { get; set; }

        public Guid ReceivingAccountId { get; set; }

        public decimal Amount { get; set; }

        public string Description { get; set;}

        public string State { get; set;} = "Await";

        public DateTimeOffset InitiationDate { get; set; }

        public DateTimeOffset ExpirationDate { get; set; }
    }
}