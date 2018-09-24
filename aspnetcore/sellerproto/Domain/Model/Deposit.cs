namespace XingZen.Domain.Model
{
    public class Deposit
    {
        public string DepositId { get; }

        public string WalletId { get; }

        public decimal Amount { get; }

        public string Currency { get; }

        public Deposit(string depositId, string walletId, decimal amount, string currency)
        {
            DepositId = depositId;
            WalletId = walletId;
            Amount = amount;
            Currency = currency;
        }
    }
}