# Prompt Box Web

Prompt Box Web is the public-facing web application for **Prompt Box**, a digital-product application built on the Armin Web Template foundation.

It is a separate Next.js application that consumes the Prompt Box API and provides the public product discovery, presentation, authentication, and user experience.

## Role in the Prompt Box Ecosystem

Prompt Box consists of three independent applications:

* **Prompt Box API** — Laravel backend and source of truth for business rules, authorization, data, orders, payments, subscriptions, and protected content.
* **Prompt Box Admin** — React-based administrative interface for management workflows.
* **Prompt Box Web** — Next.js public-facing web application for the Prompt Box product experience.

The Web application is responsible for public presentation and user experience. Authoritative business rules, authorization, pricing, payments, and access decisions remain in the Prompt Box API.

## Tech Stack

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* next-intl
* next-themes
* Lucide React
* Sonner
* Vazirmatn

## Requirements

* Node.js
* npm
* A running Prompt Box API instance

## Environment

Create a local environment file:

```bash
cp .env.example .env.local
```

Set the API base URL to the Prompt Box API:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

For production, configure the environment according to the target Prompt Box deployment.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Next.js development server will display the local URL in the terminal.

## Validation

Run the production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

## Architecture

Prompt Box Web follows the reusable architecture established by the **Armin Web Template**.

The Web application is responsible for:

* Public product discovery and presentation
* Authentication and account-related user experience
* Product and content presentation
* Client-side interactions and navigation
* API communication
* Responsive and localized user interface

Business rules, authorization decisions, pricing, payments, subscriptions, and access control remain the responsibility of the Prompt Box API.

## Armin Foundation

Prompt Box Web was created from the stable **Armin Web Template**.

The Template provides the reusable application foundation, while Prompt Box contains product-specific requirements, UI, content, branding, and configuration.

Product-specific changes should remain in Prompt Box. Reusable architectural improvements should only be introduced into the Armin Web Template when they represent a genuine requirement that benefits multiple product instances.

## Repository

GitHub:

`git@github.com:dxmersila/prompt-box-web.git`

## Status

**Productionization in Progress**

Prompt Box Web is the public-facing application for the Prompt Box product instance and is being prepared for production use.
