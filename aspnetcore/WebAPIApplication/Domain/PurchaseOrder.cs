using System;

namespace WebAPIApplication.Domain
{
    public class PurchaseOrder 
    {
        public Guid PurchaseOrderId { get; set; }

        public decimal Amount { get; set; }

        public string Description { get; set;}
    }
}