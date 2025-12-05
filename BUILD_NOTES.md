# Build Notes: Playwright Test Suite Container

This container is designed to build and run entirely from a single-level path.

- Correct working directory inside the Docker image: `/app`
- Dockerfile sets: `WORKDIR /app`
- `npm ci`/`npm install` and `npm test` are executed from `/app` — no `cd` is required in scripts.

Do NOT `cd` into a nested duplicate path (i.e., repeating the same folder name twice).
Such paths will fail. Use the container root directory only:
```
playwright-test-suite-for-application-automation-286725
```

Typical build and run:
```
# From repo root
docker build -t kanban-e2e ./playwright-test-suite-for-application-automation-286725
docker run --rm -e FRONTEND_URL=http://host.docker.internal:3000 kanban-e2e
```

Verification log (expected path flow):
- Orchestrator host working_directory: /home/kavia/workspace/code-generation/playwright-test-suite-for-application-automation-286725
- Docker build context: ./playwright-test-suite-for-application-automation-286725 (no extra cd)
- Dockerfile WORKDIR: /app
- npm ci/npm test executed in: /app
- No nested directory traversal occurs.

Orchestrator configuration:
- The repo defines .kavia/manifest.yaml to set working_directory explicitly.
- You can hard-pin the host-side path with WORKDIR_PLAYWRIGHT in .env or CI env:
  WORKDIR_PLAYWRIGHT=playwright-test-suite-for-application-automation-286725
- Ensure no build hooks attempt to 'cd' before invoking docker build; the orchestrator should provide the context directly.

Local (without Docker):
```
cd playwright-test-suite-for-application-automation-286725
npm ci
npm test
```

CI hint:
- Ensure any pre-build steps run in the container root (`playwright-test-suite-for-application-automation-286725`) and do not attempt to `cd` into a nested duplicate folder name.
- No path prefixing with the container name is required once inside the container; all scripts assume `/app` as the working directory.
- Orchestrator manifest now includes `working_directory: /home/kavia/workspace/code-generation/playwright-test-suite-for-application-automation-286725` to prevent any derived nested path during setup.
