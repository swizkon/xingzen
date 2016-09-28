using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XingZen.Core
{
    public class TransactionManager
    {
        private IAccountRepository _accountRepository;
        private ITransactionRepository _transactionRepository;

        public TransactionManager(IAccountRepository accountRepository, ITransactionRepository transactionRepository)
        {
            _accountRepository = accountRepository;
            _transactionRepository = transactionRepository;
        }

        public void Transfer(Guid sourceAccountId, Guid targetAccountId, decimal amount)
        {

        }

        public void Deposit(Guid accountId, decimal amount)
        {

        }
    }
}
