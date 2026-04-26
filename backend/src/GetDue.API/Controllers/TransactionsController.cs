using AutoMapper;
using GetDue.API.Extensions;
using GetDue.Application.Common;
using GetDue.Application.DTOs.Transactions;
using GetDue.Domain.Entities;
using GetDue.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GetDue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly IRepository<Transaction> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TransactionsController(
        IRepository<Transaction> repository,
        IUnitOfWork unitOfWork,
        IMapper mapper
    )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>Get transactions with filtering and pagination</summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<TransactionDto>>> GetAll(
        [FromQuery] TransactionQueryParameters query,
        CancellationToken ct
    )
    {
        var userId = User.GetUserId();
        var q = _repository.Query().Where(t => t.UserId == userId);

        if (query.StartDate.HasValue)
            q = q.Where(t => t.TransactionDate >= query.StartDate.Value);
        if (query.EndDate.HasValue)
            q = q.Where(t => t.TransactionDate <= query.EndDate.Value);
        if (query.Type.HasValue)
            q = q.Where(t => t.Type == query.Type.Value);
        if (query.Category.HasValue)
            q = q.Where(t => t.Category == query.Category.Value);
        if (query.CashAccountId.HasValue)
            q = q.Where(t => t.CashAccountId == query.CashAccountId.Value);

        var totalCount = await q.CountAsync(ct);

        q = query.SortDescending
            ? q.OrderByDescending(t => t.TransactionDate)
            : q.OrderBy(t => t.TransactionDate);

        var items = await q.Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        return Ok(
            new PagedResult<TransactionDto>
            {
                Items = _mapper.Map<List<TransactionDto>>(items),
                TotalCount = totalCount,
                Page = query.Page,
                PageSize = query.PageSize,
            }
        );
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TransactionDto>> GetById(Guid id, CancellationToken ct)
    {
        var transaction = await _repository
            .Query()
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == User.GetUserId(), ct);
        if (transaction is null)
            return NotFound();
        return Ok(_mapper.Map<TransactionDto>(transaction));
    }

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> Create(
        CreateTransactionRequest request,
        CancellationToken ct
    )
    {
        var transaction = _mapper.Map<Transaction>(request);
        transaction.Id = Guid.NewGuid();
        transaction.UserId = User.GetUserId();
        await _repository.AddAsync(transaction, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return CreatedAtAction(
            nameof(GetById),
            new { id = transaction.Id },
            _mapper.Map<TransactionDto>(transaction)
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TransactionDto>> Update(
        Guid id,
        UpdateTransactionRequest request,
        CancellationToken ct
    )
    {
        var transaction = await _repository
            .Query()
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == User.GetUserId(), ct);
        if (transaction is null)
            return NotFound();

        _mapper.Map(request, transaction);
        await _repository.UpdateAsync(transaction, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Ok(_mapper.Map<TransactionDto>(transaction));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var transaction = await _repository
            .Query()
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == User.GetUserId(), ct);
        if (transaction is null)
            return NotFound();

        await _repository.DeleteAsync(transaction, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return NoContent();
    }
}
