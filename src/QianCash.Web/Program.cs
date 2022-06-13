using QianCash.Web.Configuration;
using QianCash.Web.EndPoints;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddDapr();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuth0Authentication();

builder.Host.UseSerilog((ctx, lc) => lc
    .WriteTo.Console()
    .WriteTo.Seq("http://localhost:5341"));

if (builder.Environment.IsDevelopment())
    builder.Configuration.AddUserSecrets<Program>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        //builder.AllowAnyOrigin();
        //builder.AllowAnyHeader();
        //builder.AllowAnyMethod();

        builder.AllowAnyMethod().AllowAnyHeader();
        builder.SetIsOriginAllowed((host) => true);
        builder.AllowCredentials();
    });
});

var app = builder.Build();

app.UseSerilogRequestLogging();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

if (builder.Environment.IsDevelopment())
    app.Map("/development/environment", () => Environment
        .GetEnvironmentVariables()
        .Keys
        .Cast<string>()
        .Select(key => $"{key} {Environment.GetEnvironmentVariable(key)}"));

app.MapSettingsEndPoints();

app.UseEndpoints(config =>
{
    config.MapControllers();
    config.MapFallbackToFile("index.html").AllowAnonymous();
});

app.Run();
