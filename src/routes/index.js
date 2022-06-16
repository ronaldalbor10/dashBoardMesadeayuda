const express = require('express');
const router = express.Router();

const fs = require('fs');

const path = require('path');

const helpers = require('../lib/helpers');

const pool = require('../config/conexiondb');

const { isLoggedIn,noNeedSeeIfyouLogIn } = require('../lib/auth');

const verifyToken = require('../lib/verifyToken');
const { render } = require('timeago.js');


//,verifyToken
router.get("/",isLoggedIn,async(req, res)=>{

    const user = req.user;
    //console.log(user);
    let staff_id = user.staff_id;
    let agentes = [];
    let agente = "";
    let fecha1 = "";
    let fecha2 = "";
    if(user.isadmin == 1){
        
        staff_id = 0;
        agentes = await helpers.listaAgentes(user.dept_id);
        
    }
    //console.log(agentes);
    let ticketsOpen = await helpers.countTickets('open',11,staff_id);
    let ticketClose = await helpers.countTickets('closed',11,staff_id);

    console.log(ticketsOpen,ticketClose);

    let counterTickets = [{'TotalTickets':(ticketsOpen[0].cntTicket + ticketClose[0].cntTicket),
                           'TicketsOpen' :ticketsOpen[0].cntTicket,
                           'TicketsOverdue': ticketsOpen[0].cntTicketFT,
                           'TicketsClosed':ticketClose[0].cntTicket}];
    //console.log(counterTickets);

    let InfoPieChart = await helpers.getInfoPieChart('ticketxservicio','',staff_id);

    


    res.render('index',{agentes,counterTickets,agente, fecha1,fecha2, InfoPieChart:JSON.stringify(InfoPieChart)});
});

router.post("/",isLoggedIn,async(req, res)=>{

    const user = req.user;
    const {fecha1, fecha2, agente=""} = req.body;
    //console.log(req.body);
    let staff_id = user.staff_id;
    let agentes = [];
    if(user.isadmin == 1){
        staff_id = 0;
        if(agente!=""){
            staff_id = agente;
        }
        
        agentes = await helpers.listaAgentes(user.dept_id);        
    }
    //console.log(agentes);
    let ticketsOpen = await helpers.countTickets('open',11,staff_id,fecha1,fecha2);
    let ticketClose = await helpers.countTickets('closed',11,staff_id,fecha1,fecha2);

    //console.log(ticketsOpen,ticketClose);

    let counterTickets = [{'TotalTickets':(ticketsOpen[0].cntTicket + ticketClose[0].cntTicket),
                           'TicketsOpen' :ticketsOpen[0].cntTicket,
                           'TicketsOverdue': ticketsOpen[0].cntTicketFT,
                           'TicketsClosed':ticketClose[0].cntTicket}];

    //console.log(counterTickets);

    let InfoPieChart = await helpers.getInfoPieChart('ticketxservicio','',staff_id,fecha1,fecha2);


    res.render('index',{agentes,counterTickets,agente,fecha1,fecha2,InfoPieChart:JSON.stringify(InfoPieChart)});
});
module.exports = router;