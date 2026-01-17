from datetime import datetime
from typing import Any
from pydantic import BaseModel


# Connection models
class ConnectionCreate(BaseModel):
    name: str
    connection_string: str


class ConnectionResponse(BaseModel):
    id: int
    name: str
    connection_string: str
    created_at: datetime


class ConnectionTestResponse(BaseModel):
    success: bool
    message: str


# SQL generation models
class GenerateSqlRequest(BaseModel):
    connection_id: int
    natural_language_query: str


class GenerateSqlResponse(BaseModel):
    sql: str
    explanation: str


# SQL execution models
class ExecuteSqlRequest(BaseModel):
    connection_id: int
    sql: str


class ExecuteSqlResponse(BaseModel):
    columns: list[str]
    rows: list[list[Any]]
    row_count: int


# Schema models
class ColumnSchema(BaseModel):
    column_name: str
    data_type: str
    is_nullable: bool


class TableSchema(BaseModel):
    table_name: str
    columns: list[ColumnSchema]


class SchemaResponse(BaseModel):
    tables: list[TableSchema]
