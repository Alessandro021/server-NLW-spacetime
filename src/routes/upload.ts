import { randomUUID } from "node:crypto";
import { extname, resolve } from "node:path";
import { FastifyInstance } from "fastify";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import console from "node:console";
// import multer from "multer"

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance){
  app.post("/upload", async(request, reply) => {
    

    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, //5MB
      },
    })


   
      
    if(!upload){
      return reply.code(401).send()
    }

    // console.log(upload)
    // return reply.code(200).send("teste")

    const mimetypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimetypeRegex.test(upload.mimetype)
    

    if(!isValidFileFormat){
      return reply.code(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(upload.fieldname)

    const fileName = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, "../../uploads/", fileName)
    )
    
    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat("://").concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return {fileUrl}
  })
}