import psycopg2
from psycopg2.extras import RealDictCursor
from backend.config import MAX_QUERY_ROWS
from backend.models.schemas import TableSchema, ColumnSchema, ExecuteSqlResponse


def test_connection(connection_string: str) -> tuple[bool, str]:
    """
    Test if PostgreSQL connection is valid.

    Returns:
        tuple[bool, str]: (success, message)
    """
    try:
        conn = psycopg2.connect(connection_string)
        conn.close()
        return True, "Connection successful"
    except psycopg2.Error as e:
        return False, str(e)


def get_schema(connection_string: str) -> list[TableSchema]:
    """
    Get database schema (tables and columns) from PostgreSQL.

    Returns:
        list[TableSchema]: List of tables with their columns
    """
    query = """
        SELECT
            t.table_name,
            c.column_name,
            c.data_type,
            c.is_nullable
        FROM information_schema.tables t
        JOIN information_schema.columns c
            ON t.table_name = c.table_name
            AND t.table_schema = c.table_schema
        WHERE t.table_schema = 'public'
            AND t.table_type = 'BASE TABLE'
        ORDER BY t.table_name, c.ordinal_position
    """

    conn = psycopg2.connect(connection_string)
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query)
            rows = cur.fetchall()

        # Group columns by table
        tables_dict: dict[str, list[ColumnSchema]] = {}
        for row in rows:
            table_name = row['table_name']
            if table_name not in tables_dict:
                tables_dict[table_name] = []
            tables_dict[table_name].append(ColumnSchema(
                column_name=row['column_name'],
                data_type=row['data_type'],
                is_nullable=row['is_nullable'] == 'YES'
            ))

        return [
            TableSchema(table_name=name, columns=columns)
            for name, columns in tables_dict.items()
        ]
    finally:
        conn.close()


def execute_query(connection_string: str, sql: str, limit: int = None) -> ExecuteSqlResponse:
    """
    Execute a SELECT query and return results.

    Args:
        connection_string: PostgreSQL connection string
        sql: SQL query to execute
        limit: Maximum number of rows to return (defaults to MAX_QUERY_ROWS)

    Returns:
        ExecuteSqlResponse: Query results with columns, rows, and row count
    """
    if limit is None:
        limit = MAX_QUERY_ROWS

    conn = psycopg2.connect(connection_string)
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
            columns = [desc[0] for desc in cur.description]
            rows = cur.fetchmany(limit)
            # Convert to list of lists for JSON serialization
            rows_list = [list(row) for row in rows]

        return ExecuteSqlResponse(
            columns=columns,
            rows=rows_list,
            row_count=len(rows_list)
        )
    finally:
        conn.close()
