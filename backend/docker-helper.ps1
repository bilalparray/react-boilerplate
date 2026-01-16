# Alpine Ecommerce Backend - Docker Helper Script (PowerShell)
# Usage: .\docker-helper.ps1 [command]

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [string]$Service = "api",
    
    [Parameter(Position=2)]
    [string]$Cmd = "sh"
)

# Functions
function Print-Header {
    param([string]$Message)
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Print-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Print-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Print-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check if .env file exists
function Test-EnvFile {
    if (-not (Test-Path .env)) {
        Print-Warning ".env file not found!"
        Print-Info "Please create .env file with required environment variables"
        Print-Info "See ENV_VARIABLES.md for reference"
        exit 1
    }
}

# Build production image
function Build-Prod {
    Print-Header "Building Production Docker Image"
    docker build -t alpine-backend:latest .
    Print-Success "Production image built successfully"
}

# Build development image
function Build-Dev {
    Print-Header "Building Development Docker Image"
    docker build -f Dockerfile.dev -t alpine-backend:dev .
    Print-Success "Development image built successfully"
}

# Start production
function Start-Prod {
    Print-Header "Starting Production Environment"
    Test-EnvFile
    docker-compose up -d
    Print-Success "Production environment started"
    Print-Info "API available at: http://localhost:8081/api/v1/docs"
    Print-Info "View logs: docker-compose logs -f api"
}

# Start development
function Start-Dev {
    Print-Header "Starting Development Environment"
    Test-EnvFile
    docker-compose -f docker-compose.dev.yml up
}

# Stop services
function Stop-Services {
    Print-Header "Stopping Services"
    docker-compose down
    Print-Success "Services stopped"
}

# View logs
function Show-Logs {
    param([string]$Svc = "api")
    Print-Header "Viewing Logs for $Svc"
    docker-compose logs -f $Svc
}

# Restart service
function Restart-Service {
    param([string]$Svc = "api")
    Print-Header "Restarting $Svc"
    docker-compose restart $Svc
    Print-Success "$Svc restarted"
}

# Rebuild and restart
function Rebuild-Services {
    Print-Header "Rebuilding and Restarting"
    Test-EnvFile
    docker-compose up -d --build
    Print-Success "Services rebuilt and restarted"
}

# Execute command in container
function Exec-Command {
    param([string]$Svc = "api", [string]$Command = "sh")
    Print-Header "Executing command in $Svc"
    docker-compose exec $Svc $Command
}

# Show status
function Show-Status {
    Print-Header "Container Status"
    docker-compose ps
}

# Clean up
function Clean-Up {
    Print-Header "Cleaning Up"
    Print-Warning "This will remove containers, networks, and volumes"
    $confirm = Read-Host "Are you sure? (y/N)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        docker-compose down -v
        Print-Success "Cleanup completed"
    } else {
        Print-Info "Cleanup cancelled"
    }
}

# Backup
function Create-Backup {
    Print-Header "Creating Backup"
    $backupDir = "./backups/$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    
    # Backup database
    Print-Info "Backing up database..."
    try {
        docker-compose exec -T postgres pg_dump -U postgres alpine_ecommerce | Out-File -FilePath "$backupDir/database.sql" -Encoding utf8
    } catch {
        Print-Warning "Database backup skipped (postgres not running)"
    }
    
    # Backup uploads
    Print-Info "Backing up uploads..."
    if (Test-Path "./alpine-uploads") {
        Copy-Item -Path "./alpine-uploads" -Destination "$backupDir/uploads" -Recurse -ErrorAction SilentlyContinue
    }
    
    # Backup env
    if (Test-Path .env) {
        Copy-Item .env "$backupDir/.env"
    }
    
    Print-Success "Backup created: $backupDir"
}

# Show help
function Show-Help {
    Write-Host "Alpine Ecommerce Backend - Docker Helper" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\docker-helper.ps1 [command] [options]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  build-prod      Build production Docker image"
    Write-Host "  build-dev       Build development Docker image"
    Write-Host "  start-prod      Start production environment"
    Write-Host "  start-dev       Start development environment"
    Write-Host "  stop            Stop all services"
    Write-Host "  logs [service]  View logs (default: api)"
    Write-Host "  restart [svc]   Restart service (default: api)"
    Write-Host "  rebuild         Rebuild and restart services"
    Write-Host "  exec [svc] [cmd] Execute command in container"
    Write-Host "  status          Show container status"
    Write-Host "  clean           Remove containers and volumes"
    Write-Host "  backup          Create backup"
    Write-Host "  help            Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\docker-helper.ps1 start-prod"
    Write-Host "  .\docker-helper.ps1 logs postgres"
    Write-Host "  .\docker-helper.ps1 exec api sh"
    Write-Host "  .\docker-helper.ps1 backup"
}

# Main
switch ($Command.ToLower()) {
    "build-prod" { Build-Prod }
    "build-dev" { Build-Dev }
    "start-prod" { Start-Prod }
    "start-dev" { Start-Dev }
    "stop" { Stop-Services }
    "logs" { Show-Logs -Svc $Service }
    "restart" { Restart-Service -Svc $Service }
    "rebuild" { Rebuild-Services }
    "exec" { Exec-Command -Svc $Service -Command $Cmd }
    "status" { Show-Status }
    "clean" { Clean-Up }
    "backup" { Create-Backup }
    "help" { Show-Help }
    default {
        Print-Error "Unknown command: $Command"
        Write-Host ""
        Show-Help
        exit 1
    }
}

