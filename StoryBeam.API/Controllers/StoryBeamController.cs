using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoryBeam.API.Data;
using StoryBeam.API.Models;

namespace StoryBeam.API.Controllers
{
    [ApiController]

    [Route("api/[controller]")]

    public class StoryBeamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public StoryBeamController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]

        public async Task<ActionResult<IEnumerable<StoryBeamPosts>>> GetStoryBeamPosts()
        {
            return await _context.StoryBeamPosts.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<StoryBeamPosts>> CreateStoryBeamPost(StoryBeamPosts storyBeam)
        {
           
            _context.StoryBeamPosts.Add(storyBeam);
            await _context.SaveChangesAsync();
            return storyBeam;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStoryBeamPost(int id, StoryBeamPosts storyBeam)
        {
            if (id != storyBeam.ID)
            {
                return BadRequest();
            }

            _context.Entry(storyBeam).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlogPost(int id)
        {
            var storyBeam = await _context.StoryBeamPosts.FindAsync(id);
            if(storyBeam == null)
            {
                return NotFound();
            }
            _context.StoryBeamPosts.Remove(storyBeam);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}