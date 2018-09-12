namespace XingZen.Domain.Repositories.Interfaces
{
    public interface IRepository<T> where T: class
    {
        void Add(T t);
    }
}