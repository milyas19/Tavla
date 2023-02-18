using Microsoft.EntityFrameworkCore;
using Persistence.Data;
using MediatR;
using System.Reflection;
using Application;
using Persistence.Repository.TidsplanRepository;
using Persistence.Repository.KodeverkRepository;
using Application.Query.HentAktiviteter;
using API.Extensions;
using Microsoft.AspNetCore.Identity;
using Entities;
using Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddDbContext<TidsplanContext>
               (options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAktivitetRepository, AktivitetRepository>();
builder.Services.AddScoped<IKodeverkRepository, KodeverkRepository>();

builder.Services.AddMediatR(typeof(HentAktiviteterQueryHandler).GetTypeInfo().Assembly);
builder.Services.AddAutoMapper(typeof(AktivitetProfile));


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

//check if its a valid user
app.UseAuthentication();

//then give authorization to specific page
app.UseAuthorization();

app.MapControllers();


using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<TidsplanContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}


app.Run();
