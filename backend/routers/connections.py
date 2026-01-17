from fastapi import APIRouter, HTTPException
from backend.database import get_db
from backend.models.schemas import (
    ConnectionCreate,
    ConnectionResponse,
    ConnectionTestResponse,
    SchemaResponse,
)
from backend.services import postgres

router = APIRouter(prefix="/connections", tags=["connections"])


@router.post("", response_model=ConnectionResponse)
def create_connection(connection: ConnectionCreate):
    """Add a new database connection."""
    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO connections (name, connection_string) VALUES (?, ?)",
            (connection.name, connection.connection_string)
        )
        conn.commit()
        connection_id = cursor.lastrowid

        row = conn.execute(
            "SELECT id, name, connection_string, created_at FROM connections WHERE id = ?",
            (connection_id,)
        ).fetchone()

    return ConnectionResponse(
        id=row["id"],
        name=row["name"],
        connection_string=row["connection_string"],
        created_at=row["created_at"]
    )


@router.get("", response_model=list[ConnectionResponse])
def get_connections():
    """Get all saved database connections."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, name, connection_string, created_at FROM connections ORDER BY created_at DESC"
        ).fetchall()

    return [
        ConnectionResponse(
            id=row["id"],
            name=row["name"],
            connection_string=row["connection_string"],
            created_at=row["created_at"]
        )
        for row in rows
    ]


@router.delete("/{connection_id}")
def delete_connection(connection_id: int):
    """Delete a database connection."""
    with get_db() as conn:
        cursor = conn.execute(
            "DELETE FROM connections WHERE id = ?",
            (connection_id,)
        )
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Connection not found")

    return {"message": "Connection deleted successfully"}


@router.post("/{connection_id}/test", response_model=ConnectionTestResponse)
def test_connection(connection_id: int):
    """Test a database connection."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT connection_string FROM connections WHERE id = ?",
            (connection_id,)
        ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Connection not found")

    success, message = postgres.test_connection(row["connection_string"])
    return ConnectionTestResponse(success=success, message=message)


@router.get("/{connection_id}/schema", response_model=SchemaResponse)
def get_schema(connection_id: int):
    """Get database schema for a connection."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT connection_string FROM connections WHERE id = ?",
            (connection_id,)
        ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Connection not found")

    try:
        tables = postgres.get_schema(row["connection_string"])
        return SchemaResponse(tables=tables)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get schema: {str(e)}")
