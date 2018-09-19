using System.ComponentModel.DataAnnotations;

namespace sellerproto.Tasks
{
    public class CreateStoreTask
    {
        [Required]        
        public string Name { get; set; }
    }
}