namespace XingZen.Infrastructure.Services.Generators
{
    using System;
    using XingZen.Infrastructure.Services.Generators.Interfaces;

    public class GuidGenerator : IGenerator
    {
        public object Next()
        {
            return Guid.NewGuid();
        }
    }
}