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


Each company can have multiple buses.
Each bus can have multiple routes.
Each company can have multiple workers.
Each worker can have multiple tickets.
Each route can have multiple tickets.
Each driver can have multiple passengers.
Each passenger is associated with a route and a worker.



the Routes - The BusId column establishes a foreign key relationship with the Buses table, indicating the bus that operates the route.
And 
the buses - The CompanyId column establishes a foreign key relationship with the Companies table, indicating the company that owns the bus.
And
the worker - The CompanyId column establishes a foreign key relationship with the Companies table, indicating the company that employs the worker.
And
Tickets - The WorkerId column establishes a foreign key relationship with the Workers table, indicating the worker who holds the ticket.
The RouteId column establishes a foreign key relationship with the Routes table, indicating the route associated with the ticket.
And 
the driver - The CompanyId column establishes a foreign key relationship with the Companies table, indicating the company that employs the driver.


so to be clear and correct the buses are associated to a company and the routes should be assocaited to a bus whcih means routes will be assocaited to a company
and the workers are associated to a company but they do not need to be assocaited to a route becuase they shoudl only be able to abook a tickets that are issueed by the company the worker is assocated to whcih will only show the routes that are assocaited to the company the worker is assocaited to and the tickets are assocaited to a worker and a route and the driver is assocaited to a company and a route and the passenger is assocaited to a route and a worker and a ticket and a driver and a company.
