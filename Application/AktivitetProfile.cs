using Application.Feature.Kodeverk.Query.HentNavnList;
using Application.Feature.Kodeverk.Query.HentVaktList;
using Application.Query.HentAktiviteter;
using AutoMapper;
using Entities;

namespace Application
{
    public class AktivitetProfile : Profile
    {
        public AktivitetProfile()
        {
            CreateMap<Tidsplan, HentAktivitetDto>()
                .ForMember(dest => dest.Dato, opt => opt.MapFrom(src => src.Dato))
                .ForMember(dest => dest.EndDato, opt => opt.MapFrom(src => src.EndDato))
                .ReverseMap();

            CreateMap<Tidsplan, HentPersonDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Person.Id)).ReverseMap();

            CreateMap<Person, HentPersonDto>().ReverseMap();
            CreateMap<Vakt, HentVaktDto>().ReverseMap();

            CreateMap<HentAktivitetDto, HentPersonDto>()
               .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.PersonId)).ReverseMap();
        }
    }
}


