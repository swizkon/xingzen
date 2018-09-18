using System.ComponentModel.DataAnnotations;

namespace sellerproto.Models
{
    public class NotifyStoreBalanceModel
    {
        [Required]        
        public string StoreId { get; set; }

        [Required]        
        public decimal Balance { get; set; }

        [Required]        
        public string Currency { get; set; }
    }
}