from fastapi import APIRouter, HTTPException
from backend.database import get_db
from backend.models.schemas import (
    GenerateSqlRequest,
    GenerateSqlResponse,
    ExecuteSqlRequest,
    ExecuteSqlResponse,
)
from backend.services import postgres, llm, sql_validator

router = APIRouter(tags=["query"])


def _get_connection_string(connection_id: int) -> str:
    """Helper to get connection string by ID."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT connection_string FROM connections WHERE id = ?",
            (connection_id,)
        ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Connection not found")

    return row["connection_string"]


@router.post("/generate-sql", response_model=GenerateSqlResponse)
def generate_sql(request: GenerateSqlRequest):
    """Generate SQL from natural language query."""
    connection_string = _get_connection_string(request.connection_id)

    try:
        # Get database schema
        schema = postgres.get_schema(connection_string)

        if not schema:
            raise HTTPException(
                status_code=400,
                detail="No tables found in database. Cannot generate SQL."
            )

        # Generate SQL using LLM
        result = llm.generate_sql(schema, request.natural_language_query)
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate SQL: {str(e)}")


@router.post("/execute-sql", response_model=ExecuteSqlResponse)
def execute_sql(request: ExecuteSqlRequest):
    """Execute a SQL query."""
    connection_string = _get_connection_string(request.connection_id)

    # Validate SQL is SELECT only
    is_valid, error_message = sql_validator.validate_select_only(request.sql)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_message)

    try:
        result = postgres.execute_query(connection_string, request.sql)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query execution failed: {str(e)}")
