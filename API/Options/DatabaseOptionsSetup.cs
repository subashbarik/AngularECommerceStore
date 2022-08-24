using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace API.Options
{
    public class DatabaseOptionsSetup : IConfigureOptions<DatabaseOptions>
    {
        private readonly IConfiguration _config;
        private const string DatabaseConfigurationSectionName = "DatabaseOptions";

        public DatabaseOptionsSetup(IConfiguration config)
        {
            _config = config;
        }

        public void Configure(DatabaseOptions options)
        {
            var connectionString = _config.GetConnectionString("DefaultConnection");
            options.ConnectionString = connectionString;
            _config.GetSection(DatabaseConfigurationSectionName).Bind(options);
        }
    }
}