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

            var personer = new List<Person>
            {
                new Person { Id = 1, Navn = "Nadia" },
                new Person { Id = 2, Navn = "Ilyas" },
                new Person { Id = 3, Navn = "Amelia" },
                new Person { Id = 4, Navn = "Imaan" },
            };

            var nyePersoner = personer
                .Where(p => !context.Persons.Any(existing => existing.Id == p.Id))
                .ToList();

            if (nyePersoner.Any())
            {
                await context.Persons.AddRangeAsync(nyePersoner);
                await context.SaveChangesAsync();
            }

            var eksisterendeVakt = context.Vakts.FirstOrDefault(v => v.Id == 1);
            if (eksisterendeVakt != null)
            {
                await context.Vakts.AddAsync(new Vakt { Id = 1, VaktType = "Ilyas" });
                await context.Vakts.AddAsync(new Vakt { Id = 2, VaktType = "Nadia" });
            }
            else
            {
                await context.Vakts.AddAsync(new Vakt { Id = 1, VaktType = "Ilyas" });
                await context.Vakts.AddAsync(new Vakt { Id = 2, VaktType = "Nadia" });
            }

            await context.SaveChangesAsync();
        }
    }
}
