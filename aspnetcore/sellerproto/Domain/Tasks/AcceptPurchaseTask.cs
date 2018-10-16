
using System.ComponentModel.DataAnnotations;

namespace sellerproto.Tasks
{
    public class AcceptPurchaseTask
    {
        [Required]
        public string StoreId { get; set; }

        [Required]
        public string PurchaseOrderId { get; set; }

        [Required]
        public string WalletId { get; set; }

        [Required]
        public string BuyerId { get; set; }

        [Required]
        public string BuyerName { get; set; }

        [Required]
        public double Amount { get; set; }

        [Required]
        public string Currency { get; set; }
    }
}