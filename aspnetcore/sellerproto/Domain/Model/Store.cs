namespace XingZen.Domain.Model
{
    public class Store
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string DefaultCurrency { get; set; }

        public string[] SalePersons { get; set; }

        public Store(string id, string name, string defaultCurrency = "SEK")
        {
            this.Id = id;
            this.Name = name;
            this.DefaultCurrency = defaultCurrency;
        }
    }
}