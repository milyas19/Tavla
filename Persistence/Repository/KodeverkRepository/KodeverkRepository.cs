using Entities;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Persistence.Repository.KodeverkRepository
{
    public class KodeverkRepository : IKodeverkRepository
    {
        private readonly TidsplanContext _dbContext;

        public KodeverkRepository(TidsplanContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<Person>> HentNavnList()
        {
            return await _dbContext.Persons.ToListAsync();
        }

        public async Task<List<Vakt>> HentVaktList()
        {
            return await _dbContext.Vakts.ToListAsync();
        }
    }
}
