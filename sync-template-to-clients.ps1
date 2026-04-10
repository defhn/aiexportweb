# ============================================================
# sync-template-to-clients.ps1
# 把主站模板的最新改动同步到所有客户仓库
# 使用方法：在 PowerShell 里运行此脚本
# ============================================================

# 主站模板的本地路径（你的母版）
$TEMPLATE_PATH = "C:\Users\Administrator\Documents\GitHub\aiexportweb\.worktrees\export-growth-v1"

# 所有客户仓库的根目录（12 个文件夹所在位置）
$CLIENT_ROOT = "C:\Users\Administrator\Documents\GitHub\aiexportweb"

# 所有客户仓库文件夹名
$CLIENT_REPOS = @(
  "b2b-cnc-precision-machining",
  "b2b-plastics-molding",
  "b2b-machinery-production-lines",
  "b2b-chemicals-raw-materials",
  "b2b-building-materials-hardware",
  "b2b-renewable-energy-power",
  "b2b-electronics-components-pcb",
  "b2b-auto-parts-aftermarket",
  "b2b-smart-hardware-iot",
  "b2b-fmcg-beauty-pet",
  "b2b-apparel-textiles-footwear",
  "b2b-furniture-commercial-fixtures"
)

# 你要同步的具体文件/文件夹（只同步框架代码，不覆盖客户定制）
$FILES_TO_SYNC = @(
  "src\lib",
  "src\db\schema.ts",
  "src\db\patch.ts",
  "src\features\admin-users",
  "src\app\api\admin\staff",
  "src\app\api\auth",
  "src\proxy.ts",
  "src\env.ts",
  "Dockerfile",
  ".dockerignore",
  "next.config.ts"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  模板同步工具 - 开始运行" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$successCount = 0
$failCount = 0

foreach ($repo in $CLIENT_REPOS) {
  $repoPath = Join-Path $CLIENT_ROOT $repo
  
  # 跳过空文件夹（还没 clone 的）
  if (-not (Test-Path (Join-Path $repoPath ".git"))) {
    Write-Host "⏭️  跳过 $repo（尚未初始化 Git 仓库）" -ForegroundColor Yellow
    continue
  }
  
  Write-Host "🔄 正在同步: $repo" -ForegroundColor Blue
  
  try {
    foreach ($file in $FILES_TO_SYNC) {
      $src = Join-Path $TEMPLATE_PATH $file
      $dst = Join-Path $repoPath $file
      
      if (Test-Path $src) {
        # 确保目标目录存在
        $dstDir = Split-Path $dst -Parent
        if (-not (Test-Path $dstDir)) {
          New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
        }
        Copy-Item -Path $src -Destination $dst -Recurse -Force
      }
    }
    
    # 自动提交
    Push-Location $repoPath
    git add -A 2>$null
    $status = git status --porcelain 2>$null
    if ($status) {
      git commit -m "chore: sync framework updates from master template" 2>$null
      git push 2>$null
      Write-Host "  ✅ 已同步并推送" -ForegroundColor Green
    } else {
      Write-Host "  ✓  无变更，跳过提交" -ForegroundColor Gray
    }
    Pop-Location
    $successCount++
  }
  catch {
    Write-Host "  ❌ 同步失败: $_" -ForegroundColor Red
    $failCount++
    Pop-Location -ErrorAction SilentlyContinue
  }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  同步完成：成功 $successCount 个，失败 $failCount 个" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
