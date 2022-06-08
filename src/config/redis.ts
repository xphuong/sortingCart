
import * as redis from 'redis';
import connectRedis from 'connect-redis';
import session from 'express-session';
import axios from "axios";


const RedisStore = connectRedis(session);


const getOrSetCache=function(key:any,cb:Function,client:any){
    return new Promise((resolve,reject)=>{
        client.get(key, async(err:any,result:any)=>{
            if(err) return reject(err);
            if(result!=null) {
                console.log(result)
                return resolve(JSON.parse(result))
            }
            const freshData = await cb();
            console.log(freshData)
            await client.setEx(key,3600, JSON.stringify(freshData))
            resolve(freshData);
        })
    })
}

// function getData(key : any, client: any) {
//     return client.get(key, function(err: any, result: any) {
//         if(err) return console.log('undefined')
//         console.log("Get key from redis - ", result.toString());
//         return result.toString();
//     });
// }

    //Redis
    // const redisClient = redis.createClient({
    //     legacyMode: true
    // })
    // app.use(
    //     session({
    //         secret: 'secret',
    //         store: new RedisStore({host: "localhost", port: 6379, client: redisClient}),
    //         resave: false,
    //         saveUninitialized: false
    //     })
    // );
    // redisClient.connect()
    // app.get('/chinh', async (req, res)=> {
    //     const value = await getOrSetCache('admin1', async ()=>{
    //         const {data} = await axios.get('https://jsonplaceholder.typicode.com/posts/1')
    //         return data
    //     }, redisClient)
    //     res.json(value)
    // })