using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // DI services for the app
            services.AddScoped<ITokenService,TokenService>();
            services.AddScoped<IProductRepository,ProductRepository>();
            services.AddScoped<IBasketRepository,BasketRepository>();
            services.AddScoped(typeof(IGenericRepository<>),typeof(GenericRepository<>));

            // Setup for validation errors to return error 
            // in the way we want
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionConext =>
                {
                    var errors = actionConext.ModelState
                                 .Where(e => e.Value.Errors.Count > 0)
                                 .SelectMany(x => x.Value.Errors)
                                 .Select(x => x.ErrorMessage).ToArray();

                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };    
                    return new BadRequestObjectResult(errorResponse);
                };
                
            });

            return services;
        }
    }
}