# Script PowerShell pour créer l'arborescence Mazzaro HR
# Ce script crée tous les dossiers et fichiers nécessaires pour le système Mazzaro HR

# Définir le répertoire racine
$rootDir = "mazzaro-hr-system"

# Créer le répertoire racine s'il n'existe pas
if (-not (Test-Path $rootDir)) {
    New-Item -ItemType Directory -Path $rootDir | Out-Null
    Write-Host "Répertoire racine créé: $rootDir" -ForegroundColor Green
}

# Fonction pour créer un fichier
function Create-File {
    param (
        [string]$path
    )
    
    # Vérifier si le dossier parent existe, sinon le créer
    $parent = Split-Path -Path $path -Parent
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
        Write-Host "Répertoire créé: $parent" -ForegroundColor Cyan
    }
    
    # Créer le fichier s'il n'existe pas
    if (-not (Test-Path $path)) {
        New-Item -ItemType File -Path $path | Out-Null
        Write-Host "Fichier créé: $path" -ForegroundColor Yellow
    }
}

# Création de l'arborescence assets
Write-Host "Création de la structure assets..." -ForegroundColor Magenta

# CSS files
$cssFiles = @(
    "$rootDir/assets/css/main.css",
    "$rootDir/assets/css/login.css",
    "$rootDir/assets/css/dashboard.css",
    "$rootDir/assets/css/components.css"
)

foreach ($file in $cssFiles) {
    Create-File -path $file
}

# JS files
$jsFiles = @(
    "$rootDir/assets/js/main.js",
    "$rootDir/assets/js/auth.js",
    "$rootDir/assets/js/dashboard.js",
    "$rootDir/assets/js/tickets.js",
    "$rootDir/assets/js/attendance.js",
    "$rootDir/assets/js/leave.js",
    "$rootDir/assets/js/calendar.js",
    "$rootDir/assets/js/employees.js",
    "$rootDir/assets/js/charts.js"
)

foreach ($file in $jsFiles) {
    Create-File -path $file
}

# Image directories
$imgDirs = @(
    "$rootDir/assets/img",
    "$rootDir/assets/img/icons",
    "$rootDir/assets/img/backgrounds",
    "$rootDir/assets/img/avatars"
)

foreach ($dir in $imgDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Répertoire créé: $dir" -ForegroundColor Cyan
    }
}

# Logo file
Create-File -path "$rootDir/assets/img/logo.png"

# Fonts directory
if (-not (Test-Path "$rootDir/assets/fonts")) {
    New-Item -ItemType Directory -Path "$rootDir/assets/fonts" -Force | Out-Null
    Write-Host "Répertoire créé: $rootDir/assets/fonts" -ForegroundColor Cyan
}

# Création des fichiers d'authentification
Write-Host "Création des fichiers d'authentification..." -ForegroundColor Magenta

$authFiles = @(
    "$rootDir/auth/login.html",
    "$rootDir/auth/forgot-password.html",
    "$rootDir/auth/reset-password.html"
)

foreach ($file in $authFiles) {
    Create-File -path $file
}

# Création des fichiers admin
Write-Host "Création des fichiers admin..." -ForegroundColor Magenta

$adminFiles = @(
    "$rootDir/admin/index.html",
    "$rootDir/admin/employees.html",
    "$rootDir/admin/tickets.html",
    "$rootDir/admin/attendance.html",
    "$rootDir/admin/leave.html",
    "$rootDir/admin/calendar.html",
    "$rootDir/admin/statistics.html",
    "$rootDir/admin/settings.html",
    "$rootDir/admin/evaluations.html"
)

foreach ($file in $adminFiles) {
    Create-File -path $file
}

# Création des fichiers sector
Write-Host "Création des fichiers sector..." -ForegroundColor Magenta

$sectorFiles = @(
    "$rootDir/sector/index.html",
    "$rootDir/sector/employees.html",
    "$rootDir/sector/tickets.html",
    "$rootDir/sector/attendance.html",
    "$rootDir/sector/leave.html",
    "$rootDir/sector/calendar.html",
    "$rootDir/sector/statistics.html"
)

foreach ($file in $sectorFiles) {
    Create-File -path $file
}

# Création des fichiers store
Write-Host "Création des fichiers store..." -ForegroundColor Magenta

$storeFiles = @(
    "$rootDir/store/index.html",
    "$rootDir/store/employees.html",
    "$rootDir/store/tickets.html",
    "$rootDir/store/attendance.html",
    "$rootDir/store/leave.html",
    "$rootDir/store/calendar.html"
)

foreach ($file in $storeFiles) {
    Create-File -path $file
}

# Création des fichiers employee
Write-Host "Création des fichiers employee..." -ForegroundColor Magenta

$employeeFiles = @(
    "$rootDir/employee/index.html",
    "$rootDir/employee/profile.html",
    "$rootDir/employee/tickets.html",
    "$rootDir/employee/attendance.html",
    "$rootDir/employee/leave.html",
    "$rootDir/employee/calendar.html"
)

foreach ($file in $employeeFiles) {
    Create-File -path $file
}

# Création des composants
Write-Host "Création des composants..." -ForegroundColor Magenta

$componentFiles = @(
    "$rootDir/components/sidebar.html",
    "$rootDir/components/header.html",
    "$rootDir/components/footer.html",
    "$rootDir/components/ticket-card.html",
    "$rootDir/components/employee-card.html",
    "$rootDir/components/modals.html"
)

foreach ($file in $componentFiles) {
    Create-File -path $file
}

# Création du fichier index principal
Create-File -path "$rootDir/index.html"

Write-Host "Création de l'arborescence terminée avec succès!" -ForegroundColor Green
Write-Host "L'arborescence Mazzaro HR a été créée dans le dossier: $rootDir" -ForegroundColor Green