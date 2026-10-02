# DineFlow - Modern Restaurant Management UI

A modern web interface built for the **DineFlow Restaurant Management System** backend (FastAPI + MongoDB).

---

## 🌟 Highlights & Features

- **Glassmorphic Aesthetic**: Deep luxury dark theme (`#0a0d14`), warm culinary amber accents, glowing status indicators, and clean typography with Google Fonts (*Outfit* and *Inter*).
- **Executive Dashboard**: Real-time metrics on active orders, occupied tables, settled revenue, pending kitchen tickets, and low inventory alerts.
- **Interactive Point of Sale (POS)**: Visual dish browser with Veg/Non-Veg indicators, dynamic category filter tabs, keyword search, table and customer assignment, live tax & subtotal recalculation, and 1-click **"Send to Kitchen"** dispatch.
- **Kitchen Display System (KDS)**: Kanban board for chefs featuring 4 operational columns (*Queued*, *Preparing*, *Ready to Serve*, *Handed Over*), urgency tags (*Normal*, *High*, *Urgent*), item instructions, and single-click ticket state advancement.
- **Tables & Reservations Floor Plan**: Visual interactive floor plan with table statuses (*Available*, *Occupied*, *Reserved*, *Out of Service*), table creation, and reservation booking system with customer assignment and time slots.
- **Billing & Cashier**: Invoice generation, payment settlements (Cash, Credit Card, Debit Card, UPI, Digital Wallet), and thermal customer receipt preview with 1-click printing (`window.print()`).
- **Inventory & Ingredients Tracker**: Real-time stock levels with color-coded threshold progress bars (healthy / warning / danger), one-click restocking modal, and historical stock movement logs.
- **Menu Administration**: Category creation, dish management, pricing, prep time, and direct availability / sold-out toggling.
- **Guest Feedback & Analytics**: Star ratings (overall, food, waitstaff service), customer review quotes, and rating distribution summary.
- **Staff Directory & Station Profiles**: Manage staff records and preview the *Admin*, *Manager*, *Chef*, *Waiter*, and *Cashier* workspaces. Profiles only change the interface; they do not secure API requests.
- **1-Click Station Switcher**: Switch the visible workspace without re-entering credentials.
- **Live Connection Health Indicator**: Real-time ping and latency indicator with customizable Backend API URL setting.

---

## Run Locally

Start the backend from the repository root:

```bash
uvicorn app.main:app --reload --port 8000
```

In a second terminal, start Vite:

```bash
npm ci
npm run dev
```

Run those npm commands from `frontend/`, then open `http://127.0.0.1:5173`. FastAPI serves the built frontend at `http://127.0.0.1:8000/app/` after `npm run build`.

## Station Profiles

The header switcher previews these local UI profiles. They are not authenticated server identities and do not restrict API access.

| Profile | Display email | Main workspace |
| :--- | :--- | :--- |
| **System Admin** | `admin@dineflow.com` | Dashboard and all sections |
| **General Manager** | `manager@dineflow.com` | Operations and reporting |
| **Head Chef** | `chef@dineflow.com` | Kitchen, menu, and inventory |
| **Floor Waiter** | `waiter@dineflow.com` | Tables, POS, orders, and menu |
| **Billing Cashier** | `cashier@dineflow.com` | Billing, orders, and reports |

The API currently has no authentication. Do not expose this deployment with real restaurant or customer data until server-side access control is restored. See the repository’s [deployment notes](../DEPLOYMENT.md).
