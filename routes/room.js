import express from 'express';
var router = express.Router()
import _ from 'lodash';


router.get('/runtimes', async (req, res) => {
    const runtimes = await client.runtimes();
    res.send(runtimes)
})

router.post('/create', async (req, res) => {
    try {

        const { roomName, password, userName } = req.body;
        if (workspaceCreds[roomName] != null) {
            // if workspace exists, user should login instead
            res.sendStatus(400);
        } else {
            // add the workspace
            workspaceCreds[roomName] = {}
            workspaceCreds[roomName]['password'] = password;
            workspaceCreds[roomName]['members'] = {};
            // add this user to the object of members
            workspaceCreds[roomName]['members'][userName] = userName; // will add uniquely
            res.status(201).json({ members: workspaceCreds[roomName]['members'] });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
        logger.error(`${req.method} ${req.url} - ${error.message}`);
    }
})

export default router