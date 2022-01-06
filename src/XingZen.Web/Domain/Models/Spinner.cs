using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace XingZen.Web.Domain.Models
{
    [BsonIgnoreExtraElements]
    public class Spinner
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRepresentation(BsonType.Int32)]
        public int Version { get; set; } = 1;

        [BsonElement("Name")]
        public string Name { get; set; }

        public ICollection<Dinner> Dinners { get; set; } = new List<Dinner>();

        public ICollection<UserRef> Members { get; set; } = new List<UserRef>();
    }

    public class UserRef
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }
    }


    public class SpinnerRef
    {
        public string Id { get; set; }

        public string Name { get; set; }
    }
}