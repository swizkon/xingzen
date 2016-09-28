using NUnit.Framework;

namespace XingZen.Core.Tests
{
    [TestFixture]
    public class TransactionManager_Tests
    {

        [SetUp]
        public void Setup()
        {

        }

        [Test]
        public void TestMethod1()
        {

            IAccountRepository accountRepo = new Infrastructure.InMemoryAccountRepository();

            Assert.AreEqual("InMemoryAccountRepository", accountRepo.Implementation());
        }
    }
}
