
using System.ComponentModel.DataAnnotations;

namespace sellerproto.Tasks
{
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