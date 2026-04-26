using FluentValidation;
using GetDue.Application.DTOs.Stocks;

namespace GetDue.Application.Validators;

public class CreateStockRequestValidator : AbstractValidator<CreateStockRequest>
{
    public CreateStockRequestValidator()
    {
        RuleFor(x => x.Ticker)
            .NotEmpty().WithMessage("Ticker is required.")
            .MaximumLength(10).WithMessage("Ticker must not exceed 10 characters.");

        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("Company name is required.")
            .MaximumLength(200).WithMessage("Company name must not exceed 200 characters.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than zero.");

        RuleFor(x => x.BuyPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Buy price must be zero or greater.");

        RuleFor(x => x.CurrentPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Current price must be zero or greater.");
    }
}
