$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $projectRoot "manifest.json"
$manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
$outputDirectory = Join-Path $projectRoot "dist"

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
& node (Join-Path $PSScriptRoot "build-extension.mjs") all
if ($LASTEXITCODE -ne 0) {
  throw "Multi-browser build failed with exit code $LASTEXITCODE"
}

foreach ($target in @("chromium", "edge", "firefox", "safari")) {
  $suffix = if ($target -eq "safari") { "safari-source" } else { $target }
  $archivePath = Join-Path $outputDirectory ("prepisi-{0}-{1}.zip" -f $manifest.version, $suffix)
  if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -Force -LiteralPath $archivePath
  }
  $targetDirectory = Join-Path (Join-Path $projectRoot "build") $target
  Compress-Archive -Path (Join-Path $targetDirectory "*") -DestinationPath $archivePath -CompressionLevel Optimal
  Write-Output $archivePath
}
