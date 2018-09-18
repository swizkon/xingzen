using System.ComponentModel.DataAnnotations;

namespace sellerproto.Models
{
    public class PurchaseOrderModel
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