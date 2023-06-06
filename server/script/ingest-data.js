import {UnstructuredLoader} from "langchain/document_loaders/fs/unstructured";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {PineconeClient} from "@pinecone-database/pinecone";
import {PineconeStore} from "langchain/vectorstores/pinecone";
import * as dotenv from "dotenv";

dotenv.config({
    path: '../../.env'
})

const loader = new UnstructuredLoader("../source/vue3-document-en.md");
//
const rawDocs = await loader.load();
// console.log(rawDocs)

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const docs = await splitter.splitDocuments(rawDocs);
// console.log(docs)

const embeddings = new OpenAIEmbeddings();

const client = new PineconeClient();
await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
});

const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

console.log(process.env.PINECONE_INDEX)
try {
    await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex,
        textKey: "text",
        namespace: "test",
    });
} catch (error) {
    console.log(error);
}
