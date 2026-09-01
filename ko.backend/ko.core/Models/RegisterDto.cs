using System.ComponentModel.DataAnnotations;

namespace ko.core.Models
{
    public class RegisterStudentDto
    {
        [Required]
        [Display(Name = "Full Name")]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Institutional Email")]
        public string Email { get; set; }

        [Required]
        [Display(Name = "Student Number")]
        public string StudentNumber { get; set; }

        [Required]
        [Display(Name = "University")]
        public string University { get; set; } = "University Of The Freestate";

        [Required]
        [Phone]
        [Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        [Range(0, double.MaxValue, ErrorMessage = "Budget must be a positive value")]
        [Display(Name = "Monthly Budget (ZAR)")]
        public decimal Budget { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters")]
        public string Password { get; set; }
    }



    public class ProfileDto
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string StudentNumber { get; set; }
        public string University { get; set; } = "University Of The Freestate";
        public string PhoneNumber { get; set; }
        public decimal Budget { get; set; }
        public string Role { get; set; } 
    }

    public class UpdateProfileDto
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        // Student only
        public string? StudentNumber { get; set; }
        public string? University { get; set; }
        public decimal? Budget { get; set; }
    }
}
