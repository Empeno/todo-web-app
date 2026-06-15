using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MoviesController : ControllerBase
{
    private readonly TodoContext _context;

    public MoviesController(TodoContext context)
    {
        _context = context;
    }

    // GET: api/Movies
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMovies()
    {
        return await _context.Movies
            .OrderByDescending(m => m.MyRating)
            .Select(m => ItemToDTO(m))
            .ToListAsync();
    }

    // GET: api/Movies/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MovieDTO>> GetMovie(long id)
    {
        var movie = await _context.Movies.FindAsync(id);

        if (movie == null)
        {
            return NotFound();
        }

        return ItemToDTO(movie);
    }

    // PUT: api/Movies/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMovie(long id, MovieDTO movieDTO)
    {
        if (id != movieDTO.Id)
        {
            return BadRequest();
        }

        var movie = await _context.Movies.FindAsync(id);
        if (movie == null)
        {
            return NotFound();
        }

        movie.Title = movieDTO.Title;
        movie.Description = movieDTO.Description;
        movie.Genre = movieDTO.Genre;
        movie.ImageUrl = movieDTO.ImageUrl;
        movie.ReleaseYear = movieDTO.ReleaseYear;
        movie.MyRating = movieDTO.MyRating;
        movie.OfficialRating = movieDTO.OfficialRating;
        movie.Certification = movieDTO.Certification;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException) when (!MovieExists(id))
        {
            return NotFound();
        }

        return NoContent();
    }

    // POST: api/Movies
    [HttpPost]
    public async Task<ActionResult<MovieDTO>> PostMovie(MovieDTO movieDTO)
    {
        var movie = new Movie
        {
            Title = movieDTO.Title,
            Description = movieDTO.Description,
            Genre = movieDTO.Genre,
            ImageUrl = movieDTO.ImageUrl,
            ReleaseYear = movieDTO.ReleaseYear,
            MyRating = movieDTO.MyRating,
            OfficialRating = movieDTO.OfficialRating,
            Certification = movieDTO.Certification
        };

        _context.Movies.Add(movie);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMovie),
            new { id = movie.Id },
            ItemToDTO(movie));
    }

    // DELETE: api/Movies/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovie(long id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null)
        {
            return NotFound();
        }

        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool MovieExists(long id)
    {
        return _context.Movies.Any(e => e.Id == id);
    }

    private static MovieDTO ItemToDTO(Movie movie) =>
        new MovieDTO
        {
            Id = movie.Id,
            Title = movie.Title,
            Description = movie.Description,
            Genre = movie.Genre,
            ImageUrl = movie.ImageUrl,
            ReleaseYear = movie.ReleaseYear,
            MyRating = movie.MyRating,
            OfficialRating = movie.OfficialRating,
            Certification = movie.Certification
        };
}
