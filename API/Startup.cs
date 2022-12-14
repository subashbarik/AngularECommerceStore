
using API.Extensions;
using API.Helpers;
using API.Middleware;
using API.Options;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;

        public Startup(IConfiguration config)
        {
            _config = config;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            
            services.AddAutoMapper(typeof(MappingProfiles));

            // Register Database options configuration setup
            services.ConfigureOptions<DatabaseOptionsSetup>();
            // Store DbContext setup
            services.AddDbContext<StoreContext>((serviceProvider, option) => 
            {
                // Resolves Database Options , configuring database options this way is
                // very easy and we can change the values in the json configuration file
                // we can just restart the app and it will take effect without the need of
                // re-deployment
                var databaseOptions = serviceProvider.GetService<IOptions<DatabaseOptions>>()!.Value;
                // option.UseSqlite(_config.GetConnectionString("DefaultConnection"));
                // additional configuration like below that can be set
                option.UseSqlite(databaseOptions.ConnectionString,sqliteOptionsAction =>{
                    sqliteOptionsAction.CommandTimeout(databaseOptions.CommandTimeOut);
                });
                option.EnableDetailedErrors(databaseOptions.EnableDetailedErrors);
                option.EnableSensitiveDataLogging(databaseOptions.EnableSensitiveDataLogging);

            });
            //Identity DbContext setup
            services.AddDbContext<AppIdentityDbContext>(option => 
            {
                option.UseSqlite(_config.GetConnectionString("IdentityConnection"));
            });
                 
                         
            // Redis setup
            services.AddSingleton<IConnectionMultiplexer>(c =>
            {
                var configuration = ConfigurationOptions.Parse(_config.GetConnectionString("Redis"), true);
                return ConnectionMultiplexer.Connect(configuration);
            });
            //Calls the custom extension class for Application service configuration
            services.AddApplicationServices();
            //Calls the custom extension class for Identity servicesd
            services.AddIdentityServices(_config);
            //Calls the custom extension class for Swagger service configuration
            services.AddSwaggerServices();
            // CORS setting to allow Angular calls from client side
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Use custom middleware to handle error response
            // for Development and Production
            app.UseMiddleware<ExceptionMiddleware>();

            //Calls the custom extension class for Swagger application
            app.UseSwaggerDocumentation();
            
            // If endpoint for a api request not found then we need 
            // below to result proper error
            app.UseStatusCodePagesWithReExecute("/errors/{0}");
            app.UseHttpsRedirection();

            app.UseRouting();

            // for serving static files such as images
            app.UseStaticFiles();
            // apply CORS policy
            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
