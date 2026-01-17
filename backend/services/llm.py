import json
from openai import OpenAI
from backend.config import OPENAI_API_KEY, OPENAI_MODEL, OPENAI_BASE_URL
from backend.models.schemas import TableSchema, GenerateSqlResponse


def _build_schema_context(schema: list[TableSchema]) -> str:
    """Build schema context string for LLM prompt."""
    lines = ["Database Schema:"]
    for table in schema:
        lines.append(f"\nTable: {table.table_name}")
        lines.append("Columns:")
        for col in table.columns:
            nullable = "NULL" if col.is_nullable else "NOT NULL"
            lines.append(f"  - {col.column_name} ({col.data_type}, {nullable})")
    return "\n".join(lines)


def generate_sql(schema: list[TableSchema], natural_language: str) -> GenerateSqlResponse:
    """
    Generate SQL from natural language using LLM.

    Args:
        schema: Database schema information
        natural_language: User's natural language query

    Returns:
        GenerateSqlResponse: Generated SQL and explanation
    """
    schema_context = _build_schema_context(schema)

    system_prompt = """You are a SQL expert. Generate PostgreSQL SELECT queries based on user requests.

Rules:
1. ONLY generate SELECT queries - never INSERT, UPDATE, DELETE, DROP, or any other modifying statements
2. Use the provided database schema to write accurate queries
3. Return your response as JSON with two fields:
   - "sql": the SQL query
   - "explanation": brief explanation of what the query does

Always respond with valid JSON only, no markdown or other formatting."""

    user_prompt = f"""{schema_context}

User Request: {natural_language}

Generate a SELECT query to fulfill this request. Return JSON with "sql" and "explanation" fields."""

    client = OpenAI(
        api_key=OPENAI_API_KEY,
        base_url=OPENAI_BASE_URL
    )

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0
    )

    content = response.choices[0].message.content.strip()

    # Parse JSON response
    try:
        # Handle potential markdown code blocks
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()

        result = json.loads(content)
        return GenerateSqlResponse(
            sql=result.get("sql", ""),
            explanation=result.get("explanation", "")
        )
    except json.JSONDecodeError:
        # Fallback: treat entire response as SQL
        return GenerateSqlResponse(
            sql=content,
            explanation="Generated SQL query"
        )
