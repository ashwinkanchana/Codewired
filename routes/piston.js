import express from 'express';
const router = express.Router()
import piston from 'piston-client';
import _ from 'lodash';

const client = piston({ server: 'https://emkc.org' });
import runtimes from '../config/runtimes.json' assert {type: "json"};

router.get('/runtimes', async (req, res) => {
    const runtimes = await client.runtimes();
    res.send(runtimes)
})

router.post('/execute', async (req, res)=>{
    console.log(req.body)
    const {code, language, stdin} = req.body
    console.log(code, language, stdin)
    const version = _.find(runtimes, { language }).version

    const result = await client.execute({
        "language": language,
        "version": version,
        "files": [{
            "content": code
        }],
        "stdin": stdin
    });
    res.send(result.run)
})

export default router