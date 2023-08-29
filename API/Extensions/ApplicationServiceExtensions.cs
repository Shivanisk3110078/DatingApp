using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions //to create an extension method, we need to make this class static 
    //when we make a class static, that means we can use the methods inside it without instantiating a new instance of this class. 
    {
       public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) //extending the IServiceCollection
       {
         //if I specify services then we have got all of the same services available that we could have added in the program class things like AddCors(), AddDbContext etc.
         services.AddDbContext<DataContext>(opt => 
         {
           opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
         });

         services.AddCors();

         services.AddScoped<ITokenService, TokenService>();  //Available for injection elsewhere in our application

        return services;
       }
    }
}