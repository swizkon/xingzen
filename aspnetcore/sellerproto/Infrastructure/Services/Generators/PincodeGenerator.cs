namespace XingZen.Infrastructure.Services.Generators
{
    using System;
    using XingZen.Infrastructure.Services.Generators.Interfaces;

    public class PincodeGenerator : IGenerator
    {
        public PincodeGenerator()
        {
        }

        public object Next()
        {
            return new Random().Next(1000, 10000);
        }
    }
}