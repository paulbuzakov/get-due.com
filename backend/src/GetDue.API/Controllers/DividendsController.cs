using AutoMapper;
using GetDue.API.Extensions;
using GetDue.Application.DTOs.Dividends;
using GetDue.Domain.Entities;
using GetDue.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GetDue.API.Controllers;

[ApiController]
[Authorize]
public class DividendsController : ControllerBase
{
    private readonly IRepository<Dividend> _dividendRepo;
    private readonly IRepository<Stock> _stockRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DividendsController(
        IRepository<Dividend> dividendRepo, IRepository<Stock> stockRepo,
        IUnitOfWork unitOfWork, IMapper mapper)
    {
        _dividendRepo = dividendRepo;
        _stockRepo = stockRepo;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>Get dividends for a stock</summary>
    [HttpGet("api/stocks/{stockId:guid}/dividends")]
    public async Task<ActionResult<List<DividendDto>>> GetByStock(Guid stockId, CancellationToken ct)
    {
        var stock = await _stockRepo.Query()
            .FirstOrDefaultAsync(s => s.Id == stockId && s.UserId == User.GetUserId(), ct);
        if (stock is null) return NotFound();

        var dividends = await _dividendRepo.Query()
            .Where(d => d.StockId == stockId)
            .OrderByDescending(d => d.PaymentDate)
            .ToListAsync(ct);
        return Ok(_mapper.Map<List<DividendDto>>(dividends));
    }

    /// <summary>Add a dividend to a stock</summary>
    [HttpPost("api/stocks/{stockId:guid}/dividends")]
    public async Task<ActionResult<DividendDto>> Create(Guid stockId, CreateDividendRequest request, CancellationToken ct)
    {
        var stock = await _stockRepo.Query()
            .FirstOrDefaultAsync(s => s.Id == stockId && s.UserId == User.GetUserId(), ct);
        if (stock is null) return NotFound();

        var dividend = _mapper.Map<Dividend>(request);
        dividend.Id = Guid.NewGuid();
        dividend.StockId = stockId;
        await _dividendRepo.AddAsync(dividend, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Created($"api/stocks/{stockId}/dividends", _mapper.Map<DividendDto>(dividend));
    }

    /// <summary>Delete a dividend</summary>
    [HttpDelete("api/dividends/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var dividend = await _dividendRepo.Query()
            .Include(d => d.Stock)
            .FirstOrDefaultAsync(d => d.Id == id && d.Stock.UserId == User.GetUserId(), ct);
        if (dividend is null) return NotFound();

        await _dividendRepo.DeleteAsync(dividend, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return NoContent();
    }
}
