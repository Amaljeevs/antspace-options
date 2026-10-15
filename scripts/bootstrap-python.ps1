$ErrorActionPreference = "Stop"

Set-Location (Join-Path $PSScriptRoot "..")

python -m venv .venv
. .\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r quant\market-data-service\requirements.txt
python -m pip install -r quant\strategy-engine\requirements.txt
python -m pip install -r quant\backtesting-engine\requirements.txt
python -m pip install -r quant\analytics-engine\requirements.txt

