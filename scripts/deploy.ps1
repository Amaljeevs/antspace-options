$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}

Write-Host "Building Spring Boot services..."
.\gradlew.bat :backend:auth-server:bootJar :backend:api-gateway:bootJar :backend:order-engine:bootJar :backend:portfolio-service:bootJar :backend:broker-service:bootJar

Write-Host "Starting Docker Compose stack..."
Set-Location (Join-Path $root "infrastructure\\docker")
docker compose --env-file ..\\..\\.env up --build -d
docker compose ps
