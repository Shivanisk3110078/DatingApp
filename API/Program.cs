using System.Text;
using API.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));

//app.UseHttpsRedirection();

//app.UseAuthorization();
//Now the positioning of the middleware is important,we need to add the authentication middleware before the MapControllers() method and after UseCors() method.
//So very specifically, we need two piece of middleware here.

//These two pieces of middleware ask two different question

//It ask, Do you have valid token?
app.UseAuthentication(); // this has come to first

//At the moment when users authenticated then they can go to an authenticated endpoint
//So with our middleware we should be able to test those few methods where we are specifying we need somebody to authenticate against the endpoint

//Authorization part says, okay, you have a valid token Now what are you allowed to do?
app.UseAuthorization(); //this has to come second

app.MapControllers();

app.Run();
