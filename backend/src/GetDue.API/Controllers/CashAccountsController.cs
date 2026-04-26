using AutoMapper;
using GetDue.API.Extensions;
using GetDue.Application.DTOs.CashAccounts;
using GetDue.Domain.Entities;
using GetDue.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GetDue.API.Controllers;

[ApiController]
[Route("api/cash-accounts")]
[Authorize]
public class CashAccountsController : ControllerBase
{
    private readonly IRepository<CashAccount> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CashAccountsController(IRepository<CashAccount> repository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<CashAccountDto>>> GetAll(CancellationToken ct)
    {
        var accounts = await _repository.Query()
            .Where(a => a.UserId == User.GetUserId())
            .ToListAsync(ct);
        return Ok(_mapper.Map<List<CashAccountDto>>(accounts));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CashAccountDto>> GetById(Guid id, CancellationToken ct)
    {
        var account = await _repository.Query()
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == User.GetUserId(), ct);
        if (account is null) return NotFound();
        return Ok(_mapper.Map<CashAccountDto>(account));
    }

    [HttpPost]
    public async Task<ActionResult<CashAccountDto>> Create(CreateCashAccountRequest request, CancellationToken ct)
    {
        var account = _mapper.Map<CashAccount>(request);
        account.Id = Guid.NewGuid();
        account.UserId = User.GetUserId();
        await _repository.AddAsync(account, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = account.Id }, _mapper.Map<CashAccountDto>(account));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CashAccountDto>> Update(Guid id, UpdateCashAccountRequest request, CancellationToken ct)
    {
        var account = await _repository.Query()
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == User.GetUserId(), ct);
        if (account is null) return NotFound();

        _mapper.Map(request, account);
        await _repository.UpdateAsync(account, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Ok(_mapper.Map<CashAccountDto>(account));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var account = await _repository.Query()
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == User.GetUserId(), ct);
        if (account is null) return NotFound();

        await _repository.DeleteAsync(account, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return NoContent();
    }
}
