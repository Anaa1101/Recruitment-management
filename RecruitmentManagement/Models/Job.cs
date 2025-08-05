using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RecruitmentManagement.Models
{
    public class Job
    {
        [Key]
        public int JobId {  get; set; }
        [Required]
        public string JobName { get; set; }
        public string Description {  get; set; }
        [Required]
        public string type { get; set; }//Full-time,Part-time,Internship

        [Required]
        public string WorkMode {  get; set; }

        public ICollection<Candidate> Candidates { get; set; }
    }
}
