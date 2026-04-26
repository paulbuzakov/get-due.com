using AutoMapper;
using GetDue.Application.DTOs.Calendar;
using GetDue.Application.DTOs.CashAccounts;
using GetDue.Application.DTOs.Dividends;
using GetDue.Application.DTOs.Loans;
using GetDue.Application.DTOs.Properties;
using GetDue.Application.DTOs.RecurringPayments;
using GetDue.Application.DTOs.Stocks;
using GetDue.Application.DTOs.Transactions;
using GetDue.Application.DTOs.Users;
using GetDue.Domain.Entities;

namespace GetDue.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();

        CreateMap<Stock, StockDto>();
        CreateMap<CreateStockRequest, Stock>();
        CreateMap<UpdateStockRequest, Stock>();

        CreateMap<Dividend, DividendDto>();
        CreateMap<CreateDividendRequest, Dividend>();

        CreateMap<Property, PropertyDto>();
        CreateMap<CreatePropertyRequest, Property>();
        CreateMap<UpdatePropertyRequest, Property>();

        CreateMap<PropertyValuation, PropertyValuationDto>();

        CreateMap<CashAccount, CashAccountDto>();
        CreateMap<CreateCashAccountRequest, CashAccount>();
        CreateMap<UpdateCashAccountRequest, CashAccount>();

        CreateMap<Transaction, TransactionDto>();
        CreateMap<CreateTransactionRequest, Transaction>();
        CreateMap<UpdateTransactionRequest, Transaction>();

        CreateMap<Loan, LoanDto>();
        CreateMap<CreateLoanRequest, Loan>();
        CreateMap<UpdateLoanRequest, Loan>();

        CreateMap<LoanPayment, LoanPaymentDto>();

        CreateMap<RecurringPayment, RecurringPaymentDto>();
        CreateMap<CreateRecurringPaymentRequest, RecurringPayment>();

        CreateMap<CalendarEvent, CalendarEventDto>();
        CreateMap<CreateCalendarEventRequest, CalendarEvent>();
    }
}
