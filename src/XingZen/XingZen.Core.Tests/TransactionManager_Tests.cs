using Microsoft.Practices.Unity;
using NUnit.Framework;
using XingZen.Infrastructure;

namespace XingZen.Core.Tests
{
    [TestFixture]
    public class TransactionManager_Tests
    {

        UnityContainer container;

        [SetUp]
        public void Setup()
        {
            container = new UnityContainer();
            container.RegisterInstance<IAccountRepository>(new InMemoryAccountRepository());
        }

        [Test]
        public void TestMethod1()
        {
        
            IAccountRepository accountRepo = container.Resolve<IAccountRepository>();

            var trans = container.Resolve<TransactionManager>();
            
            Assert.AreEqual("InMemoryAccountRepository", accountRepo.Implementation());
        }
    }
}
