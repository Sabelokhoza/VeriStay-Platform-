using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using ko.core.Contracts;
using ko.core.Extensions;
using ko.core.MappingProfiles;
using ko.core.Middleware;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Supabase;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


builder.Services.AddCors(opts =>
{
    opts.AddPolicy("AllowAll", opts => opts.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
    //to be updated  when front-end is done. (Sabelo)
});


var connect = builder.Configuration.GetConnectionString("DefaultConnection");

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connect);
});

// Use AddIdentityCore instead of AddIdentity to avoid overriding JWT auth scheme
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(opts =>
{
    // Password configuration
    opts.Password.RequiredLength = 6;
    opts.Password.RequireDigit = false;
    opts.Password.RequireLowercase = false;
    opts.Password.RequireUppercase = false;
    opts.Password.RequireNonAlphanumeric = false;

    // Email configuration
    opts.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "KodeOnce API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

builder.Services.AddScoped<Client>(_ =>
    new Client(
        builder.Configuration["Supabase:Url"],
        builder.Configuration["Supabase:Key"],
        new SupabaseOptions
        {
            AutoConnectRealtime = true

        }));


FirebaseApp.Create(new AppOptions
{
    Credential = GoogleCredential.FromFile("veristay-e83d8-firebase-adminsdk-fbsvc-a267d08b94.json")
    // Download this from Firebase Console ?
    // Project Settings ? Service Accounts ? Generate new private key
});



builder.Services.AddHttpLogging(logging =>
{
    logging.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.RequestPath |
                           Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.RequestMethod |
                           Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.ResponseStatusCode |
                           Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.RequestBody |
                           Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.ResponseBody |
                           Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.Duration;
});

builder.Services.AddAutoMapper(typeof(PropertyMappingProfile).Assembly);

builder.Services.AddCoreServices(builder.Configuration);

//flaten api response
builder.Services.Configure<ApiBehaviorOptions>(opts =>
{
    opts.InvalidModelStateResponseFactory = actionContext =>
    {
        var errors = actionContext.ModelState.
         Where(w => w.Value.Errors.Count > 0)
         .SelectMany(x => x.Value.Errors)
         .Select(x => x.ErrorMessage).ToArray();

        var apiResponse = ApiResponse.ValidationFailure(errors, "Validation failed");

        return new BadRequestObjectResult(apiResponse);
    };
});

// Services
builder.Services.AddHttpClient();

// Authentication - explicitly set JWT as default scheme
var jwt = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = false,
        ValidateIssuerSigningKey = false,
        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwt["Key"]))
    };
});

// Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? httpContext.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 10,
                QueueLimit = 0,
                Window = TimeSpan.FromSeconds(10)
            }));
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TrainersCouncil API v1");
        c.RoutePrefix = string.Empty;
    });
}
app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();
app.UseHttpLogging();
app.MapControllers();

app.Logger.LogInformation(5, "The Api is ready");
app.Logger.LogInformation("Using Supabase key ending in: {KeyTail}",
    builder.Configuration["Supabase:Key"]?[^10..]);
app.Run();