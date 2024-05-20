const { database } = require("./db");
const validator = require('validator');

async function check_time_off(start, end, id){
    
    const records = await database.query("SELECT * FROM time_off WHERE worker = $1;", [id]);

    for(i = 0; i < records.rows.length; i++){
        const time_start = records.rows[i].start_time.toString();
        const time_end = records.rows[i].end_time.toString();

        let start_between = validator.isAfter(time_start, start) && validator.isBefore(time_end, start);
        let end_between = validator.isBefore(time_end, end) && validator.isAfter(time_start, end);

        if(start_between && end_between){
            return {
                status : 400,
                available : false,
                message : "You have already requested time off during this time period",
                reason : records.rows[i].reason,
                time_period: `Between ${time_start} and ${time_end}`
            };
        };
    };

    return {
        status : 200,
        available : true
    };
};

exports.check_time_off = check_time_off
