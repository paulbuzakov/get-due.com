# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy NuGet config first
COPY nuget.config ./

# Copy solution and project files for layer caching
COPY GetDue.slnx ./
COPY src/GetDue.API/GetDue.API.csproj src/GetDue.API/
COPY src/GetDue.Application/GetDue.Application.csproj src/GetDue.Application/
COPY src/GetDue.Domain/GetDue.Domain.csproj src/GetDue.Domain/
COPY src/GetDue.Infrastructure/GetDue.Infrastructure.csproj src/GetDue.Infrastructure/

# Restore dependencies
RUN dotnet restore GetDue.slnx

# Copy all source code
COPY . .

# Stage 2: Publish (separate from build so dev targets can reuse the restored build stage)
FROM build AS publish
RUN dotnet publish src/GetDue.API/GetDue.API.csproj \
    -c Release \
    -o /app/publish

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "GetDue.API.dll"]
