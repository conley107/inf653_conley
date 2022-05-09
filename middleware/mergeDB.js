const StateMon = require('../model/State');

const attachFacts = async (statesArr) => {
    const mongoStates = await StateMon.find({});

    mongoStates.forEach((st) =>{
        statesArr.forEach((jsonSt) => {
            if(st.stateCode === jsonSt.code)
            {
                jsonSt.funfacts = st.funfacts;
            }
        });
    });
    return statesArr;
}
//Testing Github
module.exports = attachFacts;