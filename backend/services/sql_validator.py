import re

# Forbidden SQL keywords for write operations
FORBIDDEN_KEYWORDS = [
    r'\bINSERT\b',
    r'\bUPDATE\b',
    r'\bDELETE\b',
    r'\bDROP\b',
    r'\bALTER\b',
    r'\bCREATE\b',
    r'\bTRUNCATE\b',
    r'\bGRANT\b',
    r'\bREVOKE\b',
    r'\bEXEC\b',
    r'\bEXECUTE\b',
]


def validate_select_only(sql: str) -> tuple[bool, str]:
    """
    Validate that SQL is a read-only SELECT statement.

    Returns:
        tuple[bool, str]: (is_valid, error_message)
    """
    if not sql or not sql.strip():
        return False, "SQL statement is empty"

    normalized = sql.strip().upper()

    # Check for multiple statements (semicolon separated)
    statements = [s.strip() for s in sql.split(';') if s.strip()]
    if len(statements) > 1:
        return False, "Multiple SQL statements are not allowed"

    # Check if starts with SELECT or WITH (for CTEs)
    if not (normalized.startswith('SELECT') or normalized.startswith('WITH')):
        return False, "Only SELECT queries are allowed"

    # Check for forbidden keywords
    for keyword in FORBIDDEN_KEYWORDS:
        if re.search(keyword, normalized):
            return False, f"Forbidden operation detected: {keyword.strip(chr(92)).replace('b', '')}"

    return True, ""
