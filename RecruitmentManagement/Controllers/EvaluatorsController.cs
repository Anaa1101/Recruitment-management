using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentManagement.Data;
using RecruitmentManagement.Models;

namespace RecruitmentManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvaluatorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EvaluatorsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Evaluators
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Evaluator>>> GetEvaluators()
        {
            return await _context.Evaluators.ToListAsync();
        }

        // GET: api/Evaluators/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Evaluator>> GetEvaluator(int id)
        {
            var evaluator = await _context.Evaluators.FindAsync(id);

            if (evaluator == null)
            {
                return NotFound();
            }

            return evaluator;
        }

        // PUT: api/Evaluators/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvaluator(int id, Evaluator evaluator)
        {
            if (id != evaluator.EvaluatorId)
            {
                return BadRequest();
            }

            _context.Entry(evaluator).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EvaluatorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Evaluators
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Evaluator>> PostEvaluator(Evaluator evaluator)
        {
            _context.Evaluators.Add(evaluator);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEvaluator", new { id = evaluator.EvaluatorId }, evaluator);
        }

        // DELETE: api/Evaluators/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvaluator(int id)
        {
            var evaluator = await _context.Evaluators.FindAsync(id);
            if (evaluator == null)
            {
                return NotFound();
            }

            _context.Evaluators.Remove(evaluator);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EvaluatorExists(int id)
        {
            return _context.Evaluators.Any(e => e.EvaluatorId == id);
        }
    }
}
