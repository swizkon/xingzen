
using System.ComponentModel.DataAnnotations;

namespace sellerproto.Tasks
{
    public class CreatePurchaseOrderTask
    {
        [Required]
        public string StoreId { get; set; }

        [Required]        
        public string SalesPerson { get; set; }

        [Required]        
        public double Amount { get; set; }

        [Required]        
        public string Currency { get; set; }
    }

    public class MakeDepositTask
    {
        [Required]
        public string WalletId { get; set; }

        [Required]        
        public decimal Amount { get; set; }

        [Required]        
        public string Currency { get; set; }
    }
}