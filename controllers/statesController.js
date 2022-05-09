const State = require('../model/State');
const StateJson = require('../model/States.json')
const mergeDB = require('../middleware/mergeDB');

// returns all json states info
const getAllStates = async (req, res) => {
    const contig = req.query.contig;
    
    // All States Returned, No Contig
    if(contig === undefined)
    {
        const states = StateJson;
        if (!states) return res.status(204).json({ 'message': 'No states found' });
        const finalStates = await mergeDB(states);
        res.json(finalStates);
    }
    // Contig states
    else
    {
        if(contig === "true")
        {
            const contigList = StateJson.filter((state) => {
                if(state.code !== "AK" && state.code !== "HI")
                {
                    return state;
                }
            });
            res.json(contigList);
        }
        else
        {
            const contigList = StateJson.filter((state) => {
                if(state.code === "AK" || state.code === "HI")
                {
                    return state;
                }
            });
            res.json(contigList);
        }
    }
}

const deleteState = async (req, res) => {
    const index = req.body.index;
    const stateAbb = req.params.state.toUpperCase();
    const data = await State.findOne({ stateCode: stateAbb }).exec();
    if (!data || !index) {
        return res.status(204).json({ 'message': `State code ${stateAbb} not found` });
    }
    
    data.funfacts.splice(index - 1,1);

    await data.save();
    res.json(data);
}

const getState = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ "message": 'State Code required' });
    const stateAbb = req.params.state.toUpperCase();
    const st = StateJson.filter(obj => {
        return obj.code === stateAbb;
    });

    if (st.length === 0) {
        return res.json({ 'message': `Invalid state abbreviation parameter` });
    }
    const state = await mergeDB(st);

    res.json(state[0]);
}

const getStateProperty = async (req, res) => {
    // Remove everything but final word of URL
    const path1 = req.path.substring(req.path.indexOf("/") + 1);
    const path2 = path1.substring(path1.indexOf("/") + 1);
    const path3 = path2.toLowerCase();
    
    if (!req?.params?.state) return res.status(400).json({ "message": 'State Code required' });
    const stateAbb = req.params.state.toUpperCase();
    const st = StateJson.filter(obj => {
        return obj.code === stateAbb;
    });



    if (st.length === 0) {
        return res.json({ 'message': `Invalid state abbreviation parameter` });
    }

    const state = await mergeDB(st);

    let finalReq;
    switch (path3){
        case 'capital':
            finalReq = {state: state[0].state, capital: state[0].capital_city};
            break;
        case 'nickname':
            finalReq = {state: state[0].state, nickname: state[0].nickname};
            break;
        case 'population':
            const pop = state[0].population.toLocaleString("en-US");
            console.log(pop);
            finalReq = {state: state[0].state, population: pop};
            break;
        case 'admission':
            finalReq = {state: state[0].state, admitted: state[0].admission_date};
            break;
        case 'funfact':
            if(state[0].funfacts === undefined)
            {
                return res.json({ 'message': `No Fun Facts found for ${state[0].state}` });
            }
            else{
                // Random 0-9
                const random = Math.floor(Math.random() * (state[0].funfacts.length));
                finalReq = { funfact: state[0].funfacts[random]};
                // state: state[0].state,
            }
            break;
        default:
    }
    res.json(finalReq);
}

const updateFact = async (req, res) => {
    const index = req.body.index;
    const fact = req.body.funfact;
    const stateAbb = req.params.state.toUpperCase();
    const data = await State.findOne({ stateCode: stateAbb }).exec();
    if(!index || !fact) return res.status(204).json({ 'message': 'No fact or index' });
    
    data.funfacts[index - 1] = fact;
    await data.save();

    res.json(data);
}

const testCall = (req, res) => {
    console.log("Test Call Worked");
}

module.exports = {
    getAllStates,
    deleteState,
    getState,
    testCall,
    getStateProperty,
    updateFact
}