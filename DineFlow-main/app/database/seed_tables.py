"""Initialize the standard floor tables for a new restaurant database."""

from app.database.mongodb import restaurant_tables_collection
from app.services.common import now_utc


STANDARD_TABLES = [
    {"table_number": "T1", "capacity": 2, "location": "MAIN_DINING", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T2", "capacity": 2, "location": "MAIN_DINING", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T3", "capacity": 4, "location": "MAIN_DINING", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T4", "capacity": 4, "location": "MAIN_DINING", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T5", "capacity": 4, "location": "MAIN_DINING", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T6", "capacity": 4, "location": "MAIN_DINING", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T7", "capacity": 6, "location": "FAMILY_SECTION", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T8", "capacity": 6, "location": "FAMILY_SECTION", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T9", "capacity": 8, "location": "FAMILY_SECTION", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T10", "capacity": 2, "location": "WINDOW_BAY", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T11", "capacity": 4, "location": "OUTDOOR_PATIO", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T12", "capacity": 6, "location": "OUTDOOR_PATIO", "status": "AVAILABLE", "is_active": True},
]


def seed_standard_tables() -> int:
    if restaurant_tables_collection.count_documents({}) > 0:
        return 0

    created_at = now_utc()
    table_documents = [{**table, "created_at": created_at} for table in STANDARD_TABLES]
    restaurant_tables_collection.insert_many(table_documents)
    return len(table_documents)