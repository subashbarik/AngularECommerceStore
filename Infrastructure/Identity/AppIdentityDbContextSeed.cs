using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "SB",
                    Email = "subash.barik@gmail.com",
                    UserName = "subash.barik@gmail.com",
                    Address = new Address
                    {
                        FirstName = "Subash",
                        LastName = "Barik",
                        Street = "Kuchinda",
                        City = "Sambalpur",
                        State = "Odisha",
                        ZipCode = "768222"
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}