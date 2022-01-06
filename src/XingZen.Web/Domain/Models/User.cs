using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace XingZen.Web.Domain.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }
    }
}