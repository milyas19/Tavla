using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Command.OpprettAktivitet
{
    public class OpprettetAktivitetDto
    {
        public int Id { get; set; }
        public DateTime Dato { get; set; }
        public DateTime EndDato { get; set; }
        public int PersonId { get; set; }
        public int VaktId { get; set; }
        public string Beskrivelse { get; set; }
    }
}
