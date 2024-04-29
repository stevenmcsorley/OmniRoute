# Project Name

A brief description of what this project does and who it's for.

## Installation

Before you begin, make sure you have Node.js and npm installed on your system. You can download them from [Node.js](https://nodejs.org/).

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Install Capacitor CLI

```bash
npm install -D @capacitor/cli
```

### Step 4: Initialize Capacitor in your project

npx cap init

### Step 5: Install required packages for Capacitor

npm install @capacitor/core @capacitor/ios @capacitor/android

### Step 6: Add native platforms

npx cap add ios
npx cap add android

### Step 7: Update Capacitor configuration

Open the `capacitor.config.json` file and update the `webDir`:

```json
{
  "appId": "com.example.app",
  "appName": "my-app",
  "webDir": "out",
  "bundledWebRuntime": false
}
```

## Usage

Build the Next.js project and export the static build:

npm run static

Sync the web code into the native platforms:

npx cap sync

Run the app on iOS or Android:

npx cap run ios
npx cap run android

## Troubleshooting

Issue: ERR_UNSUPPORTED_API_LEVEL
If you encounter an error regarding an unsupported API level, you may need to downgrade your Android SDK to version 33. Update the `variables.gradle` file:

ext {
    compileSdkVersion = 33
    targetSdkVersion = 33
}
Issue: Signing for "App" requires a development team
When building for iOS, you need to have a valid development team and signing certificate. Open the project in Xcode and select a development team in the Signing & Capabilities editor.

## Contributing

Contributions are always welcome! See CONTRIBUTING.md for ways to get started.

## License

This project is licensed under the MIT License.

Notes for nextjs 13 on docker as we have downgraded to 12 because of the issue with nextjs 13 and docker

https://github.com/vercel/next.js/issues/43367

https://github.com/vercel/next.js/issues/42812#issuecomment-1313287665


Each company can have multiple resources.
Each resource, defined in the Resources table, is associated with a single company through the CompanyId column, establishing a foreign key relationship.
Resources can have various types such as vehicles, rooms, tables, equipment, or others.
Each employee, defined in the Employees table, is associated with a single company through the CompanyId column, establishing a foreign key relationship.
Employees have attributes like first name, last name, email, phone, and role.
Each assignment, defined in the Assignments table, links a resource with an employee for a specific time period.
Assignments have attributes like start time, end time, and status (scheduled, active, completed, cancelled).
Each reservation, defined in the Reservations table, is associated with a resource and optionally with an employee (if applicable).
Reservations have attributes like start time, end time, status (pending, confirmed, cancelled), and can also be linked to a customer (referencing a record in another customer-specific table).
