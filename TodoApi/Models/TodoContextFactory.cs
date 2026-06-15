using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TodoApi.Models;

// Used only by EF Core tooling at design time (e.g. "dotnet ef migrations add").
// The connection string is a placeholder; migrations do not connect to a database.
public class TodoContextFactory : IDesignTimeDbContextFactory<TodoContext>
{
    public TodoContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<TodoContext>()
            .UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=TodoApi.DesignTime;")
            .Options;

        return new TodoContext(options);
    }
}
