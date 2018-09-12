using System.ComponentModel.DataAnnotations;

namespace sellerproto.Models
{
    public class CreateStoreModel
    {
        [Required]        
        public string Name { get; set; }
    }
}