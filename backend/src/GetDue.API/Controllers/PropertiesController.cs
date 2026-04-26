using AutoMapper;
using GetDue.API.Extensions;
using GetDue.Application.DTOs.Properties;
using GetDue.Domain.Entities;
using GetDue.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GetDue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PropertiesController : ControllerBase
{
    private readonly IRepository<Property> _repository;
    private readonly IRepository<PropertyValuation> _valuationRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public PropertiesController(
        IRepository<Property> repository,
        IRepository<PropertyValuation> valuationRepo,
        IUnitOfWork unitOfWork,
        IMapper mapper
    )
    {
        _repository = repository;
        _valuationRepo = valuationRepo;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<PropertyDto>>> GetAll(CancellationToken ct)
    {
        var userId = User.GetUserId();
        var properties = await _repository
            .Query()
            .Include(p => p.Valuations)
            .Where(p => p.UserId == userId)
            .ToListAsync(ct);
        return Ok(_mapper.Map<List<PropertyDto>>(properties));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PropertyDto>> GetById(Guid id, CancellationToken ct)
    {
        var property = await _repository
            .Query()
            .Include(p => p.Valuations)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == User.GetUserId(), ct);
        if (property is null)
            return NotFound();
        return Ok(_mapper.Map<PropertyDto>(property));
    }

    [HttpPost]
    public async Task<ActionResult<PropertyDto>> Create(
        CreatePropertyRequest request,
        CancellationToken ct
    )
    {
        var property = _mapper.Map<Property>(request);
        property.Id = Guid.NewGuid();
        property.UserId = User.GetUserId();
        await _repository.AddAsync(property, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return CreatedAtAction(
            nameof(GetById),
            new { id = property.Id },
            _mapper.Map<PropertyDto>(property)
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PropertyDto>> Update(
        Guid id,
        UpdatePropertyRequest request,
        CancellationToken ct
    )
    {
        var property = await _repository
            .Query()
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == User.GetUserId(), ct);
        if (property is null)
            return NotFound();

        _mapper.Map(request, property);
        await _repository.UpdateAsync(property, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Ok(_mapper.Map<PropertyDto>(property));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var property = await _repository
            .Query()
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == User.GetUserId(), ct);
        if (property is null)
            return NotFound();

        await _repository.DeleteAsync(property, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return NoContent();
    }

    /// <summary>Add a valuation to a property</summary>
    [HttpPost("{id:guid}/valuations")]
    public async Task<ActionResult<PropertyValuationDto>> AddValuation(
        Guid id,
        PropertyValuationDto request,
        CancellationToken ct
    )
    {
        var property = await _repository
            .Query()
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == User.GetUserId(), ct);
        if (property is null)
            return NotFound();

        var valuation = new PropertyValuation
        {
            Id = Guid.NewGuid(),
            PropertyId = id,
            Value = request.Value,
            ValuationDate = request.ValuationDate,
            Source = request.Source,
        };

        property.CurrentValue = request.Value;
        await _valuationRepo.AddAsync(valuation, ct);
        await _repository.UpdateAsync(property, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Created(
            $"api/properties/{id}/valuations",
            _mapper.Map<PropertyValuationDto>(valuation)
        );
    }

    /// <summary>Get valuations for a property</summary>
    [HttpGet("{id:guid}/valuations")]
    public async Task<ActionResult<List<PropertyValuationDto>>> GetValuations(
        Guid id,
        CancellationToken ct
    )
    {
        var property = await _repository
            .Query()
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == User.GetUserId(), ct);
        if (property is null)
            return NotFound();

        var valuations = await _valuationRepo
            .Query()
            .Where(v => v.PropertyId == id)
            .OrderByDescending(v => v.ValuationDate)
            .ToListAsync(ct);
        return Ok(_mapper.Map<List<PropertyValuationDto>>(valuations));
    }
}
