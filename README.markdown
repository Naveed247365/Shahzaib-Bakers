# Shahzaib Bakers Webstore

A webstore for Shahzaib Bakers, featuring a customer-facing product catalog with category filtering and an admin dashboard for managing products, orders, and customers. Products are stored in Google Sheets, with images in Google Cloud Storage. The admin dashboard uses a simple username/password login (`admin`/`admin123`).

## Features
- **Customer Webstore**:
  - Browse products by category (Bread, Cakes, Pastries, Cookies, Other).
  - Order via WhatsApp with pre-filled messages.
  - Responsive design with a modern UI.
- **Admin Dashboard**:
  - Login with username `admin` and password `admin123`.
  - Manage products (add, edit, delete) with data stored in Google Sheets.
  - View orders and customers from Google Sheets.
  - Update store settings (saved locally).
- **Google Sheets Integration**:
  - Products stored in a `Products` sheet.
  - Orders stored in an `Orders` sheet.
  - Customers stored in a `Customers` sheet.
- **Google Cloud Storage**:
  - Product images are uploaded to a GCS bucket, with URLs stored in Google Sheets.
- **Fallback**:
  - LocalStorage used as a fallback if Google Sheets API fails.

## Setup Instructions

### 1. Google Sheets Setup
1. Create a Google Sheet named "Shahzaib Bakers Products".
2. Create three sheets:
   - **Products**: Headers: `ID`, `Name`, `Category`, `Price`, `Stock`, `Description`, `Image`, `Status`.
   - **Orders**: Headers: `ID`, `Customer`, `Products`, `Total`, `Date`, `Status`.
   - **Customers**: Headers: `ID`, `Name`, `Email`, `Phone`, `Orders`, `TotalSpent`.
3. Deploy the Google Apps Script (`Code.gs`) as a web app:
   - In Google Sheets, go to `Extensions > Apps Script`.
   - Paste the `Code.gs` content.
   - Deploy as a web app (`Deploy > New Deployment > Web App`).
   - Set "Who has access" to "Anyone" and copy the web app URL.
   - Update the `API_URL` constant in `script.js` with this URL.

### 2. Google Cloud Storage Setup
1. Create a Google Cloud Project in [Google Cloud Console](https://console.cloud.google.com).
2. Enable the Cloud Storage API.
3. Create a bucket named `shahzaib-bakers-images`.
4. Set public read access:
   - Go to `Permissions` and add `allUsers` with `Storage Object Viewer` role.
5. Create a service account with `Storage Object Admin` role and download the JSON key.
6. Add the GCS library to Google Apps Script:
   - In Apps Script, go to `Resources