namespace TodoApi.Models;

public class Movie
{
    public long Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Genre { get; set; }
    public string? ImageUrl { get; set; }
    public int? ReleaseYear { get; set; }

    // Personal score on a 0-10 scale.
    public double? MyRating { get; set; }

    // Public / critic score on a 0-10 scale.
    public double? OfficialRating { get; set; }

    // Content certification, e.g. "PG-13", "R".
    public string? Certification { get; set; }
}
