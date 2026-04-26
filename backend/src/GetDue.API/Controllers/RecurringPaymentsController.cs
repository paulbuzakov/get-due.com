using AutoMapper;
using GetDue.API.Extensions;
using GetDue.Application.DTOs.RecurringPayments;
using GetDue.Domain.Entities;
using GetDue.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GetDue.API.Controllers;

[ApiController]
[Route("api/recurring-payments")]
[Authorize]
public class RecurringPaymentsController : ControllerBase
{
    private readonly IRepository<RecurringPayment> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RecurringPaymentsController(IRepository<RecurringPayment> repository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<RecurringPaymentDto>>> GetAll(CancellationToken ct)
    {
        var payments = await _repository.Query()
            .Where(rp => rp.UserId == User.GetUserId())
            .OrderBy(rp => rp.NextPaymentDate)
            .ToListAsync(ct);
        return Ok(_mapper.Map<List<RecurringPaymentDto>>(payments));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RecurringPaymentDto>> GetById(Guid id, CancellationToken ct)
    {
        var payment = await _repository.Query()
            .FirstOrDefaultAsync(rp => rp.Id == id && rp.UserId == User.GetUserId(), ct);
        if (payment is null) return NotFound();
        return Ok(_mapper.Map<RecurringPaymentDto>(payment));
    }

    [HttpPost]
    public async Task<ActionResult<RecurringPaymentDto>> Create(CreateRecurringPaymentRequest request, CancellationToken ct)
    {
        var payment = _mapper.Map<RecurringPayment>(request);
        payment.Id = Guid.NewGuid();
        payment.UserId = User.GetUserId();
        payment.IsActive = true;
        await _repository.AddAsync(payment, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = payment.Id }, _mapper.Map<RecurringPaymentDto>(payment));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RecurringPaymentDto>> Update(Guid id, CreateRecurringPaymentRequest request, CancellationToken ct)
    {
        var payment = await _repository.Query()
            .FirstOrDefaultAsync(rp => rp.Id == id && rp.UserId == User.GetUserId(), ct);
        if (payment is null) return NotFound();

        _mapper.Map(request, payment);
        await _repository.UpdateAsync(payment, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Ok(_mapper.Map<RecurringPaymentDto>(payment));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var payment = await _repository.Query()
            .FirstOrDefaultAsync(rp => rp.Id == id && rp.UserId == User.GetUserId(), ct);
        if (payment is null) return NotFound();

        await _repository.DeleteAsync(payment, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return NoContent();
    }
}
