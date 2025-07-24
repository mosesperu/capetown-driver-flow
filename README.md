# inDriveHelp.co.za

**Overview:** inDriveHelp is a public web portal helping drivers in South Africa register and learn about the inDrive ride-hailing service. It emphasizes driver empowerment – e.g. drivers can *“set your own fares”* and enjoy a *“low 9.9% commission”* on rides. The site provides all the information needed to become an inDrive driver, from app download links to guidance on account management, highlighting benefits like fair pricing and low fees. A key feature is an interactive registration portal (accessible once JavaScript is enabled) for drivers to sign up with inDrive. In summary, this project is a modern marketing site for inDrive South Africa, focused on driver acquisition and onboarding.

**Frontend Technologies:** The site is built as a single-page application using a modern web stack. It uses [Vite](https://vitejs.dev/) as the build tool and bundler, [React](https://reactjs.org/) for the user interface, [Tailwind CSS](https://tailwindcss.com/) for styling, and [TypeScript](https://www.typescriptlang.org/) for typed JavaScript.  The UI components are primarily from [shadcn/ui](https://ui.shadcn.com/), a set of customizable React components. This combination (Vite + React + Tailwind + TypeScript + shadcn-ui) provides a fast developer experience with responsive, accessible design out of the box.

**Additional Frameworks/Services:** There is no traditional backend server or database – this is a static frontend app. During development, Node.js is used to install dependencies and build the site (e.g. via `npm run build`). Any dynamic behavior (such as form submission in the registration portal) would rely on client-side code or third-party APIs. In short, the project is client-only (no custom Express/Node.js server), though it can be extended with serverless functions if needed.

**Deployment & Infrastructure:** The completed site is deployed as a static web app with continuous integration. For example, it can be hosted on a platform like **Netlify** or **Vercel**, which automatically build from the Git repository and serve the static files. Netlify (for instance) provides global CDN hosting, HTTPS, custom domains, and CI/CD from Git. We typically use GitHub Actions (or a similar CI service) to lint and test the code on each push, then deploy to the hosting provider. (Containerization/Docker is not required for a simple static site, but could be added for complex CI pipelines.)

## Live Demo

A live, deployed version of the project is available at **[https://indrivehelp.co.za/](https://indrivehelp.co.za/)**.

## Getting Started

To run the project locally, ensure you have [Node.js](https://nodejs.org/) and npm installed. Then in a terminal:

```bash
# Clone the repository
git clone https://github.com/<mosesperu>/inDriveHelp.co.za.git
cd inDriveHelp.co.za

# Install dependencies
npm install

# Start the development server (Vite)
npm run dev
```

This launches the app in development mode (usually at `http://localhost:5173/`). You can then view the site and make code changes; the page will hot-reload. To build a production version, run `npm run build`, which outputs optimized static files in the `dist/` folder.

## Contributing

We welcome contributions to this project! To contribute, follow these steps:

1. **Fork** the repository on GitHub and **clone** your fork locally.
2. Create a new **feature branch** (e.g. `feature/my-change`) and commit your changes.  Ensure your code follows the existing style and passes lint/type checks.
3. Push your branch to your GitHub fork and open a **Pull Request** against the `main` branch of this repo.
4. Describe your changes in the PR and request a review. We will run automated checks (linters, etc.) and review code. After approvals, the branch can be merged.

Please focus on meaningful improvements (bug fixes, UI enhancements, etc.) and avoid altering the core brand content without approval. All contributions should respect inDrive’s brand and content guidelines.

## License

This project is not an official inDrive product and is not affiliated with *inDrive* or Suol Innovations, Inc. All inDrive logos, trademarks, and content are owned by inDrive. According to inDrive’s legal terms, their logos and brand elements are protected by trademark law and may only be used with proper authorization. We use the inDrive logo and name here solely to refer to the official service, and any reproduction of inDrive’s trademarks follows inDrive’s [Terms of Use](https://indrive.com) and trademark guidelines. See inDrive’s official site for full license and usage policies.

**References:** The content of this README is based on the public inDrive South Africa website and inDrive’s documented legal notices. For more information about inDrive’s policies, please consult their official terms of service.
