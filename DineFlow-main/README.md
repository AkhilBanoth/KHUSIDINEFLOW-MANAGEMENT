# 🍽️ DineFlow — Restaurant Order & Kitchen Operations System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-PyMongo-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.12%2B-blue?logo=python&logoColor=white)](https://www.python.org/)

An **Advanced Real-World Restaurant POS & Kitchen Operations Backend** built with **FastAPI**, **Python OOP**, and **100% MongoDB**. This system simulates end-to-end restaurant workflows: order creation, multi-unit recipe availability checks, transactional inventory deduction, kitchen ticket queueing with staff workload balancing, preparation time estimation, accurate Decimal billing, duplicate-resistant payments, multi-step refunds, and real-time MongoDB activity event logs.

---

## 🌟 Highlights & Architecture

- **100% MongoDB Backend**: Uses MongoDB and PyMongo for all transactional business data, inventory movements, kitchen events, audit logs, and feedback.
- **Python OOP Domain Models**: Rich domain entity classes (`MenuItem`, `OrderItem`, `Order`, `Ingredient`, `Recipe`, `RestaurantTable`, `Reservation`, `KitchenTicket`, `Invoice`) enforcing encapsulation and business rules.
- **Repository Pattern**: Strict decoupling of database operations from business logic via specialized repository classes in `app/repositories/`.
- **Station Profiles**: The frontend can switch between `ADMIN`, `MANAGER`, `CHEF`, `WAITER`, and `CASHIER` workspace layouts. These profiles do not authorize API requests.
- **Precise Financial Calculations**: Powered by Python's `Decimal` and MongoDB `Decimal128` to avoid floating-point inaccuracies.
- **Unit Normalization & Recipe Math**: Automatically translates metric units (KG/G, L/ML, PCS) to check recipe requirements against warehouse inventory.
- **Automated Tests**: Unit and MongoDB integration tests cover inventory, order, table, billing, and reporting workflows.

---

## 📁 Project Structure

```text
dineflow-main/
├── app/
│   ├── main.py                     # FastAPI application entry point with CORS & dual-routing
│   ├── config/
│   │   └── settings.py             # MongoDB and application settings
│   ├── database/
│   │   ├── mongodb.py              # PyMongo client & collection bindings
│   │   └── indexes.py              # MongoDB indexing (unique & sparse indexes)
│   ├── models/
│   │   ├── entities.py             # Python OOP Domain entities with business logic
│   │   └── __init__.py
│   ├── repositories/
│   │   ├── base_repository.py      # Generic CRUD repository
│   │   ├── menu_repository.py      # Menu items & categories
│   │   ├── inventory_repository.py # Ingredients & stock movements
│   │   ├── table_repository.py     # Tables & reservations
│   │   ├── order_repository.py     # Orders & order items
│   │   ├── kitchen_repository.py   # Kitchen tickets & assignments
│   │   ├── billing_repository.py   # Invoices, payments & refunds
│   │   ├── audit_log_repository.py # MongoDB activity logs, kitchen events & feedback
│   │   └── __init__.py
│   ├── schemas/                    # Pydantic v2 validation models
│   ├── services/                   # Service layer with core restaurant logic
│   │   ├── common.py               # Shared serialization & utility helpers
│   │   ├── menu_service.py         # Menu CRUD & category filtering
│   │   ├── ingredient_service.py   # Stock updates, low-stock alerts & serving capacity
│   │   ├── recipe_service.py       # Recipe mapping & ingredient availability checks
│   │   ├── table_service.py        # Table statuses & active order occupancy guards
│   │   ├── reservation_service.py  # Overlap collision logic & guest capacity
│   │   ├── order_service.py        # Order lifecycle, inventory deduction & cancellation
│   │   ├── kitchen_service.py      # Ticket progression, workload caps & prep time formula
│   │   ├── billing_service.py      # Invoices, taxes & discount calculations
│   │   ├── payment_service.py      # Duplicate references, overpayment checks & table release
│   │   ├── refund_service.py       # Multi-step refund approvals & audit
│   │   ├── feedback_service.py     # Customer ratings & reviews
│   │   └── report_service.py       # Daily sales, serving capacity & kitchen performance
│   ├── routes/                     # FastAPI route controllers
│   └── utils/
│       └── units.py                # Metric unit conversion utility
├── frontend/                   # React + Vite SPA and legacy static client
│   ├── src/                    # React app, views, services, and shared styles
│   ├── dist/                   # Built SPA served by FastAPI/Vercel
│   ├── legacy/                 # Older static frontend
│   ├── package.json
│   └── vite.config.js
├── tests/
│   ├── conftest.py             # Pytest environment setup
│   └── test_api.py             # MongoDB-backed API integration tests
├── run_dineflow.bat            # 1-Click launcher: starts backend & opens frontend in browser
├── open_frontend.bat           # 1-Click shortcut to open UI in browser
├── requirements.txt            # Project dependencies
├── requirements-dev.txt        # Test dependencies
├── .env.example                # Environment template
└── README.md
```

---

## 💻 Modern Frontend Web Application

DineFlow includes a responsive React + Vite SPA connected to the FastAPI + MongoDB backend:

- **Point of Sale (POS)**: Visual dish browser with category tabs, keyword search, guest table assignment, live tax/subtotal calculation, and 1-click order submission.
- **Kitchen Display System (KDS)**: Real-time Kanban board with 4 operational stages (*Queued*, *Preparing*, *Ready*, *Served*), priority tags, and 1-click status transitions.
- **Table Floor Plan & Reservations**: Visual dining floor plan, table status toggles, and reservation booking with overlap conflict protection.
- **Cashier & Billing**: Invoice generation, multiple payment methods (Cash, Card, UPI, Digital Wallet), and thermal customer receipt preview with 1-click printing.
- **Stock & Low-Stock Alerts**: Live warehouse inventory monitors with progress bar alerts and restock forms.
- **Menu & Recipe Management**: Catalog CRUD, price updates, recipe mappings, and sold-out toggling.
- **Customer Feedback**: Guest rating submissions (1-5 stars) and review analytics.
- **Station Switcher**: Switch the visible workspace between staff profiles. This is a UI convenience, not server-side authorization.

### Running the Web UI

For development, start FastAPI on port 8000 and Vite in a second terminal:

```bash
uvicorn app.main:app --reload --port 8000
cd frontend
npm ci
npm run dev
```

Open `http://127.0.0.1:5173`. FastAPI serves the production build at `http://127.0.0.1:8000/app/` after `npm run build`.

---

## Development Demo Accounts

These fixed credentials are for local development only. The Vercel deployment does not seed them. Do not use them for a public or production system.

For local development only, seed demo accounts with `python -m app.database.seed_roles`:

| Role | Default Email | Password | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@dineflow.com` | `Password123!` | Local profile preview and development |
| **MANAGER** | `manager@dineflow.com` | `Password123!` | Orders, inventory, staff assignments, reports, refund approvals |
| **CHEF** | `chef@dineflow.com` | `Password123!` | Kitchen tickets, preparation status, recipe management |
| **WAITER** | `waiter@dineflow.com` | `Password123!` | Customer orders, table management, reservations, order delivery |
| **CASHIER** | `cashier@dineflow.com` | `Password123!` | Bill generation, payment processing, refund requests |

---

## ⚡ Core Business Rules & Formulas

### 1. Recipe & Stock Deduction
When confirming an order, the system calculates exact ingredient needs based on recipe quantities multiplied by order item quantities with metric unit conversion (e.g. 250 g per Biryani × 4 = 1 KG deducted from KG inventory). Stock cannot become negative; if any ingredient is insufficient, confirmation is halted.

### 2. Price Snapshots
When an order item is added, the system freezes `unit_price_snapshot` and calculates `item_total`. Menu item price changes never mutate historical orders or invoices.

### 3. Kitchen Workload & Preparation Time Estimation
- **Workload Protection**: Staff cannot be assigned more than their `maximum_active_orders` limit.
- **Estimated Prep Time Formula**:
  $$\text{Estimated Time} = \max(\text{Item Prep Times}) + \text{Queue Delay}$$
  where $\text{Queue Delay} = \text{Queued Tickets} \times 5\text{ mins}$.

### 4. Financial Precision & Payments
- Standard 5% GST tax calculation with consistent rounding to 2 Decimal places.
- Overpayment prevention: payments exceeding invoice outstanding balance are rejected.
- Duplicate transaction references are rejected via MongoDB sparse unique indexing.
- Releasing tables: Completing a payment for a `DINE_IN` order automatically transitions the table to `AVAILABLE`.

### 5. Reservation Overlap Collision
A reservation is rejected if another confirmed reservation exists on the same table such that:
$$\text{new\_start} < \text{existing\_end} \quad \text{and} \quad \text{new\_end} > \text{existing\_start}$$

### 6. MongoDB Event Logging & Auditing
All significant events are logged to dedicated collections:
- `order_activity_logs`: `ORDER_CREATED`, `ORDER_CONFIRMED`, `ORDER_CANCELLED`, `ORDER_SERVED`, `PAYMENT_COMPLETED`.
- `kitchen_events`: Status transitions (`QUEUED` $\to$ `PREPARING` $\to$ `READY` $\to$ `HANDED_OVER`), staff assignments, and delays.
- `customer_feedback`: Ratings (1–5) linked to completed orders with duplicate submission prevention.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+ (tested on Python 3.12 and 3.14)
- Local or Cloud MongoDB instance running on `mongodb://localhost:27017`

### 2. Installation
```bash
git clone <repo-url>
cd dineflow-main
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```env
MONGO_URL=mongodb://localhost:27017
ATLAS_URL=
DATABASE_NAME=restaurant_management
APP_NAME=Restaurant Management System
DEBUG=True
```

### 4. Database Seeding
Initialize local demo accounts (tables, menu, and inventory are seeded by the local app startup):
```bash
python -m app.database.seed_roles
```

### 5. Run Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
- **API Documentation (Swagger UI)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Alternative Docs (ReDoc)**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## Automated Testing

Install development dependencies and use a separate MongoDB database for tests. The integration tests create and modify restaurant records; never point them at production data.

```bash
pip install -r requirements-dev.txt
```

PowerShell:

```powershell
$env:DATABASE_NAME = "dineflow_test"
pytest -q
```

Linux/macOS:

```bash
DATABASE_NAME=dineflow_test pytest -q
```

See [deployment notes](DEPLOYMENT.md) before publishing this app.
```

The focused seed and inventory-adjustment unit tests use stub repositories and do not write to MongoDB:

```bash
pytest tests/test_tables_seed.py tests/test_inventory_adjustment.py -q
```

---

## 📡 Key API Endpoints Reference

All endpoints support both `/api/<endpoint>` and root `/<endpoint>`:

API endpoints are public and do not require authentication or bearer tokens. Role-based API authorization is disabled; frontend role profiles only control the visible interface.

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Verify credentials and return the user profile |
| **Menu** | `GET` | `/api/menu-items` | List & filter menu items |
| | `POST` | `/api/menu-items` | Create new menu item |
| | `PATCH` | `/api/menu-items/{id}/availability` | Toggle availability status |
| **Recipes** | `POST` | `/api/recipes` | Map menu item to ingredients |
| | `GET` | `/api/recipes/menu-item/{id}` | View recipe for item |
| **Inventory** | `GET` | `/api/ingredients` | View inventory stock |
| | `POST` | `/api/ingredients/{id}/stock` | Restock or manual adjustment |
| | `GET` | `/api/ingredients/low-stock` | View low & critical stock alerts |
| **Tables** | `GET` | `/api/tables` | View tables & statuses |
| | `POST` | `/api/reservations` | Reserve table (capacity & overlap guarded) |
| **Orders** | `POST` | `/api/orders` | Create draft order |
| | `POST` | `/api/orders/{id}/items` | Add item with price snapshot |
| | `POST` | `/api/orders/{id}/confirm` | Confirm order & deduct inventory |
| | `POST` | `/api/orders/{id}/cancel` | Cancel order & process inventory reversal |
| **Kitchen** | `GET` | `/api/kitchen/tickets` | View kitchen queue |
| | `POST` | `/api/kitchen/tickets/{id}/start` | Start preparation |
| | `POST` | `/api/kitchen/tickets/{id}/ready` | Mark food as ready |
| | `GET` | `/api/kitchen/estimate-time/{id}` | Calculate estimated prep time |
| | `GET` | `/api/kitchen/workload` | Staff workload & active assignments |
| **Billing** | `POST` | `/api/orders/{id}/invoice` | Generate bill with tax & discount |
| | `POST` | `/api/payments` | Record payment & auto-release table |
| | `POST` | `/api/refunds` | Request refund |
| | `PATCH` | `/api/refunds/{id}/approve` | Manager approval for refund |
| **Audit & Events** | `GET` | `/api/activity-logs/order/{id}` | View MongoDB order audit logs |
| | `GET` | `/api/kitchen-events/order/{id}` | View MongoDB kitchen status events |
| | `POST` | `/api/orders/{id}/feedback` | Customer rating & review submission |
| **Reports** | `GET` | `/api/reports/daily-sales` | Daily sales & revenue breakdown |
| | `GET` | `/api/reports/serving-capacity` | Possible servings left based on stock |
| | `GET` | `/api/reports/kitchen-performance` | Delayed orders & status counts |

---

## 📜 License
No license file is included yet. Confirm the intended license before redistributing this project.
