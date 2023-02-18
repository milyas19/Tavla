using Entities;
using Microsoft.AspNetCore.Identity;
using Persistence.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(TidsplanContext context,
           UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        Id = "a",
                        DisplayName = "Ilyas",
                        UserName = "ilyas83",
                        Email = "ilyas@test.com"
                    },
                    new AppUser
                    {
                        Id = "b",
                        DisplayName = "Nadia",
                        UserName = "nadia86",
                        Email = "nadia@test.com"
                    },
                    new AppUser
                    {
                        Id = "c",
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com"
                    },
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
                await context.SaveChangesAsync();
            }
        }
    }
}
