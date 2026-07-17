using ko.core.Contracts;
using ko.core.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ko.core.Extensions
{
    public static class CoreServiceRegistration
    {
        public static IServiceCollection AddCoreServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped(typeof(IAppLogger<>), typeof(LoggerAdapter<>));
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddScoped<IFileUploadService, FileUploadService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IEmailServiceMailJet, EmailServiceMailJet>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPropertyService, PropertyService>();
            services.AddScoped<ITenancyService, TenancyService>();
            services.AddScoped<IWaitingListService, WaitingListService>();
            services.AddScoped<IApplicationService, ApplicationService>();
            services.AddScoped<IAnnouncementService, AnnouncementService>();
            services.AddScoped<IMaintenanceRequestService, MaintenanceRequestService>();

            services.AddScoped(typeof(IGenericService<>), typeof(GenericService<>));

            return services;
        }
    }
}
