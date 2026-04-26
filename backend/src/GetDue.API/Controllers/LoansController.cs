using AutoMapper;
using GetDue.API.Extensions;
using GetDue.Application.DTOs.Loans;
using GetDue.Domain.Entities;
using GetDue.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GetDue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LoansController : ControllerBase
{
    private readonly IRepository<Loan> _repository;
    private readonly IRepository<LoanPayment> _paymentRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public LoansController(
        IRepository<Loan> repository, IRepository<LoanPayment> paymentRepo,
        IUnitOfWork unitOfWork, IMapper mapper)
    {
        _repository = repository;
        _paymentRepo = paymentRepo;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<LoanDto>>> GetAll(CancellationToken ct)
    {
        var loans = await _repository.Query()
            .Include(l => l.Payments)
            .Where(l => l.UserId == User.GetUserId())
            .ToListAsync(ct);
        return Ok(_mapper.Map<List<LoanDto>>(loans));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<LoanDto>> GetById(Guid id, CancellationToken ct)
    {
        var loan = await _repository.Query()
            .Include(l => l.Payments)
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == User.GetUserId(), ct);
        if (loan is null) return NotFound();
        return Ok(_mapper.Map<LoanDto>(loan));
    }

    [HttpPost]
    public async Task<ActionResult<LoanDto>> Create(CreateLoanRequest request, CancellationToken ct)
    {
        var loan = _mapper.Map<Loan>(request);
        loan.Id = Guid.NewGuid();
        loan.UserId = User.GetUserId();
        await _repository.AddAsync(loan, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = loan.Id }, _mapper.Map<LoanDto>(loan));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<LoanDto>> Update(Guid id, UpdateLoanRequest request, CancellationToken ct)
    {
        var loan = await _repository.Query()
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == User.GetUserId(), ct);
        if (loan is null) return NotFound();

        _mapper.Map(request, loan);
        await _repository.UpdateAsync(loan, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Ok(_mapper.Map<LoanDto>(loan));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var loan = await _repository.Query()
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == User.GetUserId(), ct);
        if (loan is null) return NotFound();

        await _repository.DeleteAsync(loan, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return NoContent();
    }

    /// <summary>Record a loan payment</summary>
    [HttpPost("{id:guid}/payments")]
    public async Task<ActionResult<LoanPaymentDto>> RecordPayment(Guid id, LoanPaymentDto request, CancellationToken ct)
    {
        var loan = await _repository.Query()
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == User.GetUserId(), ct);
        if (loan is null) return NotFound();

        var payment = new LoanPayment
        {
            Id = Guid.NewGuid(),
            LoanId = id,
            Amount = request.Amount,
            PrincipalPortion = request.PrincipalPortion,
            InterestPortion = request.InterestPortion,
            PaymentDate = request.PaymentDate
        };

        loan.RemainingBalance -= request.PrincipalPortion;
        if (loan.RemainingBalance < 0) loan.RemainingBalance = 0;

        await _paymentRepo.AddAsync(payment, ct);
        await _repository.UpdateAsync(loan, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Created($"api/loans/{id}/payments", _mapper.Map<LoanPaymentDto>(payment));
    }

    /// <summary>Get payment history for a loan</summary>
    [HttpGet("{id:guid}/payments")]
    public async Task<ActionResult<List<LoanPaymentDto>>> GetPayments(Guid id, CancellationToken ct)
    {
        var loan = await _repository.Query()
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == User.GetUserId(), ct);
        if (loan is null) return NotFound();

        var payments = await _paymentRepo.Query()
            .Where(p => p.LoanId == id)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync(ct);
        return Ok(_mapper.Map<List<LoanPaymentDto>>(payments));
    }

    /// <summary>Generate amortization schedule</summary>
    [HttpGet("{id:guid}/schedule")]
    public async Task<ActionResult<List<LoanPaymentDto>>> GetSchedule(Guid id, CancellationToken ct)
    {
        var loan = await _repository.Query()
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == User.GetUserId(), ct);
        if (loan is null) return NotFound();

        var schedule = new List<LoanPaymentDto>();
        var balance = loan.RemainingBalance;
        var monthlyRate = loan.InterestRate / 100 / 12;
        var paymentDate = DateTime.UtcNow;

        while (balance > 0)
        {
            var interestPortion = balance * monthlyRate;
            var principalPortion = Math.Min(loan.MonthlyPayment - interestPortion, balance);
            if (principalPortion <= 0) break;

            balance -= principalPortion;
            paymentDate = paymentDate.AddMonths(1);

            schedule.Add(new LoanPaymentDto
            {
                Id = Guid.Empty,
                LoanId = id,
                Amount = principalPortion + interestPortion,
                PrincipalPortion = principalPortion,
                InterestPortion = interestPortion,
                PaymentDate = paymentDate
            });

            if (schedule.Count > 600) break; // safety limit
        }

        return Ok(schedule);
    }
}
