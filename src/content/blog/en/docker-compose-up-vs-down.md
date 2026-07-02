---
title: 'docker compose down Then up -d, or Just up -d? What the Official Docs Actually Say'
description: "Based on the official Docker docs: the real difference between docker compose up -d and down + up, when up -d alone is enough, when you actually need down first, and the classic pitfall of a stale latest image."
pubDate: 2026-06-11
lang: 'en'
draft: false
---

If you deploy services with Docker Compose regularly, chances are you've built up this muscle-memory combo:

```bash
docker compose down
docker compose up -d
```

Stop the whole project, wipe it clean, then bring everything back up. It works, of course — but many people can't quite explain it: doesn't `docker compose up -d` replace old containers on its own? Is the `down` step actually necessary, or is it redundant?

This article, based on the official Docker documentation, settles once and for all what each of these commands does and when to use which.

## What the Official Docs Say

### `docker compose up`: Create and Start, With Built-in Change Detection

The official reference defines `up` as: build, recreate, and start the containers for your services, attaching to their output; with `-d`, that is `--detach`, the containers run in the background instead.

The part that actually answers our question is this key passage in the docs:

> If there are existing containers for a service, and the service's configuration or image was changed after the container's creation, `docker compose up` picks up the changes by stopping and recreating the containers, while preserving mounted volumes.

In other words, `up` already has the complete "detect changes → remove old container → swap in new container" logic built in. That's exactly where the behavior you've observed — old containers automatically getting replaced by new ones — comes from.

And it's restrained about it: only services that have changed get recreated. Containers with no changes are left as they are and keep running, completely unaffected.

Around this mechanism, the docs also provide two switches pointing in opposite directions:

* `--no-recreate`: don't recreate containers even if changes are detected.
* `--force-recreate`: recreate containers even if neither the configuration nor the image has changed.

### `docker compose down`: Stop and Tear Down the Whole Project

The official definition of `down`: stop containers, and remove the containers and networks created by `up`.

By default, it removes three kinds of things:

1. The service containers defined in the Compose file;
2. The networks defined in the `networks` section;
3. The project's default network.

Networks and volumes declared as `external`, however, are never removed.

For data volumes, there are two cases to consider:

* **Named volumes**: preserved by default; they're only removed if you explicitly add `-v` or `--volumes`.
* **Anonymous volumes**: not removed by default either, but the docs add a warning that's easy to miss: anonymous volumes don't have stable names, so when you run `up` again later, the new containers won't automatically mount those old anonymous volumes.

Hence the official recommendation: data that needs to persist between updates should live in bind mounts or named volumes — don't rely on anonymous volumes.

![Diagram: after down, anonymous volumes are orphaned from the new containers](https://i.see.you/2026/06/11/a9Qf/20260610181808755.webp)

The official getting-started guide has a very intuitive example: a small app that counts visits with Redis. After a `down` followed by `up`, the visit counter resets to zero.

The reason is simple: `down` deletes the containers, and any data written to the container's writable layer disappears with them; `stop` merely stops the containers — both the containers and their data remain.

## The Essential Difference Between the Two Approaches

Put the pieces together and the difference becomes clear.

Running just:

```bash
docker compose up -d
```

is an in-place, incremental update.

Compose compares, service by service, the current configuration against the state of the running containers, and replaces only the parts that changed. The project network stays as it is; containers that weren't recreated keep even their IP addresses; and anonymous volumes from the old containers are "taken over" by the new ones.

`up` has a `-V` / `--renew-anon-volumes` flag, whose purpose is to "recreate anonymous volumes instead of retrieving data from the previous containers." The very existence of this flag confirms, conversely, that the default behavior is to retrieve the old data.

Whereas running:

```bash
docker compose down
docker compose up -d
```

is a full-stack teardown and rebuild.

All containers are stopped and removed first, and the project network is torn down as well; then `up` creates the network and all the containers from scratch.

Which means:

* The whole application goes through a complete downtime window;
* Every container gets replaced, including the ones you never touched;
* The network is rebuilt wholesale, and container IPs are reassigned;
* Anonymous volumes from the old containers are orphaned for good — the new containers start with blank data.

![Diagram: up -d incremental update vs full-stack rebuild after down](https://i.see.you/2026/06/11/I6kv/20260610182021999.webp)

| Dimension | Just `up -d` | `down` then `up -d` |
| ------ | ---------- | ------------------ |
| Containers | Only changed services recreated | All removed, then recreated |
| Unchanged services | Unaffected, keep running | Stopped and rebuilt along with the rest |
| Project network | Stays as it is | Removed and recreated |
| Anonymous volume data | New containers take over old data | Orphaned with the old containers — effectively lost |
| Named volumes | Preserved | Preserved, unless you run `down -v` |
| Downtime scope | Brief interruption for changed services only | One full round of whole-stack downtime |

## Most of the Time, Just `up -d` Is Enough

You changed a service's environment variables, port mappings, or image tag in `compose.yaml`, or added a new service — for these everyday scenarios, simply running:

```bash
docker compose up -d
```

is enough.

Compose will touch exactly the parts that need touching, and the remaining services won't even notice. This is the standard update path as officially designed — the one with the least downtime and the safest behavior.

There is, however, one very common pitfall here, and it's the real reason many people believe "`up -d` doesn't take effect, you have to `down` first":

> `up` does not proactively pull new images from the registry.

If your service is pinned to an unchanging tag like `myapp:latest`, and the image in the registry has been updated while your local copy is still the old one, then as far as Compose is concerned, "the image hasn't changed" — and `up -d` will do nothing at all.

![Diagram: with an unchanged tag, up -d won't pull the new image — pull first](https://i.see.you/2026/06/11/b1fE/20260610193526624.webp)

The correct way to update is to pull first, then start:

```bash
docker compose pull
docker compose up -d
```

You can also merge it into a single step:

```bash
docker compose up -d --pull always
```

If the image is built locally, use this instead:

```bash
docker compose up -d --build
```

Once the image has been pulled — or rebuilt — Compose detects that it changed and replaces the corresponding containers. At no point does `down` need to be involved.

## When You Actually Need `down` First

### 1. You Changed the Definition of Top-Level Resources Like Networks

Docker networks don't support in-place reconfiguration.

If you adjust a network's subnet, driver, or other parameters in the compose file, the old network — together with the containers attached to it — usually has to be torn down before it can be recreated with the new configuration.

That's exactly `down`'s job. The same goes for changes to named volume definitions.

### 2. You Want a Genuinely Clean Environment

When you're chasing a weird bug or resetting test data, `down` gives you a deterministic "zero state."

If the persisted data should be wiped too, add `-v` to remove the named volumes along with everything else:

```bash
docker compose down -v
docker compose up -d
```

> Careful: `down -v` deletes named volumes, and that data cannot be recovered.

### 3. You're Taking the Stack Out of Service for a While

If this isn't just a brief pause but you actually want to free up the container and network resources, then `down` is precisely what it was designed for.

In this scenario, you don't even need an `up` right after it.

### 4. You Need to Clean Up Services Removed From the Compose File

If you've deleted a service from the compose file and want to clean up its leftover container while you're at it, `down` can certainly do that.

But in many cases, the better option is:

```bash
docker compose up -d --remove-orphans
```

It cleans up orphaned containers just the same, without affecting the other services that are still running — usually the more convenient choice.

## Two Commands That Often Get Confused, While We're at It

### `docker compose restart`

`restart` merely restarts the processes inside the containers.

It does not apply any changes you've made to the compose file, nor does it swap in a new image. Running `restart` after editing your configuration accomplishes nothing.

What you should be running in that situation is:

```bash
docker compose up -d
```

### `docker compose stop` / `docker compose start`

`stop` / `start` simply stop and resume containers.

The containers themselves and the data inside them are preserved exactly as they were — the right fit for "switch it off for now, bring it back as-is later." That's also the biggest difference between them and `down`.

## Back to the Original Question

Habitually running `down` before `up -d` isn't wrong — it always lands you in a correct, fresh state.

It's just that most of the time, it's overkill: longer whole-stack downtime, a rebuilt network, and orphaned anonymous-volume data. And everything those costs buy you, `up -d` could have achieved with far less commotion.

A simple way to decide:

* Day-to-day config or image updates: use `docker compose pull && docker compose up -d`;
* Images built locally: use `docker compose up -d --build`;
* Changed top-level resources like networks, need a thorough cleanup, or plan to decommission the stack: that's when you reach for `down`.

---

References: this article is based primarily on the official Docker documentation, including the [docker compose up command reference](https://docs.docker.com/reference/cli/docker/compose/up/), the [docker compose down command reference](https://docs.docker.com/reference/cli/docker/compose/down/), and the section of the [Docker Compose quickstart](https://docs.docker.com/compose/gettingstarted/) on the data-persistence difference between `down` and `stop`.
