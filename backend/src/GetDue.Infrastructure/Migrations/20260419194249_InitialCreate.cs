using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GetDue.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(
                        type: "character varying(256)",
                        maxLength: 256,
                        nullable: false
                    ),
                    PasswordHash = table.Column<string>(
                        type: "character varying(512)",
                        maxLength: 512,
                        nullable: false
                    ),
                    FirstName = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false
                    ),
                    LastName = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false
                    ),
                    DefaultCurrency = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    RefreshToken = table.Column<string>(
                        type: "character varying(512)",
                        maxLength: 512,
                        nullable: true
                    ),
                    RefreshTokenExpiryTime = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                }
            );

            migrationBuilder.CreateTable(
                name: "calendar_events",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(
                        type: "character varying(200)",
                        maxLength: 200,
                        nullable: false
                    ),
                    Description = table.Column<string>(
                        type: "character varying(2000)",
                        maxLength: 2000,
                        nullable: true
                    ),
                    EventDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    EventType = table.Column<string>(
                        type: "character varying(30)",
                        maxLength: 30,
                        nullable: false
                    ),
                    RelatedEntityId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_calendar_events", x => x.Id);
                    table.ForeignKey(
                        name: "FK_calendar_events_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "cash_accounts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(
                        type: "character varying(200)",
                        maxLength: 200,
                        nullable: false
                    ),
                    Institution = table.Column<string>(
                        type: "character varying(200)",
                        maxLength: 200,
                        nullable: false
                    ),
                    Balance = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    Currency = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    AccountNumber = table.Column<string>(
                        type: "character varying(50)",
                        maxLength: 50,
                        nullable: true
                    ),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cash_accounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_cash_accounts_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "loans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(
                        type: "character varying(200)",
                        maxLength: 200,
                        nullable: false
                    ),
                    LoanType = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    Principal = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    InterestRate = table.Column<decimal>(
                        type: "numeric(8,4)",
                        precision: 8,
                        scale: 4,
                        nullable: false
                    ),
                    MonthlyPayment = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    RemainingBalance = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    StartDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    EndDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    Currency = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    Notes = table.Column<string>(
                        type: "character varying(2000)",
                        maxLength: 2000,
                        nullable: true
                    ),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_loans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_loans_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "properties",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(
                        type: "character varying(200)",
                        maxLength: 200,
                        nullable: false
                    ),
                    Address = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: false
                    ),
                    PurchasePrice = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    CurrentValue = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    PurchaseDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    Currency = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    Notes = table.Column<string>(
                        type: "character varying(2000)",
                        maxLength: 2000,
                        nullable: true
                    ),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_properties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_properties_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "recurring_payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(
                        type: "character varying(200)",
                        maxLength: 200,
                        nullable: false
                    ),
                    Amount = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    Frequency = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    Category = table.Column<string>(
                        type: "character varying(30)",
                        maxLength: 30,
                        nullable: false
                    ),
                    NextPaymentDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    Currency = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Notes = table.Column<string>(
                        type: "character varying(2000)",
                        maxLength: 2000,
                        nullable: true
                    ),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_recurring_payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_recurring_payments_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "stocks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Ticker = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    CompanyName = table.Column<string>(
                        type: "character varying(200)",
                        maxLength: 200,
                        nullable: false
                    ),
                    Quantity = table.Column<decimal>(
                        type: "numeric(18,4)",
                        precision: 18,
                        scale: 4,
                        nullable: false
                    ),
                    BuyPrice = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    CurrentPrice = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    Currency = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    Notes = table.Column<string>(
                        type: "character varying(2000)",
                        maxLength: 2000,
                        nullable: true
                    ),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_stocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_stocks_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "transactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CashAccountId = table.Column<Guid>(type: "uuid", nullable: true),
                    Amount = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    Type = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    Category = table.Column<string>(
                        type: "character varying(30)",
                        maxLength: 30,
                        nullable: false
                    ),
                    Description = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: true
                    ),
                    TransactionDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    Currency = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_transactions_cash_accounts_CashAccountId",
                        column: x => x.CashAccountId,
                        principalTable: "cash_accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "FK_transactions_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "loan_payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LoanId = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    PrincipalPortion = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    InterestPortion = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    PaymentDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_loan_payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_loan_payments_loans_LoanId",
                        column: x => x.LoanId,
                        principalTable: "loans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "property_valuations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PropertyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    ValuationDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    Source = table.Column<string>(
                        type: "character varying(200)",
                        maxLength: 200,
                        nullable: true
                    ),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_property_valuations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_property_valuations_properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "dividends",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StockId = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    PaymentDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    Frequency = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    CreatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dividends", x => x.Id);
                    table.ForeignKey(
                        name: "FK_dividends_stocks_StockId",
                        column: x => x.StockId,
                        principalTable: "stocks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_calendar_events_RelatedEntityId",
                table: "calendar_events",
                column: "RelatedEntityId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_calendar_events_UserId",
                table: "calendar_events",
                column: "UserId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_calendar_events_UserId_EventDate",
                table: "calendar_events",
                columns: new[] { "UserId", "EventDate" }
            );

            migrationBuilder.CreateIndex(
                name: "IX_cash_accounts_UserId",
                table: "cash_accounts",
                column: "UserId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_dividends_StockId",
                table: "dividends",
                column: "StockId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_loan_payments_LoanId",
                table: "loan_payments",
                column: "LoanId"
            );

            migrationBuilder.CreateIndex(name: "IX_loans_UserId", table: "loans", column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_properties_UserId",
                table: "properties",
                column: "UserId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_property_valuations_PropertyId",
                table: "property_valuations",
                column: "PropertyId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_recurring_payments_IsActive_NextPaymentDate",
                table: "recurring_payments",
                columns: new[] { "IsActive", "NextPaymentDate" }
            );

            migrationBuilder.CreateIndex(
                name: "IX_recurring_payments_UserId",
                table: "recurring_payments",
                column: "UserId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_stocks_UserId_Ticker",
                table: "stocks",
                columns: new[] { "UserId", "Ticker" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_transactions_CashAccountId",
                table: "transactions",
                column: "CashAccountId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_transactions_UserId_TransactionDate",
                table: "transactions",
                columns: new[] { "UserId", "TransactionDate" }
            );

            migrationBuilder.CreateIndex(
                name: "IX_transactions_UserId_Type_TransactionDate",
                table: "transactions",
                columns: new[] { "UserId", "Type", "TransactionDate" }
            );

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "calendar_events");

            migrationBuilder.DropTable(name: "dividends");

            migrationBuilder.DropTable(name: "loan_payments");

            migrationBuilder.DropTable(name: "property_valuations");

            migrationBuilder.DropTable(name: "recurring_payments");

            migrationBuilder.DropTable(name: "transactions");

            migrationBuilder.DropTable(name: "stocks");

            migrationBuilder.DropTable(name: "loans");

            migrationBuilder.DropTable(name: "properties");

            migrationBuilder.DropTable(name: "cash_accounts");

            migrationBuilder.DropTable(name: "users");
        }
    }
}
