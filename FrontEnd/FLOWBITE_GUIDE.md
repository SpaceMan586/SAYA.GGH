# Flowbite + Next.js + TypeScript + Tailwind CSS

This project is a Next.js frontend application with Flowbite React components, TypeScript, and Tailwind CSS.

## Getting Started

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Adding Flowbite Components

### Step 1: Visit Flowbite React Documentation

Go to [https://flowbite-react.com/](https://flowbite-react.com/) to browse available components.

### Step 2: Import the Component

```typescript
import { ComponentName } from "flowbite-react";
```

### Step 3: Use the Component

```tsx
export default function MyPage() {
  return (
    <div>
      <ComponentName />
    </div>
  );
}
```

## Available Flowbite Components

Here are some popular components you can use:

### Buttons
```tsx
import { Button } from "flowbite-react";

<Button>Click me</Button>
<Button color="blue">Primary</Button>
<Button color="gray">Secondary</Button>
<Button outline>Outline</Button>
```

### Cards
```tsx
import { Card } from "flowbite-react";

<Card>
  <h5 className="text-2xl font-bold">Card Title</h5>
  <p>Card content goes here</p>
</Card>
```

### Navbar
```tsx
import { Navbar } from "flowbite-react";

<Navbar fluid rounded>
  <Navbar.Brand href="/">
    <span>Brand</span>
  </Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Navbar.Link href="/">Home</Navbar.Link>
    <Navbar.Link href="/about">About</Navbar.Link>
  </Navbar.Collapse>
</Navbar>
```

### Modal
```tsx
import { Button, Modal } from "flowbite-react";
import { useState } from "react";

function MyComponent() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button onClick={() => setShow(true)}>Open modal</Button>
      <Modal show={show} onClose={() => setShow(false)}>
        <Modal.Header>Modal Title</Modal.Header>
        <Modal.Body>
          <p>Modal content here</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
```

### Forms
```tsx
import { Label, TextInput, Checkbox } from "flowbite-react";

<form>
  <div>
    <Label htmlFor="email">Email</Label>
    <TextInput id="email" type="email" placeholder="name@example.com" />
  </div>
  <Checkbox id="remember" label="Remember me" />
</form>
```

### Tables
```tsx
import { Table } from "flowbite-react";

<Table>
  <Table.Head>
    <Table.HeadCell>Name</Table.HeadCell>
    <Table.HeadCell>Age</Table.HeadCell>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John</Table.Cell>
      <Table.Cell>25</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Alerts
```tsx
import { Alert } from "flowbite-react";

<Alert color="info">
  This is an info alert
</Alert>
```

### Dropdown
```tsx
import { Dropdown } from "flowbite-react";

<Dropdown label="Options">
  <Dropdown.Item>Dashboard</Dropdown.Item>
  <Dropdown.Item>Settings</Dropdown.Item>
  <Dropdown.Item>Sign out</Dropdown.Item>
</Dropdown>
```

## Project Structure

```
flowbite-app/
├── app/
│   ├── page.tsx          # Home page (main entry point)
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles with Tailwind
├── public/               # Static files
├── tailwind.config.ts    # Tailwind configuration with Flowbite
├── postcss.config.mjs    # PostCSS configuration
└── package.json          # Dependencies
```

## Customizing Tailwind

You can customize Tailwind in `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
};

export default config;
```

## Resources

- [Flowbite React Documentation](https://flowbite-react.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Building for Production

```bash
npm run build
npm start
```
