using Entities;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Persistence.Repository.TidsplanRepository
{
    public class AktivitetRepository : IAktivitetRepository<Tidsplan>
    {
        private readonly TidsplanContext _dbContext;

        public AktivitetRepository(TidsplanContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Tidsplan> HentAktivitetByIdAsync(int aktivitetId)
        {
            var aktivitet = await _dbContext.Tidsplans.Include(p => p.Person).Include(v => v.Vakt).Where(x => x.Id == aktivitetId).FirstOrDefaultAsync();
            return aktivitet;
        }

        public async Task<List<Tidsplan>> HentAktiviteterAsync()
        {
            var response = await _dbContext.Tidsplans.Include(p => p.Person).Include(v => v.Vakt).ToListAsync();
            return response;
        }

        public async Task<Tidsplan> OpprettAktivitetAsync(Tidsplan tidsplan)
        {
            _dbContext.Add(tidsplan);
            await _dbContext.SaveChangesAsync();
            return tidsplan;
        }

        public async Task<bool> SlettAktivitetAsync(int aktivitetId)
        {
            var aktivitet = await _dbContext.Tidsplans.Where(x => x.Id == aktivitetId).FirstOrDefaultAsync();
            _dbContext.Remove(aktivitet);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
