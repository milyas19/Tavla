using Entities;

namespace Persistence.Repository.KodeverkRepository
{
    public interface IKodeverkRepository
    {
        Task<List<Person>> HentNavnList();
        Task<List<Vakt>> HentVaktList();
        Task<Vakt> OpprettVakt(Vakt vakt);
    }
}
