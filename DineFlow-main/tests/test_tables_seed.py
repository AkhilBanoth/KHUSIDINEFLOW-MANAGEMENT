from app.database import seed_tables


class FakeTablesCollection:
    def __init__(self, existing_count=0):
        self.existing_count = existing_count
        self.inserted_documents = []

    def count_documents(self, query):
        return self.existing_count

    def insert_many(self, documents):
        self.inserted_documents.extend(documents)
        self.existing_count += len(documents)


def test_seed_standard_tables_populates_empty_collection(monkeypatch):
    collection = FakeTablesCollection()
    monkeypatch.setattr(seed_tables, "restaurant_tables_collection", collection)

    inserted_count = seed_tables.seed_standard_tables()

    assert inserted_count == 12
    assert [table["table_number"] for table in collection.inserted_documents] == [
        f"T{number}" for number in range(1, 13)
    ]
    assert all(table["status"] == "AVAILABLE" for table in collection.inserted_documents)
    assert all("created_at" in table for table in collection.inserted_documents)


def test_seed_standard_tables_preserves_existing_collection(monkeypatch):
    collection = FakeTablesCollection(existing_count=1)
    monkeypatch.setattr(seed_tables, "restaurant_tables_collection", collection)

    assert seed_tables.seed_standard_tables() == 0
    assert collection.inserted_documents == []