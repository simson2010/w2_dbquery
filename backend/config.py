import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# SQLite database path
SQLITE_DB_PATH = os.getenv("SQLITE_DB_PATH", str(BASE_DIR / "data" / "connections.db"))

# LLM Configuration
print(f"OPENAI_API_KEY: {os.getenv('LLM_API_KEY')}")
OPENAI_API_KEY = os.getenv("LLM_API_KEY", "")
OPENAI_MODEL = os.getenv("LLM_MODEL", "gpt-5-mini")
OPENAI_BASE_URL = os.getenv("LLM_BASE_URL", None)

print(f"OPENAI_API_KEY: {OPENAI_API_KEY}")
print(f"OPENAI_MODEL: {OPENAI_MODEL}")
print(f"OPENAI_BASE_URL: {OPENAI_BASE_URL}")

# Query limits
MAX_QUERY_ROWS = int(os.getenv("MAX_QUERY_ROWS", "1000"))

# CORS origins
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
