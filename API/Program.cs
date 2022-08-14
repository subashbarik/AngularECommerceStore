using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // CreateHostBuilder(args).Build().Run();
            var host = CreateHostBuilder(args).Build();

            // Creating migration and database during start up
            using(var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
                try
                {
                    //Store DB Setup
                    await SetupStoreDb(services,loggerFactory);
                    //Identity DB Setup
                    await SetupIdentityDb(services);
                  
                }
                catch(Exception ex)
                {
                    var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError(ex,"An error occured during migration.");
                }
            }
            host.Run();
        }
        private static async Task SetupStoreDb(IServiceProvider services, ILoggerFactory loggerFactory)
        {
            var context = services.GetRequiredService<StoreContext>();
            await context.Database.MigrateAsync();
            await StoreContextSeed.SeedAsync(context,loggerFactory);
        }
        private static async Task SetupIdentityDb(IServiceProvider services)
        {
            var userManager = services.GetRequiredService<UserManager<AppUser>>();
            var identityContext = services.GetRequiredService<AppIdentityDbContext>();
            await identityContext.Database.MigrateAsync();
            await AppIdentityDbContextSeed.SeedUsersAsync(userManager);
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
