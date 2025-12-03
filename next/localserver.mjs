import { createServer } from "node:http"
import serveHandler from "serve-handler"

const server = createServer((req, res) =>
  serveHandler(req, res, {
    public: "dist/public/", // folder of files to serve
  }),
)

server.listen({ port: 3000 }, () => {
  const { port } = server.address()
  console.info(`Server is running on http://localhost:${port}`)
})

process.on("SIGINT", () => {
  server.close(() => process.exit(0))
})
