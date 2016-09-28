using XingZen.Core;

namespace XingZen.Infrastructure
{
    public class InMemoryAccountRepository : IAccountRepository
    {
        public string Implementation()
        {
            return GetType().Name;
        }
    }
}
