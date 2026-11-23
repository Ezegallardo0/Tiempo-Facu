$ftpHost   = "185.27.134.11"
$ftpPort   = 21
$ftpUser   = "if0_43517694"
$ftpPass   = "Tiempofacu1906"
$localDist = "D:\Frontend\dist"
$remoteDir = "/htdocs"

function FtpRequest($uri, $method, $filePath = $null) {
    $req = [System.Net.FtpWebRequest]::Create($uri)
    $req.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $req.Method = $method
    $req.UseBinary = $true
    $req.UsePassive = $true
    $req.KeepAlive = $false
    $req.Timeout = 30000
    if ($filePath) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $req.ContentLength = $bytes.Length
        $stream = $req.GetRequestStream()
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Close()
    }
    try {
        $resp = $req.GetResponse()
        $resp.Close()
        return $true
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function EnsureDir($remotePath) {
    $uri = "ftp://${ftpHost}:${ftpPort}${remotePath}"
    $req = [System.Net.FtpWebRequest]::Create($uri)
    $req.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
    $req.UsePassive = $true
    $req.KeepAlive = $false
    $req.Timeout = 15000
    try {
        $resp = $req.GetResponse()
        $resp.Close()
        Write-Host "  Directorio creado: $remotePath" -ForegroundColor Cyan
    } catch {
        # 550 = ya existe, ignorar
        if ($_.Exception.Message -notmatch "550") {
            Write-Host "  Directorio ya existe (ok): $remotePath"
        }
    }
}

function UploadFile($localFile, $remotePath) {
    $uri = "ftp://${ftpHost}:${ftpPort}${remotePath}"
    $req = [System.Net.FtpWebRequest]::Create($uri)
    $req.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $req.UseBinary = $true
    $req.UsePassive = $true
    $req.KeepAlive = $false
    $req.Timeout = 120000
    $bytes = [System.IO.File]::ReadAllBytes($localFile)
    $req.ContentLength = $bytes.Length
    try {
        $stream = $req.GetRequestStream()
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Close()
        $resp = $req.GetResponse()
        $status = $resp.StatusDescription
        $resp.Close()
        $kb = [math]::Round($bytes.Length / 1024, 1)
        Write-Host "  OK ($kb KB): $remotePath" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  FALLO: $remotePath — $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# ---- INICIO ----
Write-Host "`n=== TiempoFacu FTP Deploy ===" -ForegroundColor Magenta
Write-Host "Host: $ftpHost | Usuario: $ftpUser" -ForegroundColor Gray

# 1. Test de conexión
Write-Host "`n[1/3] Prueba de conexion..." -ForegroundColor Yellow
$testUri = "ftp://${ftpHost}:${ftpPort}/"
$testReq = [System.Net.FtpWebRequest]::Create($testUri)
$testReq.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
$testReq.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
$testReq.UsePassive = $true
$testReq.Timeout = 20000
try {
    $testResp = $testReq.GetResponse()
    Write-Host "  Conexion exitosa! Servidor: $($testResp.StatusDescription.Trim())" -ForegroundColor Green
    $testResp.Close()
} catch {
    Write-Host "  ERROR de conexion: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Crear directorio /assets si no existe
Write-Host "`n[2/3] Creando estructura remota..." -ForegroundColor Yellow
EnsureDir "$remoteDir/assets"

# 3. Subir archivos
Write-Host "`n[3/3] Subiendo archivos..." -ForegroundColor Yellow
$files = @(
    @{ local = "$localDist\index.html";   remote = "$remoteDir/index.html" },
    @{ local = "$localDist\.htaccess";    remote = "$remoteDir/.htaccess" },
    @{ local = "$localDist\favicon.svg";  remote = "$remoteDir/favicon.svg" },
    @{ local = "$localDist\icons.svg";    remote = "$remoteDir/icons.svg" }
)

# Agregar assets dinámicamente
Get-ChildItem "$localDist\assets" -File | ForEach-Object {
    $files += @{ local = $_.FullName; remote = "$remoteDir/assets/$($_.Name)" }
}

$ok = 0; $fail = 0
foreach ($f in $files) {
    if (UploadFile $f.local $f.remote) { $ok++ } else { $fail++ }
}

Write-Host "`n=== Resultado ===" -ForegroundColor Magenta
Write-Host "Subidos: $ok  |  Fallidos: $fail" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Red" })
Write-Host "URL: http://tiempofacu.page.gd" -ForegroundColor Cyan
