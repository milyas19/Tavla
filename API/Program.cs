using Microsoft.EntityFrameworkCore;
using Persistence.Data;
using MediatR;
using System.Reflection;
using Application;
using Entities;
using Persistence.Repository.TidsplanRepository;
using Persistence.Repository.KodeverkRepository;
using Application.Query.HentAktiviteter;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<TidsplanContext>
               (options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAktivitetRepository<Tidsplan>, AktivitetRepository>();
builder.Services.AddScoped<IKodeverkRepository, KodeverkRepository>();

builder.Services.AddMediatR(typeof(HentAktiviteterQueryHandler).GetTypeInfo().Assembly);
builder.Services.AddAutoMapper(typeof(AktivitetProfile));

builder.Services.AddControllers();

builder.Services.AddCors(p => p.AddPolicy("corsapp", builder =>
{
    builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("corsapp");

app.UseAuthorization();

app.MapControllers();


app.Run();
