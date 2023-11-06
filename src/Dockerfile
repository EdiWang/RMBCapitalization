FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY RMBCap.csproj .
RUN dotnet restore RMBCap.csproj
COPY . .
RUN dotnet build RMBCap.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish RMBCap.csproj -c Release -o /app/publish

FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html
COPY --from=publish /app/publish/wwwroot .
COPY nginx.conf /etc/nginx/nginx.conf