# Engineers Thesis s28016 - Stanisław Stepka

Repository contains files for the client application
that send request to the
following [server application](https://github.com/StanslawStepkas28016/AudioEngineersPlatformBackend).

The thesis is written in Polish, as part of the Engineers of IT studies at PJATK.

**Happy to announce that as of Today (26.02.2026) the thesis got an A (5) mark :)**

## Technical Docs

The applications code is divided **vertically**, each use-case has its dedicated directory (e.g. Register has its own
`RegisterPage.tsx` file and an appropriate directory).

Some of the more important technologies used within the app:

- TypeScript (main language)
- React 18 (UI framework)
- Vite (UI framework)
- TanStackQuery (efficient server querying)
- ShadCN/UI (UI kit)
- TailwindCSS (supporting shadcn)
- i18n (UI translation)
- microsoft/signalr (a package supporting websocket communication with the server application)

## Installation and deployment guide

1. Build a Docker image using docker CLI.

```bash
docker build -f Dockerfile -t soundbest-frontend:1.1 --
platform linux/amd64,linux/arm64 .
```

2. Tag the built image.

```bash
docker tag soundbest-frontend:1.1
stanislawstepkas28016/soundbest-frontend:1.1
```

3. Push it to DockerHub or any other remote repository you have created.

```bash
docker login

docker push stanislawstepkas28016/soundbest-frontend:1.1
```

4. Refer back to the server
   application [README](https://github.com/StanslawStepkas28016/AudioEngineersPlatformBackend/blob/main/README.md).