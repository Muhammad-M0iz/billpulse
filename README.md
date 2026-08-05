# ⚡ BillPulse Core — Precision Billing & Subscription Management Engine

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![MinIO](https://img.shields.io/badge/MinIO-S3_Storage-C42C29?style=flat&logo=minio)](https://min.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Vanilla_CSS-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

**BillPulse** is an enterprise-grade subscription billing and real-time feature usage metering application. Built with a high-performance **FastAPI (async SQLAlchemy)** backend and a state-of-the-art **React + TypeScript** frontend utilizing modern **Stitch MCP UI aesthetics**.

---

## 🌟 Key Features

### 👤 Buyer Portal
- **Browse Plans & Features**: Interactive grid showcasing monthly recurring fees, included usage limits, and overuse rates.
- **Animated Payment Flow**: Custom HTML5 canvas particle crystal burst animation on plan subscription confirmation.
- **Subscription Dashboard**: Real-time feature usage progress meters and cycle breakdown.
- **Transaction History**: Audit table for invoice charges, base fees, and extra usage fees.

### 🛡️ Admin Suite
- **Usage Logging Hub**: Search users, select active plan subscriptions, and log unit consumption against feature limits.
- **Plan Configurator**: Create subscription tiers and attach included features with defined limits and unit prices.
- **Feature Catalog**: Manage billable metrics, max unit limits, and per-unit overuse pricing.
- **Automated Billing Engine**: Execute recurring billing cycles calculating base fees and exceeded usage charges.
- **Transaction Audit Log**: Monitor all system payments and user invoices.

### 📦 Hybrid Object Storage System
- **Dual Storage Service**: Seamlessly switch between **Local Disk Storage** and **MinIO S3 Bucket Storage**.
- **Automated MinIO Provisioning**: Embedded `minio/mc` sidecar container automatically creates public S3 buckets on startup.
- **Dynamic Avatar URL Resolution**: Robust relative URL resolution for local and Docker container environments.

---

## 🏗️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Python 3.12, FastAPI, Pydantic v2 |
| **Database & ORM** | SQLite / PostgreSQL, SQLAlchemy (Async), Alembic |
| **Frontend Framework** | React, Vite, TypeScript, TanStack Query (v5) |
| **Styling & UI** | Vanilla CSS + TailwindCSS, Material Symbols, Geist Font |
| **Object Storage** | MinIO S3, Boto3, Local Storage Service |
| **Containerization** | Docker, Docker Compose, Nginx Proxy |
| **Notifications** | SendGrid Transactional Email Service |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- [Docker & Docker Compose](https://docs.docker.com/get-docker/) installed.
- Node.js `v20+` and Python `3.12+` (if running locally without Docker).

### 2. Clone Repository & Setup Environment
```bash
git clone https://github.com/Muhammad-M0iz/billpulse.git
cd billpulse

# Copy sample environment variables
cp .env.example .env
```

### 3. Run via Docker Compose (Recommended)
Launch the entire backend, frontend, database, MinIO object storage, and bucket provisioner with a single command:

```bash
docker compose up --build -d
```

Access the application in your browser:
- 🌐 **Frontend Application**: [http://localhost](http://localhost)
- ⚙️ **FastAPI Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 🗄️ **MinIO S3 Console**: [http://localhost:9001](http://localhost:9001) *(User: `minioadmin` / Pass: `minioadmin`)*

---

## 💻 Local Development Setup

### Backend (FastAPI)
```bash
# Sync dependencies via uv
uv sync

# Run database migrations
uv run alembic upgrade head

# Start FastAPI development server
uv run fastapi dev app/main.py --host 0.0.0.0 --port 8000
```

### Frontend (React + Vite)
```bash
cd frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
Navigate to `http://localhost:5173`.

---

## 🐳 Docker Architecture & Services

```
                                  ┌────────────────────────┐
                                  │      Nginx Proxy       │
                                  │      (Port 80)         │
                                  └───────────┬────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
       ┌────────────────────────┐                          ┌────────────────────────┐
       │     React Frontend     │                          │    FastAPI Backend     │
       │     (Container)        │                          │   (Port 8000)          │
       └────────────────────────┘                          └───────────┬────────────┘
                                                                       │
                                            ┌──────────────────────────┴──────────────────────────┐
                                            ▼                                                     ▼
                               ┌────────────────────────┐                            ┌────────────────────────┐
                               │   MinIO S3 Storage     │                            │     SQLite / Postgres  │
                               │   (Port 9000/9001)     │                            │     (Mounted Volume)   │
                               └────────────────────────┘                            └────────────────────────┘
```

---

## 📝 License & Contributing

Distributed under the MIT License. See `LICENSE` for more information.
Contributions, issues, and feature requests are welcome! Feel free to open a pull request on the `dev` branch.
