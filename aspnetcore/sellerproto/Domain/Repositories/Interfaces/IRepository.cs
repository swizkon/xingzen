using System.Collections.Generic;
using System.Threading.Tasks;

namespace XingZen.Domain.Repositories.Interfaces
{
    public interface IRepository<T> where T: class
    {
        Task Add(object partition, T t);

        Task<T> Find(object partition, object row);

        Task<IEnumerable<T>> All(object partition);
    }
}