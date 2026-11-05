
param(
    [string]$ProjectRoot = "E:\CSE499B_FRONTEND",
    [string]$ArchivePath = "E:\VRU_videos.zip"
)

$ErrorActionPreference = "Stop"

$datasetUrl = "https://huggingface.co/datasets/kyh9191/VRU-Accident/resolve/main/VRU_videos.zip?download=true"

# SHA-256 published on the official Hugging Face file page.
$expectedHash = "469dbcef0d3aec281092f21106f2204848fd6e1ac29f5abe6c65671b478593e3"

$mediaFolder = Join-Path $ProjectRoot "public\media"
$finalVideo = Join-Path $mediaFolder "vru-accident-showcase.mp4"
$tempVideo = Join-Path $mediaFolder "vru-original-extracted.mp4"

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
    throw "Frontend project folder does not exist: $ProjectRoot"
}

if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot "package.json"))) {
    throw "package.json missing. Wrong project directory."
}

New-Item -ItemType Directory -Force -Path $mediaFolder |
    Out-Null

Write-Host ""
Write-Host "VRU-Accident official dataset verification"
Write-Host "Project: $ProjectRoot"
Write-Host "Archive: $ArchivePath"
Write-Host ""

if (-not (Test-Path -LiteralPath $ArchivePath)) {
    Write-Host "The official 3.06 GB archive is not available locally."
    Write-Host "Downloading it from Hugging Face."

    $partialArchive = "$ArchivePath.partial"

    if (Test-Path -LiteralPath $partialArchive) {
        throw "A partial download already exists at $partialArchive. Inspect it before retrying."
    }

    & curl.exe `
        --fail `
        --location `
        --retry 2 `
        --output $partialArchive `
        $datasetUrl

    if ($LASTEXITCODE -ne 0) {
        throw "Hugging Face download failed. No background video installed."
    }

    Move-Item -LiteralPath $partialArchive -Destination $ArchivePath
}

Write-Host "Checking official archive SHA-256..."

$actualHash = (
    Get-FileHash -LiteralPath $ArchivePath -Algorithm SHA256
).Hash.ToLowerInvariant()

if ($actualHash -ne $expectedHash) {
    throw "Archive SHA-256 mismatch. Stopping: the file cannot be verified as the official VRU-Accident archive."
}

Write-Host "Official VRU-Accident archive verified."

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::OpenRead($ArchivePath)

try {
    $entry = $zip.Entries |
        Where-Object {
            ($_.FullName -replace "\\", "/") -match "(^|/)DoTA/VRU_1\.mp4$"
        } |
        Select-Object -First 1

    if ($null -eq $entry) {
        throw "DoTA/VRU_1.mp4 not found inside official archive. No video was substituted."
    }

    Write-Host "Found verified dataset member:"
    Write-Host $entry.FullName

    $sourceStream = $entry.Open()

    try {
        $destinationStream =
            [System.IO.File]::Create($tempVideo)

        try {
            $sourceStream.CopyTo($destinationStream)
        }
        finally {
            $destinationStream.Dispose()
        }
    }
    finally {
        $sourceStream.Dispose()
    }
}
finally {
    $zip.Dispose()
}

if (-not (Test-Path -LiteralPath $tempVideo)) {
    throw "Video extraction failed."
}

if ((Get-Item -LiteralPath $tempVideo).Length -eq 0) {
    throw "The extracted video is empty."
}

$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue

if ($null -ne $ffmpeg) {
    Write-Host "FFmpeg found. Creating a lightweight background clip."

    & ffmpeg `
        -y `
        -i $tempVideo `
        -t 8 `
        -vf "fps=24,scale=-2:720" `
        -c:v libx264 `
        -preset veryfast `
        -crf 29 `
        -pix_fmt yuv420p `
        -an `
        -movflags +faststart `
        $finalVideo

    if ($LASTEXITCODE -ne 0) {
        throw "FFmpeg conversion failed. Extracted source video preserved."
    }
}
else {
    Write-Host "FFmpeg is not installed."
    Write-Host "Keeping the original MP4 without re-encoding."

    Copy-Item `
        -LiteralPath $tempVideo `
        -Destination $finalVideo `
        -Force
}

if (
    -not (Test-Path -LiteralPath $finalVideo) -or
    (Get-Item -LiteralPath $finalVideo).Length -eq 0
) {
    throw "Final video output missing or empty."
}

Write-Host ""
Write-Host "SUCCESS — verified dataset video installed:"
Write-Host $finalVideo
Write-Host ""
Write-Host "The original source is also preserved at:"
Write-Host $tempVideo
Write-Host ""

Write-Host 'Restart or refresh Vite and check playback in Chrome or Edge.'

