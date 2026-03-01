using Entities;
using Microsoft.AspNetCore.Identity;
using Persistence.Data;

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

            var ønskedePersoner = new List<string>
            {
                "Nadia",
                "Ilyas",
                "Amelia",
                "Imaan",
            };

            foreach (var navn in ønskedePersoner)
            {
                if (!context.Persons.Any(p => p.Navn == navn))
                {
                    await context.Persons.AddAsync(new Person { Navn = navn });
                }
            }

            var ønskedeVakter = new List<string>
            {
                "Ansvar",
            };

            foreach (var vaktType in ønskedeVakter)
            {
                if (!context.Vakts.Any(v => v.VaktType == vaktType))
                {
                    await context.Vakts.AddAsync(new Vakt { VaktType = vaktType });
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
