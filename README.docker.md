# Docker Setup

Dieses Setup repliziert die Vercel-Umgebung lokal für Testing.

## Ressourcen-Konfiguration

Jeder Service ist konfiguriert mit:

- **4 vCPUs**
- **8 GB Memory**
- **~23 GB Disk space** (durch Docker Volume)

## Verwendung

### Alle Services starten

```bash
docker-compose up -d
```

### Einzelnen Service starten

```bash
docker-compose up -d vite-rsc
docker-compose up -d waku
docker-compose up -d next
```

### Services neu bauen

```bash
docker-compose build
# oder für einen spezifischen Service
docker-compose build vite-rsc
```

### Logs ansehen

```bash
docker-compose logs -f
# oder für einen spezifischen Service
docker-compose logs -f vite-rsc
```

### Services stoppen

```bash
docker-compose down
```

### Alles stoppen und Volumes löschen

```bash
docker-compose down -v
```

## Ports

- **vite-rsc**: http://localhost:3000
- **waku**: http://localhost:3001
- **next**: http://localhost:3002

## Shared Content

Der `shared/content` Ordner wird als read-only Volume in alle Container gemountet.
Änderungen am Content erfordern einen Container-Neustart:

```bash
docker-compose restart vite-rsc
```

## Development vs Production

Die Docker-Konfiguration läuft im Production-Modus. Für Development verwende die normalen npm/pnpm-Scripts.

## Troubleshooting

### Container startet nicht

```bash
docker-compose logs [service-name]
```

### Build-Fehler

```bash
docker-compose build --no-cache [service-name]
```

### Ressourcen überprüfen

```bash
docker stats
```
