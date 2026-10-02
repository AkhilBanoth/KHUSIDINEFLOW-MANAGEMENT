from decimal import Decimal

import pytest
from bson import ObjectId
from fastapi.testclient import TestClient

from app.main import app
from app.routes import ingredient_routes
from app.services import ingredient_service
from app.services.ingredient_service import IngredientService


class StubIngredientRepository:
    def __init__(self, available_quantity):
        self.ingredient_id = ObjectId()
        self.ingredient = {
            "id": str(self.ingredient_id),
            "name": "Test Ingredient",
            "unit": "KG",
            "available_quantity": Decimal(str(available_quantity)),
        }
        self.movements = []
        self.stock_updates = []

    def find_by_id(self, ingredient_id):
        return dict(self.ingredient)

    def increment_stock(self, ingredient_id, delta):
        self.stock_updates.append(delta)
        self.ingredient["available_quantity"] += delta
        return dict(self.ingredient)

    def record_movement(self, movement):
        self.movements.append(movement)
        return movement


def test_stock_adjustment_applies_signed_delta_and_logs_one_movement(monkeypatch):
    repository = StubIngredientRepository("10")
    monkeypatch.setattr(ingredient_service, "repo", repository)

    updated = IngredientService.update_stock(
        ingredient_id=str(repository.ingredient_id),
        quantity=Decimal("-2.5"),
        movement_type="WASTAGE",
        reference_type="MANUAL",
        created_by="Test Manager",
        reason="Damaged in delivery",
    )

    assert updated["available_quantity"] == Decimal("7.5")
    assert repository.stock_updates == [Decimal("-2.5")]
    assert len(repository.movements) == 1
    assert repository.movements[0]["movement_type"] == "WASTAGE"
    assert repository.movements[0]["quantity"].to_decimal() == Decimal("2.5")
    assert repository.movements[0]["reason"] == "Damaged in delivery"


def test_stock_adjustment_rejects_deduction_beyond_available_quantity(monkeypatch):
    repository = StubIngredientRepository("1")
    monkeypatch.setattr(ingredient_service, "repo", repository)

    with pytest.raises(ValueError, match="Insufficient stock"):
        IngredientService.update_stock(
            ingredient_id=str(repository.ingredient_id),
            quantity=Decimal("-2"),
            movement_type="WASTAGE",
        )

    assert repository.stock_updates == []
    assert repository.movements == []


def test_stock_adjustment_route_forwards_movement_details(monkeypatch):
    calls = []

    def update_stock(**kwargs):
        calls.append(kwargs)
        return {"id": kwargs["ingredient_id"], "available_quantity": Decimal("7.5")}

    monkeypatch.setattr(ingredient_routes.IngredientService, "update_stock", staticmethod(update_stock))
    client = TestClient(app)
    ingredient_id = str(ObjectId())

    response = client.post(
        f"/api/inventory/{ingredient_id}/stock",
        json={
            "quantity": -2.5,
            "movement_type": "WASTAGE",
            "reference_type": "MANUAL",
            "reason": "Damaged in delivery",
        },
    )

    assert response.status_code == 200
    assert len(calls) == 1
    assert calls[0]["quantity"] == Decimal("-2.5")
    assert calls[0]["movement_type"] == "WASTAGE"
    assert calls[0]["reference_type"] == "MANUAL"
    assert calls[0]["reason"] == "Damaged in delivery"