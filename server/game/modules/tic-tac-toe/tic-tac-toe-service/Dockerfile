FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Debug
WORKDIR /usr/src/app
COPY . .
RUN dotnet restore "./tic-tac-toe-service.csproj"
RUN dotnet build "./tic-tac-toe-service.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS final
WORKDIR /usr/src/app
EXPOSE 8080
CMD ["dotnet", "watch", "run", "--project", "tic-tac-toe-service.csproj", "--urls", "http://tic_tac_toe_service:8080"]
