# Engineers Thesis s28016 - Stanisław Stepka

Repository contains files for the client application
that send request to the
following [server application](https://github.com/StanslawStepkas28016/AudioEngineersPlatformBackend).

The thesis is written in Polish, as part of the Engineers of IT studies at PJATK.

## Installation guide

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

4. Refer back to the server application [README](https://github.com/StanslawStepkas28016/AudioEngineersPlatformBackend/blob/main/README.md).