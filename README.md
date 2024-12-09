# Cheque Tracking Application

This is a full-stack web application for tracking cheque-related information from various suppliers. It provides the following key features:

- **Excel Import:** Admin can upload an Excel file containing supplier data.
- **Real-Time Viewing & Editing:** Anyone with access can view, edit, and add new suppliers without requiring installation of additional software.
- **Inline Editing and Additions:** Users can modify supplier details directly from the frontend interface.
- **Optimistic Concurrency Control:** Prevents accidental overwrites when multiple users edit the same supplier record simultaneously.
- **Status Updates & Dynamic Counts:** The frontend displays real-time total supplier count and total number of checks, updating as changes are made.

## Features

1. **Data Import (Excel)**
   - Admins can upload an Excel file (e.g., `.xlsx`) via the `/admin` page or using external tools like Postman.
   - The system parses the file and updates existing suppliers or inserts new ones.
   - Date fields from Excel are converted from Excel date serials to a readable format (e.g., `YYYY-MM-DD`).

2. **Viewing and Editing Suppliers**
   - Users are prompted for their name on first visit.
   - A main page lists all suppliers with columns like:
     - **Supplier Name**
     - **Email Address**
     - **# of Checks**
     - **Date of Emailing**
     - **Status** (renamed from “Replied?”)
     - **Notes**
     - **Last Modified By / At**
   - Inline editing allows changing supplier details directly. Additions are also supported.
   - **No Deletions:** The interface does not allow removing suppliers.

3. **Optimistic Concurrency Control**
   - Before saving changes to a supplier, the system checks the record’s `last_modified_at` timestamp.
   - If another user has updated the record since it was fetched, a 409 conflict is returned and the user must refresh.
   - Prevents silent overwrites.

4. **Administration**
   - A dedicated `/admin` page allows file uploads.
   - Admins can quickly update the database with new or modified supplier info.

5. **Real-Time Counts**
   - The UI displays total suppliers and total checks.
   - Counts update after every edit or addition.

## Technology Stack

- **Frontend:**
  - React
  - Bootstrap for styling
  - Axios for API calls
  - React Router for navigation

- **Backend:**
  - Node.js & Express for server and APIs
  - SQLite for data storage
  - Multer for file uploads
  - xlsx for Excel parsing

- **Deployment:**
  - Serve the React build from Express for a single URL deployment.
  - Compatible with platforms like Render or Heroku.

## License

This project is licensed under the apach 2.0 License. See the `LICENSE` file for more details.
