const StateMon = require('../model/State');

const handleStatePost = async (req, res) => {
    const stateAbb = req.params.state.toUpperCase();
    const fact = req.body.funfacts;
    
    if (!fact) return res.status(400).json({ 'message': 'State fun facts value required' });
    if(!Array.isArray(fact))
    {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }
    // check for duplicate usernames in the db
    const existing = await StateMon.findOne({ stateCode: stateAbb }).exec();
    
    if (existing) 
    {   
        const updated = existing.funfacts.concat(fact);
        existing.funfacts = updated;
        
        await existing.save();
        res.status(201).json(existing);
    }
    else{
        try 
        {
            //create and store the new user
            const result = await StateMon.create({
            "stateCode": stateAbb,
            "funfacts": fact
            });

            res.status(201).json({ 'success': `New State ${stateAbb} created!` });
        } catch (err) 
        {
            res.status(500).json({ 'message': err.message });
        }
    }
}

module.exports = { handleStatePost };
