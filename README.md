# Combilog Archive Utility

[![CircleCI](https://circleci.com/gh/lewjc/CombiLog-Archiver.svg?style=shield&circle-token=268a495dbf8d3480ffc3bb540e4be1611378af49)](https://app.circleci.com/pipelines/github/lewjc/CombiLog-Archiver)

This Repository is for the archive micro-service in the CombiLog Stack. It deals with storing all log messages that are processed by combilog as well as clearing messages from the aggregator once the message has been archived succesfully.

## Environment Variables

For Development, modify `.env.example` to `.env`

```COMBILOG_ARCHIVE_PORT=13338
// The root folder that all log messages are stored. Must be an absolute file path.
COMBILOG_ARCHIVE_ROOT=/var/combilog/logs

// URL of the CombiLog aggregator socket.
COMBILOG_AGGREGATOR_SOCKET_URL=ws://localhost:13337

// URL of the CombiLog aggregator api.
COMBILOG_AGGREGATOR_API_URL=http://localhost:8090
```

## Deployment

To deploy the archive utility you can use the docker-compose command below.

```
$ docker-compose up -d
```

For instructions on deploying the full CombiLog Stack, see [here](https://github)
