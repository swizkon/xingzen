
using System.ComponentModel.DataAnnotations;

namespace sellerproto.Tasks
{
    public class PurchaseOrderTask
    {
        [Required]        
        public string StoreId { get; set; }

        [Required]        
        public string SalesPerson { get; set; }

        [Required]        
        public decimal Amount { get; set; }

        [Required]        
        public string Currency { get; set; }
    }
}