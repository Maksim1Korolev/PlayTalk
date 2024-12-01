# Base Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS base
WORKDIR /usr/src/app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Development Stage
FROM base AS development
ARG BUILD_CONFIGURATION=Debug
COPY . ./
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:8080"]

# Build Stage
FROM base AS build
ARG BUILD_CONFIGURATION=Release
COPY . ./
RUN dotnet publish -c $BUILD_CONFIGURATION -o out

# Production Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/out ./
EXPOSE 8080
ENTRYPOINT ["dotnet", "tic-tac-toe-service.dll", "--urls", "http://0.0.0.0:8080"]
