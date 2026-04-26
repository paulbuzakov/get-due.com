using FluentValidation;
using GetDue.Application.DTOs.Transactions;

namespace GetDue.Application.Validators;

public class CreateTransactionRequestValidator : AbstractValidator<CreateTransactionRequest>
{
    public CreateTransactionRequestValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than zero.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

        RuleFor(x => x.TransactionDate)
            .NotEmpty().WithMessage("Transaction date is required.");
    }
}
