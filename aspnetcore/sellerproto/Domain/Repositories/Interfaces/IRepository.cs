using System.Collections.Generic;
using System.Threading.Tasks;

namespace XingZen.Domain.Repositories.Interfaces
{
    public interface IRepository<T> where T: class
    {
        Task Add(T t);

        Task<IEnumerable<T>> GetAll();
    }
}