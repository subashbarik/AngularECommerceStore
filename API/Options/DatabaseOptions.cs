using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Options
{
    public class DatabaseOptions
    {
        public string ConnectionString { get; set; }
        public int CommandTimeOut { get; set; }
        public bool EnableDetailedErrors { get; set; }
        public bool EnableSensitiveDataLogging { get; set; }
    }
}