const { database } = require("./db");
const express = require("express");

async function check_time_off(start, end, id){
    
    const records = await database.query("SELECT * FROM time_off WHERE worker = $1;", [id]);

    for(i = 0; i < records.rows.length; i++){
        const time_start = records.rows[i].start_time;
        const time_end = records.rows[i].end_time;

        let start_between = start.isAfter(time_start) && start.isBefore(time_end);
        let end_between = end.isBefore(time_end) && end.isAfter(time_start);

        if(start_between && end_between){
            return {
                status : 400,
                available : 200,
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
