using System.Text;
using EventStore.Client;
using EventStore.ClientAPI;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using EventData = EventStore.ClientAPI.EventData;

namespace ES.Labs.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
    }

    [HttpPost(Name = "SetWeatherForecast")]
    public async Task<IActionResult> Set(WeatherForecast data)
    {
        var connection = EventStoreConnection.Create(
            new Uri("tcp://admin:changeit@localhost:1113")
        );
        await connection.ConnectAsync();

        var settings = EventStoreClientSettings
            //.Create("esdb://admin:changeit@localhost:2113?tlsVerifyCert=false");
            .Create("esdb://admin:changeit@localhost:2113?tls=false&tlsVerifyCert=false");
            //.Create("esdb+discover://admin:changeit@localhost:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000");
        var client = new EventStoreClient(settings);

        const string metadata = "{}";
        
        var eventType = data.GetType().Name.ToLower();
        var eventData = new EventStore.Client.EventData(
            eventId: Uuid.NewUuid(),
            type: eventType,
            //isJson: true,
            data: Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(data)),
            metadata: Encoding.UTF8.GetBytes(metadata)
        );

        const string streamName = "forecasts";

        var result = await client.AppendToStreamAsync(
            streamName: streamName,
            expectedState: StreamState.Any,
            eventData: new List<EventStore.Client.EventData>()
            {
                eventData,eventData,eventData,eventData
            });

        return Ok(result);
    }
}
