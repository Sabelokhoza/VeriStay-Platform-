# Use the official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /src

# Copy solution and project files
COPY ko.backend.sln ./
COPY ko.api/*.csproj ./ko.api/
COPY ko.core/*.csproj ./ko.core/
COPY ko.entity_framework/*.csproj ./ko.entity_framework/

# Restore dependencies
RUN dotnet restore ko.backend.sln

# Copy the remaining source code
COPY ko.api/ ./ko.api/
COPY ko.core/ ./ko.core/
COPY ko.entity_framework/ ./ko.entity_framework/

# Publish the API project
RUN dotnet publish ./ko.api/ko.api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

COPY --from=build-env /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ko.api.dll"]