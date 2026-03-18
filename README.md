# 🏦 FinFlow: Secure Banking Ledger API

> A fault-tolerant backend system built to process and manage user-to-user financial transactions safely. 

This project prioritizes strict database integrity, prevents double-spending, and handles server crashes gracefully without losing user funds.

## 🚀 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (using Mongoose)
* **Security:** JSON Web Tokens (JWT via Cookies), bcrypt.js

## 💡 Core Engineering Features

* **Fail-Safe Transactions (ACID Compliance):** Utilizes `mongoose.startSession()` to guarantee atomic transfers. If any step of the transaction fails (e.g., insufficient funds or a dropped connection), the entire session automatically rolls back. Zero money is lost or misplaced.
* **Double-Spending Protection:** Implements an `idempotencyKey` check before executing transfers. This intercepts rapid, duplicate payment clicks, ensuring users are never charged twice for the same transaction.
* **Tamper-Proof Dynamic Ledger:** Replaces static account balances with a dynamic calculation. The system uses a MongoDB `$aggregate` pipeline to calculate a user's exact balance on the fly by summing their entire history of `DEBIT` and `CREDIT` entries.
* **Strict Immutability:** The Ledger model utilizes Mongoose `pre` hooks to completely block `updateOne`, `deleteOne`, and `findOneAndUpdate` operations, ensuring financial records can never be altered once committed.
* **Role-Based Security:** Features password hashing (`bcrypt`), stateless authentication securely delivered via HTTP Cookies, and a dedicated middleware layer to separate standard users from administrative `System Users`.

## 🔗 Core API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Create a new user account |
| `POST` | `/login` | Authenticate user & set JWT Cookie |
| `POST` | `/logout` | Invalidate JWT via Blacklist |

### 💳 Accounts (`/api/accounts`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/` | Create a new financial account | ✅ |
| `GET` | `/` | Get all accounts for logged-in user | ✅ |
| `GET` | `/balance/:accountId` | Dynamically calculate real-time balance | ✅ |

### 💸 Transactions (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/` | Safely transfer funds using ACID sessions | ✅ |
| `POST` | `/system/initial-funds` | Seed an account (System Admins only) | ✅ (Admin) |

## 🛠️ How to Run Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/rajat4999/bankingLedger.git](https://github.com/rajat4999/bankingLedger.git)
