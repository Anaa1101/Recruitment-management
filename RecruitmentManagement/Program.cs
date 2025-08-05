using Microsoft.EntityFrameworkCore;
using RecruitmentManagement.Data;
using RecruitmentManagement.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ MySQL Configuration
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("AppDbContext"),
        new MySqlServerVersion(new Version(8, 0, 0)) // Match your MySQL version
    )
);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // React app origin
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register services
builder.Services.AddScoped<JobService>();
builder.Services.AddScoped<CandidateService>();
builder.Services.AddScoped<InterviewService>();
builder.Services.AddScoped<EvaluatorService>();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();


var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ✅ Add CORS BEFORE authorization
app.UseCors("AllowAll");

app.UseAuthorization();
app.UseStaticFiles();


app.MapControllers();

app.Run();
