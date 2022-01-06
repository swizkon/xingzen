namespace XingZen.Web.Domain.Models
{
    public class Ingredient
    {
        public string Name { get; set; }
        
        public Ingredient()
        {
            
        }

        public Ingredient(string name)
        {
            Name = name;
        }
    }
}