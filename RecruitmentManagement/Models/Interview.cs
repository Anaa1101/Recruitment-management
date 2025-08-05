using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RecruitmentManagement.Models
{
    public class Interview
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InterviewId { get; set; }

        [Required]
        public int CandidateId { get; set; }

        [ForeignKey("CandidateId")]
        public Candidate Candidate { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string Status { get; set; }

        [Required]
        public int RecruiterId { get; set; }

        [ForeignKey("RecruiterId")]
        [JsonIgnore]
        public Evaluator Evaluator { get; set; }
    }
}
