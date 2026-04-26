using AutoMapper;
using GetDue.API.Extensions;
using GetDue.Application.DTOs.Calendar;
using GetDue.Domain.Entities;
using GetDue.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GetDue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CalendarController : ControllerBase
{
    private readonly IRepository<CalendarEvent> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CalendarController(IRepository<CalendarEvent> repository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>Get calendar events in a date range</summary>
    [HttpGet]
    public async Task<ActionResult<List<CalendarEventDto>>> GetAll(
        [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, CancellationToken ct)
    {
        var userId = User.GetUserId();
        var q = _repository.Query().Where(e => e.UserId == userId);

        if (startDate.HasValue) q = q.Where(e => e.EventDate >= startDate.Value);
        if (endDate.HasValue) q = q.Where(e => e.EventDate <= endDate.Value);

        var events = await q.OrderBy(e => e.EventDate).ToListAsync(ct);
        return Ok(_mapper.Map<List<CalendarEventDto>>(events));
    }

    [HttpPost]
    public async Task<ActionResult<CalendarEventDto>> Create(CreateCalendarEventRequest request, CancellationToken ct)
    {
        var calendarEvent = _mapper.Map<CalendarEvent>(request);
        calendarEvent.Id = Guid.NewGuid();
        calendarEvent.UserId = User.GetUserId();
        await _repository.AddAsync(calendarEvent, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Created($"api/calendar/{calendarEvent.Id}", _mapper.Map<CalendarEventDto>(calendarEvent));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CalendarEventDto>> Update(Guid id, CalendarEventDto request, CancellationToken ct)
    {
        var calendarEvent = await _repository.Query()
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == User.GetUserId(), ct);
        if (calendarEvent is null) return NotFound();

        calendarEvent.Title = request.Title;
        calendarEvent.Description = request.Description;
        calendarEvent.EventDate = request.EventDate;
        calendarEvent.IsCompleted = request.IsCompleted;

        await _repository.UpdateAsync(calendarEvent, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return Ok(_mapper.Map<CalendarEventDto>(calendarEvent));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var calendarEvent = await _repository.Query()
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == User.GetUserId(), ct);
        if (calendarEvent is null) return NotFound();

        await _repository.DeleteAsync(calendarEvent, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        return NoContent();
    }
}
