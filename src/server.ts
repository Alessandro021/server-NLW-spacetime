import "dotenv/config"
import fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import multipart from "@fastify/multipart"

import { memoriesRoutes } from "./routes/memories"
import { authRoutes } from "./routes/auth"
import { uploadRoutes } from "./routes/upload"
import { resolve } from "node:path"

const app = fastify()

app.register(multipart)

app.register(require("@fastify/static"), { //DEIXA A PASTA DE UPLOADS PUBLICA PARA QUE AS IMAGEN POSSAM SER ACESSADAS
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
})

app.register(cors, {
  origin: true, //TODAS AS URLS PODEM ACESSAR ESSE BACKEND
})

app.register(jwt, {
  secret: "spacetime",
})

app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`🚀 servidor rodando na porta 3333`)
  })
  .catch((error) => {
    console.log(`❌ error: ${error.message}`)
  })
