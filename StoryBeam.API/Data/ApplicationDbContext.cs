using Microsoft.EntityFrameworkCore;        // DbContext sınıfını kullanmak için
using StoryBeam.API.Models;

namespace StoryBeam.API.Data
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        
        public DbSet<StoryBeamPosts> StoryBeamPosts { get; set; }
    }
}