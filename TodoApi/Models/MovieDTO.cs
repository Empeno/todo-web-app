using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class MovieDTO
{
    public long Id { get; set; }

    [Required]
    [StringLength(200)]
    public string? Title { get; set; }

    [StringLength(2000)]
    public string? Description { get; set; }

    [StringLength(100)]
    public string? Genre { get; set; }

    [StringLength(2000)]
    [Url]
    public string? ImageUrl { get; set; }

    [Range(1888, 2100)]
    public int? ReleaseYear { get; set; }

    [Range(0, 10)]
    public double? MyRating { get; set; }

    [Range(0, 10)]
    public double? OfficialRating { get; set; }

    [StringLength(10)]
    public string? Certification { get; set; }
}
