using FluentValidation;
using GetDue.Application.DTOs.Loans;

namespace GetDue.Application.Validators;

public class CreateLoanRequestValidator : AbstractValidator<CreateLoanRequest>
{
    public CreateLoanRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Loan name is required.")
            .MaximumLength(200).WithMessage("Loan name must not exceed 200 characters.");

        RuleFor(x => x.Principal)
            .GreaterThan(0).WithMessage("Principal must be greater than zero.");

        RuleFor(x => x.InterestRate)
            .InclusiveBetween(0, 100).WithMessage("Interest rate must be between 0 and 100.");

        RuleFor(x => x.MonthlyPayment)
            .GreaterThan(0).WithMessage("Monthly payment must be greater than zero.");

        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date.");
    }
}
