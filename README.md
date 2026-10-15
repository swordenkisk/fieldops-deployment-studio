# FieldOps Deployment Studio

FieldOps Deployment Studio is a small, browser-based planning tool for teams
preparing to install or pilot AI systems at customer sites. It helps a field
engineer check operational readiness, estimate deployment risks, and prepare a
clear customer briefing.

The project turns the real-world responsibilities of field engineering into an
interactive, explainable workflow rather than making unverified promises about
what AI can do.

## Features

- Three sample deployment scenarios:
  - Edge computer vision
  - Customer support AI agent
  - Predictive maintenance
- Scenario-specific site-readiness checklists and critical go-live gates.
- Likelihood and impact ratings for common operational risks.
- A transparent risk exposure score from 0 to 100.
- A readiness recommendation: hold, controlled pilot, or monitored deployment.
- A customer briefing generated from the current assessment.
- JSON report export and briefing copy.
- Automatic local saving in the browser with `localStorage`.
- Responsive layout, keyboard-accessible controls, and print styling.
- No external packages, server, API keys, or network access required.

## Run locally

1. Download or clone the repository.
2. Open `index.html` in a modern browser.

Alternatively, serve the folder with Python:

```bash
python -m http.server 8000

Then open http://localhost:8000 in your browser.

How the scores work
Readiness is the percentage of checklist items marked complete.

Estimated risk exposure is the average of each risk's likelihood multiplied
by its impact, converted to a 0–100 scale. Both ratings range from 1 to 5.

The recommendation applies these rules:

An incomplete critical go-live gate results in a hold recommendation.
Risk exposure of 60 or higher results in a hold recommendation.
Readiness below 80%, or exposure of 35 or higher, recommends a controlled pilot.
Otherwise, the tool recommends a monitored deployment.
These thresholds are intentionally simple and visible in app.js. They are
educational planning rules, not a safety certification or substitute for a
customer's operational procedures.

Data and security
Assessment data is saved in the current browser's local storage. The app does
not send data to a server. Exported JSON reports are downloaded to the user's
device. Avoid entering confidential customer or personal information when
demonstrating the project.

Suggested school presentation
Choose a deployment scenario and describe the field engineer's role.
Leave a critical checklist gate incomplete and show why the app recommends holding deployment.
Complete the gates, raise a risk rating, and compare the recommendation.
Discuss whether the suggested mitigations would work at a real site.
Export the report and explain the limits of a simple scoring model.