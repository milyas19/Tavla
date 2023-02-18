using Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Data
{
    public class TidsplanContext : IdentityDbContext<AppUser>
    {

        public DbSet<Tidsplan> Tidsplans { get; set; }
        public DbSet<Person> Persons { get; set; }
        public DbSet<Vakt> Vakts { get; set; }


        public TidsplanContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Person>().HasData(new Person
            {
                Id = 1,
                Navn = "Nadia"
            });

            modelBuilder.Entity<Vakt>().HasData(new Vakt
            {
                Id = 1,
                VaktType = "Morgen"
            });
        }
    }
}
