using QianCash.Core;

namespace QianCash.Web.EndPoints;

public static class SettingsEndPoints
{
    public static WebApplication MapSettingsEndPoints(this WebApplication app)
    {
        app.Map("/settings/knownCurrencies", Enum.GetNames<KnownCurrency>);
        return app;
    }
}