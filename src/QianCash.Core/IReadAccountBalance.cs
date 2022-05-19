namespace QianCash.Core;

public interface IReadAccountBalance
{
    public AccountBalance GetAccountBalance(string accountId);
}