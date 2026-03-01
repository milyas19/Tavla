# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files first for better layer caching
COPY HomeCalendar.sln ./
COPY API/API.csproj API/
COPY Application/Application.csproj Application/
COPY Entities/Entities.csproj Entities/
COPY Persistence/Persistence.csproj Persistence/

# Restore dependencies
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish API/API.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Railway sets the PORT environment variable
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080}

ENTRYPOINT ["dotnet", "API.dll"]
