
using System.ComponentModel.DataAnnotations;

namespace sellerproto.Tasks
{
    public class NotifyStoreBalanceTask
    {
        [Required]        
        public string StoreId { get; set; }

        [Required]        
        public decimal Balance { get; set; }

        [Required]        
        public string Currency { get; set; }
    }
}