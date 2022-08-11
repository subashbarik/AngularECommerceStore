
using API.Extensions;
using API.Helpers;
using API.Middleware;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
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
            services.AddDbContext<StoreContext>(option => 
                                    option.UseSqlite(_config.GetConnectionString("DefaultConnection")));
            
            // Redis setup
            services.AddSingleton<IConnectionMultiplexer>(c =>
            {
                var configuration = ConfigurationOptions.Parse(_config.GetConnectionString("Redis"), true);
                return ConnectionMultiplexer.Connect(configuration);
            });
            //Calls the custom extension class for Application service configuration
            services.AddApplicationServices();
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

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
