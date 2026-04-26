using AutoMapper;
using GetDue.API.Extensions;
using GetDue.Application.DTOs.Stocks;
using GetDue.Domain.Entities;
using GetDue.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GetDue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StocksController : ControllerBase
{
    private readonly IRepository<Stock> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public StocksController(IRepository<Stock> repository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>Get all stocks for the current user</summary>
    [HttpGet]
    public async Task<ActionResult<List<StockDto>>> GetAll(CancellationToken ct)
    {
        var userId = User.GetUserId();
        var stocks = await _repository.Query()
            .Include(s => s.Dividends)
            .Where(s => s.UserId == userId)
            .ToListAsync(ct);
        return Ok(_mapper.Map<List<StockDto>>(stocks));
    }

    /// <summary>Get a stock by ID</summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StockDto>> GetById(Guid id, CancellationToken ct)
    {
        var stock = await _repository.Query()
            .Include(s => s.Dividends)
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == User.GetUserId(), ct);
        if (stock is null) return NotFound();
        return Ok(_mapper.Map<StockDto>(stock));
    }

    /// <summary>Add a new stock</summary>
    [HttpPost]
    public async Task<ActionResult<StockDto>> Create(CreateStockRequest request, CancellationToken ct)
    {
        var stock = _mapper.Map<Stock>(request);
        stock.Id = Guid.NewGuid();
        stock.UserId = User.GetUserId();
        await _repository.AddAsync(stock, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = stock.Id }, _mapper.Map<StockDto>(stock));
    }

    /// <summary>Update a stock</summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<StockDto>> Update(Guid id, UpdateStockRequest request, CancellationToken ct)
    {
        var stock = await _repository.Query()
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == User.GetUserId(), ct);
        if (stock is null) return NotFound();

        _mapper.Map(request, stock);
        await _repository.UpdateAsync(stock, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Ok(_mapper.Map<StockDto>(stock));
    }

    /// <summary>Delete a stock</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var stock = await _repository.Query()
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == User.GetUserId(), ct);
        if (stock is null) return NotFound();

        await _repository.DeleteAsync(stock, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return NoContent();
    }
}
