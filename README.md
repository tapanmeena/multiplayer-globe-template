# Tapan Meena - Senior Data Engineer Portfolio

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tapanmeena/tapanmeena.com)

![Tapan Meena's Portfolio Website](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/43100bd9-8e11-4c20-cc00-3bec86253f00/public)

## About This Portfolio

This is the personal portfolio website of **Tapan Meena**, a Senior Data Engineer at MAQ Software with 5+ years of experience in Azure Data Factory, Microsoft Fabric, Power BI, and Azure Databricks. The portfolio showcases real-world data engineering projects, technical expertise, and professional achievements.

### Professional Highlights
- 🏢 **Senior Data Engineer** at MAQ Software (July 2020 - Present)
- 🎓 **B.Tech Computer Science** from IIT Dharwad (2016-2020)
- 🏆 **Champion of the Quarter Award** (Dec 2024)
- 📊 **200+ Power BI Dashboards** developed for enterprise clients
- 💾 **100M+ Records** processed daily through scalable ETL pipelines
- 🎯 **Microsoft Certified** in Fabric Analytics (DP-600) & Data Engineering (DP-700)

<!-- dash-content-start -->

Using the power of [Durable Objects](https://developers.cloudflare.com/durable-objects/), this personal website shows visitor locations in real-time. Anyone visiting [tapanmeena.com](https://tapanmeena.com) will be displayed as a dot on the globe! This website is powered by [PartyKit](https://www.partykit.io/).

## How It Works

Each time someone visits the page, a WebSocket connection is opened with a Durable Object that manages the state of the globe. Visitors are placed on the globe based on the geographic location of their IP address, which is exposed as a [property on the initial HTTP request](https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties) that establishes the WebSocket connection.

The Durable Object instance that manages the state of the globe runs in one location, and handles all incoming WebSocket connections. When a new connection is established, the Durable Object broadcasts the location of the new visitor to all other active visitors, and the client adds the new visitor to the globe visualization. When someone leaves the page and their connection is closed, the Durable Object similarly broadcasts their removal. The Durable Object instance remains active as long as there is at least one open connection. If all open connections are closed, the Durable Object instance is purged from memory and remains inactive until a new visitor lands on the page, opens a connection, and restarts the lifecycle.

## More on Durable Objects

In this template, only one Durable Object instance is created, since all visitors should see updates from all other visitors, everywhere in the world. A more complex version of this application could instead show a map of the country the visitor is located in, and only display markers for other visitors who are located in the same country. In this case, a Durable Object instance would be created for each country, and the client would connect to and receive updates from the Durable Object instance corresponding to the visitor's country.

For this example, Durable Objects are used for synchronizing but not storing state. Since visitor connections are ephemeral, and tied to the in-memory lifespan of the Durable Object instance, there's no need to use persistent storage. However, a more complex version of this application could display the all-time visitor count, which needs to be persisted beyond the in-memory lifespan of the Durable Object. In this case, the Durable Object code would use the [Durable Object Storage API](https://developers.cloudflare.com/durable-objects/api/storage-api/) to persist the value of the counter.

<!-- dash-content-end -->

## Getting Started

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```
npm create cloudflare@latest -- --template=cloudflare/templates/multiplayer-globe-template
```

A live deployment of this website is available at [https://tapanmeena.com](https://tapanmeena.com)

## Setup Steps

1. Install the project dependencies with a package manager of your choice:
   ```bash
   npm install
   ```
2. Deploy the project
   ```bash
   npx wrangler deploy
   ```
3. And monitor your workers!
   ```bash
   npx wrangler tail
   ```
