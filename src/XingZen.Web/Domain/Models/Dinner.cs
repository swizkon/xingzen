using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;

namespace XingZen.Web.Domain.Models
{
    [BsonIgnoreExtraElements]
    public class Dinner
    {
        [BsonElement("Name")]
        public string Name { get; set; }

        public string Link { get; set; }

        public ICollection<Ingredient> Ingredients { get; set; }

        public SpinnerRef SpinnerRef { get; set; }

        /*
         *�tapes de pr�paration
Pr�chauffez le four � 200 �C.
D�posez les saucisses dans un grand plat, salez et poivrez.
Enfournez environ 25 minutes.
Astuces et conseils pour Saucisse au four
Vous pouvez remplacer le poivre par du piment d'Espelette.
         *
         */
    }
}