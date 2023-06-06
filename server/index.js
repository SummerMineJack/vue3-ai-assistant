import Koa from "koa";
import Router from "koa-router";
import {koaBody} from "koa-body";
import {chat} from "./chat.js";

const app = new Koa();

app.use(
    koaBody({
        multipart: true,

    },)
);

const router = new Router();
router.post("/chat", async (ctx) => {
    console.log(ctx)
    const data = await chat(ctx);
    ctx.body = {
        data,
        state: 1,
    };
});
app.use(router.routes());

app.listen(10801, () => {
    console.log("open server localhost:10801");
});
