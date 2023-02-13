using Application.Feature.Kodeverk.Query.HentNavnList;
using Application.Feature.Kodeverk.Query.HentVaktList;

namespace Application.Query.HentAktivitetAvId
{
    public class HentAktivitetDto
    {
        public int Id { get; set; }
        public DateTime Dato { get; set; }
        public DateTime EndDato { get; set; }
        public HentPersonDto Person { get; set; }
        public int PersonId { get; set; }
        public HentVaktDto Vakt { get; set; }
        public int VaktId { get; set; }
        public string Beskrivelse { get; set; }
    }
}
