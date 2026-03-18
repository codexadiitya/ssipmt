import { useState, useRef, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area, Cell
} from "recharts";
 
/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const USERS = [
  { id:1, role:"student", name:"Rahul Sharma",     email:"rahul@ssipmt.ac.in",  password:"student123", dept:"CSE", semester:5, section:"A", rollNo:"CSE21001", phone:"9876543210", dob:"2003-05-12", cgpa:8.4 },
  { id:2, role:"teacher", name:"Dr. Priya Verma",  email:"priya@ssipmt.ac.in",  password:"teacher123", dept:"CSE", subject:"Data Structures", phone:"9876500001" },
  { id:3, role:"hod",     name:"Prof. Anil Kumar", email:"hod@ssipmt.ac.in",    password:"hod123",     dept:"CSE", phone:"9876500002" },
  { id:4, role:"admin",   name:"Admin Portal",     email:"admin@ssipmt.ac.in",  password:"admin123" },
];
const SUBS = ["Data Structures","Operating Systems","DBMS","Computer Networks","Engineering Maths"];
const CC = ["#8b5cf6","#10b981","#f59e0b","#3b82f6","#f43f5e","#ec4899"];
const STUDENTS = [
  {rollNo:"CSE21001",name:"Rahul Sharma",   cgpa:8.4, section:"A"},
  {rollNo:"CSE21002",name:"Priya Patel",    cgpa:9.1, section:"A"},
  {rollNo:"CSE21003",name:"Amit Kumar",     cgpa:7.8, section:"A"},
  {rollNo:"CSE21004",name:"Sneha Verma",    cgpa:8.9, section:"B"},
  {rollNo:"CSE21005",name:"Ravi Singh",     cgpa:7.2, section:"B"},
  {rollNo:"CSE21006",name:"Anjali Gupta",   cgpa:8.6, section:"B"},
  {rollNo:"CSE21007",name:"Vikram Joshi",   cgpa:6.9, section:"C"},
  {rollNo:"CSE21008",name:"Nisha Tiwari",   cgpa:9.3, section:"C"},
  {rollNo:"CSE21009",name:"Saurabh Mishra", cgpa:7.5, section:"D"},
  {rollNo:"CSE21010",name:"Divya Yadav",    cgpa:8.0, section:"D"},
];
const INIT = {
  notices:[
    {id:1,title:"Mid-Semester Exam Schedule Released",body:"Exams from 15–22 March 2026. Carry valid ID card.",date:"2026-03-05",author:"HOD",cat:"Exam",imp:true},
    {id:2,title:"Annual Tech Fest — TechRoots 2026",body:"Register for Hackathon, Coding Contest, Robotics. Deadline: 10th March.",date:"2026-03-01",author:"Admin",cat:"Event",imp:false},
    {id:3,title:"Holiday — Holi (14th March)",body:"College closed on 14th March 2026.",date:"2026-03-02",author:"Admin",cat:"Holiday",imp:false},
    {id:4,title:"Industry Visit — Infosys Raipur",body:"Final year campus tour on 20th March. Report at 8 AM.",date:"2026-03-04",author:"Dr. Priya Verma",cat:"Event",imp:false},
  ],
  timetable:[
    {day:"Monday",    slots:[{sub:"Data Structures",time:"9:00 AM", room:"LH-1"},{sub:"OS",            time:"10:00 AM",room:"LH-2"},{sub:"BREAK",time:"11:00 AM"},{sub:"DBMS",           time:"12:00 PM",room:"LH-1"},{sub:"CN",      time:"2:00 PM", room:"LH-3"},{sub:"DS Lab",      time:"3:00 PM", room:"Lab-A"}]},
    {day:"Tuesday",   slots:[{sub:"CN",             time:"9:00 AM", room:"LH-2"},{sub:"Maths",        time:"10:00 AM",room:"LH-1"},{sub:"BREAK",time:"11:00 AM"},{sub:"Data Structures", time:"12:00 PM",room:"LH-1"},{sub:"OS",      time:"2:00 PM", room:"LH-2"},{sub:"FREE",        time:"3:00 PM"}]},
    {day:"Wednesday", slots:[{sub:"DBMS",           time:"9:00 AM", room:"LH-3"},{sub:"CN",           time:"10:00 AM",room:"LH-2"},{sub:"BREAK",time:"11:00 AM"},{sub:"Maths",           time:"12:00 PM",room:"LH-1"},{sub:"DBMS Lab",time:"2:00 PM", room:"Lab-B"},{sub:"DBMS Lab",    time:"3:00 PM", room:"Lab-B"}]},
    {day:"Thursday",  slots:[{sub:"OS",             time:"9:00 AM", room:"LH-2"},{sub:"Data Structures",time:"10:00 AM",room:"LH-1"},{sub:"BREAK",time:"11:00 AM"},{sub:"CN",             time:"12:00 PM",room:"LH-3"},{sub:"DBMS",    time:"2:00 PM", room:"LH-1"},{sub:"FREE",        time:"3:00 PM"}]},
    {day:"Friday",    slots:[{sub:"Maths",          time:"9:00 AM", room:"LH-1"},{sub:"DBMS",         time:"10:00 AM",room:"LH-3"},{sub:"BREAK",time:"11:00 AM"},{sub:"OS",              time:"12:00 PM",room:"LH-2"},{sub:"FREE",    time:"2:00 PM"},{sub:"FREE",        time:"3:00 PM"}]},
  ],
  attendance:{
    CSE21001:{
      "Data Structures":   {total:30,present:26,hist:[1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1]},
      "Operating Systems": {total:28,present:22,hist:[1,0,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1]},
      "DBMS":              {total:32,present:30,hist:[1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1]},
      "Computer Networks": {total:29,present:25,hist:[1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1]},
      "Engineering Maths": {total:25,present:20,hist:[1,0,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1]},
    }
  },
  marks:{
    CSE21001:[
      {sub:"Data Structures",  t1:18,t2:19,mid:44,asgn:9, mx:{t1:20,t2:20,mid:50,asgn:10}},
      {sub:"Operating Systems",t1:15,t2:17,mid:38,asgn:8, mx:{t1:20,t2:20,mid:50,asgn:10}},
      {sub:"DBMS",             t1:19,t2:18,mid:46,asgn:10,mx:{t1:20,t2:20,mid:50,asgn:10}},
      {sub:"Computer Networks",t1:16,t2:14,mid:35,asgn:7, mx:{t1:20,t2:20,mid:50,asgn:10}},
      {sub:"Engineering Maths",t1:17,t2:19,mid:40,asgn:8, mx:{t1:20,t2:20,mid:50,asgn:10}},
    ]
  },
  notes:[
    {id:1,title:"DS Unit 1 — Arrays & Linked List",       sub:"Data Structures",  by:"Dr. Priya Verma",date:"2026-02-20",type:"PDF",size:"2.4 MB",dl:142},
    {id:2,title:"OS Unit 2 — Process Scheduling",         sub:"Operating Systems",by:"Prof. S. Gupta",  date:"2026-02-22",type:"PDF",size:"1.8 MB",dl:98},
    {id:3,title:"DBMS Complete Notes — All Units",         sub:"DBMS",             by:"Dr. M. Singh",   date:"2026-03-01",type:"PDF",size:"5.2 MB",dl:231},
    {id:4,title:"CN Unit 3 — Transport Layer Protocols",  sub:"Computer Networks",by:"Prof. R. Sharma", date:"2026-03-03",type:"PPT",size:"3.1 MB",dl:87},
    {id:5,title:"Engineering Maths — Integration Notes",  sub:"Engineering Maths",by:"Dr. A. Patel",    date:"2026-03-05",type:"PDF",size:"1.2 MB",dl:55},
  ],
  pyqs:[
    {id:1,title:"Data Structures — May 2025",  sub:"Data Structures",  sem:5,year:2025},
    {id:2,title:"OS — Nov 2024",               sub:"Operating Systems",sem:5,year:2024},
    {id:3,title:"DBMS — May 2024",             sub:"DBMS",             sem:5,year:2024},
    {id:4,title:"CN — Nov 2023",               sub:"Computer Networks",sem:5,year:2023},
    {id:5,title:"Maths — May 2023",            sub:"Engineering Maths",sem:3,year:2023},
    {id:6,title:"Data Structures — Nov 2022",  sub:"Data Structures",  sem:5,year:2022},
  ],
  fees:{
    college:{bank:"State Bank of India",branch:"SSIPMT Branch",acc:"SSIPMT001234567",ifsc:"SBIN0007854",amt:85000,paid:"2026-01-15",status:"Paid"},
    hostel: {bank:"Bank of Baroda",acc:"SSIPMT-HOS-890",ifsc:"BARB0SSIPMT",amt:42000,paid:"2025-07-01",status:"Paid"},
    bus:    [{name:"Route 1 — Raipur City",fare:8000},{name:"Route 2 — Durg",fare:12000},{name:"Route 3 — Bhilai",fare:14000}],
  },
  todos:[
    {id:1,text:"Complete DS Assignment 3",sub:"Data Structures",due:"2026-03-10",done:false,pri:"high"},
    {id:2,text:"Read OS Chapter 5 — Virtual Memory",sub:"Operating Systems",due:"2026-03-12",done:false,pri:"medium"},
    {id:3,text:"Practice SQL queries for DBMS lab",sub:"DBMS",due:"2026-03-08",done:true,pri:"low"},
    {id:4,text:"Revise CN Transport Layer",sub:"Computer Networks",due:"2026-03-15",done:false,pri:"high"},
  ],
  students: STUDENTS,
  subjects: [...SUBS],
  users: [...USERS],
  collegeInfo: { name:"SSIPMT", address:"Raipur, Chhattisgarh", phone:"0771-2443311", email:"info@ssipmt.ac.in", principal:"Dr. R.K. Sharma", established:"1999", university:"CSVTU Bhilai", examDates:"March 15-22, 2026", academicYear:"2025-2026", departments:"CSE, IT, ECE, ME, Civil, MBA" },
};
 
/* ═══════════════════════════════════════════
   ICONS
═══════════════════════════════════════════ */
const IC = {
  home:    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  calendar:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  bell:    "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.003 6.003 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  book:    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  check:   "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  chart:   "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  folder:  "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
  credit:  "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  globe:   "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  users:   "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  upload:  "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  logout:  "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  plus:    "M12 4v16m8-8H4",
  shield:  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  download:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  x:       "M6 18L18 6M6 6l12 12",
  menu:    "M4 6h16M4 12h16M4 18h16",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  trash:   "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  eye:     "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  task:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  profile: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  sparkle: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  fire:    "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
  award:   "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
};
const Ico = ({n,s=20,col="currentColor"}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{flexShrink:0,display:"block"}}>
    {IC[n] && <path d={IC[n]}/>}
  </svg>
);
 
/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
const pct  = (a,b) => Math.round((a/b)*100);
const now  = () => new Date().toISOString().slice(0,10);
const gcol = p => p>=75 ? "#10b981" : p>=60 ? "#f59e0b" : "#f43f5e";
 
/* ═══════════════════════════════════════════
   CSS
═══════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fustat:wght@300;400;500;600;700;800;900&display=swap');
html,body,#root{height:100%;margin:0;padding:0}
*{box-sizing:border-box;-webkit-font-smoothing:antialiased}
:root{
  --bg:#f4f5fb;
  --w:#ffffff;
  --bdr:#eceef7;
  --P:#8b5cf6;
  --PL:#ede9fe;
  --PM:#c4b5fd;
  --G:#10b981;
  --GL:#d1fae5;
  --O:#f59e0b;
  --OL:#fef3c7;
  --R:#f43f5e;
  --RL:#ffe4e6;
  --B:#3b82f6;
  --BL:#dbeafe;
  --T:#1e1b4b;
  --T2:#6b7280;
  --T3:#9ca3af;
  --sh:0 2px 12px rgba(139,92,246,.07);
  --sh2:0 6px 28px rgba(139,92,246,.14);
}
body{font-family:'Fustat',sans-serif;background:var(--bg);color:var(--T);min-height:100vh}
button,input,select,textarea{font-family:'Fustat',sans-serif;color:var(--T)}
a{color:inherit;text-decoration:none}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-thumb{background:var(--PM);border-radius:4px}
::-webkit-scrollbar-track{background:var(--bdr)}
 
/* ── LAYOUT ── */
.app{display:flex;min-height:100vh}
 
/* ── SIDEBAR ── */
.sb{
  width:242px;min-width:242px;background:var(--w);
  border-right:1.5px solid var(--bdr);
  display:flex;flex-direction:column;
  height:100vh;position:sticky;top:0;overflow-y:auto;
  flex-shrink:0;transition:width .22s;
  box-shadow:2px 0 16px rgba(139,92,246,.05);
}
.sb.thin{width:64px;min-width:64px}
.sb-logo{padding:20px 16px 14px;border-bottom:1.5px solid var(--bdr);display:flex;align-items:center;gap:11px;overflow:hidden}
.lico{width:38px;height:38px;min-width:38px;border-radius:11px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:17px;color:#fff;flex-shrink:0;box-shadow:0 4px 14px rgba(139,92,246,.38)}
.lname{font-weight:800;font-size:15px;color:var(--P);white-space:nowrap;line-height:1.2}
.lsub{font-size:10px;color:var(--T3);white-space:nowrap}
.sb-user{padding:12px 16px;border-bottom:1.5px solid var(--bdr);display:flex;align-items:center;gap:10px;overflow:hidden;background:var(--PL)}
.av{width:34px;height:34px;min-width:34px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#7c3aed);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;flex-shrink:0}
.uname{font-weight:700;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.urole{font-size:10px;color:var(--T2);margin-top:1px;white-space:nowrap}
.sb-nav{flex:1;padding:8px 0;overflow-y:auto}
.sb-sec{padding:10px 16px 4px;font-size:9px;font-weight:800;color:var(--T3);letter-spacing:1.8px;text-transform:uppercase;white-space:nowrap;overflow:hidden}
.sbi{
  display:flex;align-items:center;gap:10px;
  padding:9px 16px;color:var(--T2);font-size:13px;font-weight:500;
  cursor:pointer;transition:all .22s cubic-bezier(.22,1,.36,1);
  border-left:3px solid transparent;white-space:nowrap;overflow:hidden;position:relative;
}
.sbi:hover{color:var(--P);background:var(--PL);padding-left:20px}
.sbi.on{color:var(--P);background:var(--PL);border-left-color:var(--P);font-weight:700;padding-left:20px}
.sbi .dot{width:6px;height:6px;border-radius:50%;background:var(--R);position:absolute;top:8px;left:25px;border:1.5px solid var(--w)}
.sb-foot{padding:12px 16px;border-top:1.5px solid var(--bdr)}
.sbtn{width:100%;display:flex;align-items:center;gap:8px;background:none;border:none;color:var(--T2);font-size:12px;font-weight:600;padding:6px 0;cursor:pointer;transition:.14s}
.sbtn:hover{color:var(--P)}
 
/* ── MAIN ── */
.main{flex:1;display:flex;flex-direction:column;min-width:0;overflow-x:hidden;background:var(--bg)}
 
/* ── TOPBAR ── */
.tb{
  height:56px;min-height:56px;background:var(--w);
  border-bottom:1.5px solid var(--bdr);
  padding:0 22px;display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;z-index:30;box-shadow:0 2px 10px rgba(139,92,246,.06);
}
.tb-l{display:flex;align-items:center;gap:12px}
.tb-title{font-weight:800;font-size:16px;color:var(--T);transition:all .2s}
.tb-sub{font-size:11px;color:var(--T3);margin-top:1px;transition:all .2s}
.tb-r{display:flex;align-items:center;gap:8px}
.ib{width:36px;height:36px;border-radius:10px;background:var(--bg);border:1.5px solid var(--bdr);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.14s;position:relative;flex-shrink:0}
.ib:hover{border-color:var(--P);color:var(--P);background:var(--PL)}
.nb{position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:var(--R);color:#fff;font-size:8px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid var(--w)}
.ham{display:none;background:none;border:none;cursor:pointer;padding:4px;color:var(--T)}
.sbar{display:flex;align-items:center;gap:8px;background:var(--bg);border:1.5px solid var(--bdr);border-radius:10px;padding:0 13px;height:36px;min-width:160px;cursor:text;transition:.14s}
.sbar:hover{border-color:var(--P);background:var(--PL)}
.sbar span{font-size:12px;color:var(--T3)}
 
/* ── PAGE ── */
.page{padding:20px 22px;flex:1}
 
/* ── CARD ── */
.card{background:var(--w);border:1.5px solid var(--bdr);border-radius:16px;padding:18px;box-shadow:var(--sh);transition:box-shadow .25s,border-color .25s}
.card:hover{box-shadow:var(--sh2)}
.ct{font-weight:800;font-size:14px;color:var(--T);display:flex;align-items:center;gap:8px;margin-bottom:14px}
 
/* ── STAT GRID ── */
.sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(152px,1fr));gap:12px;margin-bottom:18px}
.st{background:var(--w);border:1.5px solid var(--bdr);border-radius:16px;padding:16px 14px;cursor:pointer;transition:all .28s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden;box-shadow:var(--sh)}
.st:hover{transform:translateY(-4px) scale(1.01);box-shadow:var(--sh2);border-color:var(--PM)}
.st:active{transform:translateY(-1px) scale(.99)}
.st-ic{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:10px}
.st-n{font-weight:900;font-size:26px;line-height:1;margin-bottom:3px}
.st-l{font-size:11px;color:var(--T2);font-weight:600;margin-top:2px}
.st-s{font-size:10px;color:var(--T3);margin-top:5px}
.st-tr{font-size:10px;font-weight:700;margin-top:4px}
.tu{color:var(--G)}.td{color:var(--R)}
 
/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:10px;font-size:13px;font-weight:700;border:none;cursor:pointer;transition:all .2s cubic-bezier(.22,1,.36,1);white-space:nowrap}
.btn:active{transform:scale(.96)!important}
.btn-xs{padding:5px 10px;font-size:11px;border-radius:8px;gap:4px}
.btn-sm{padding:7px 13px;font-size:12px}
.btn-p{background:var(--P);color:#fff;box-shadow:0 4px 14px rgba(139,92,246,.3)}
.btn-p:hover{background:#7c3aed;transform:translateY(-2px);box-shadow:0 8px 24px rgba(139,92,246,.42)}
.btn-g{background:var(--G);color:#fff;box-shadow:0 4px 12px rgba(16,185,129,.25)}
.btn-g:hover{background:#059669;transform:translateY(-2px);box-shadow:0 8px 20px rgba(16,185,129,.35)}
.btn-l{background:var(--PL);color:var(--P);border:1.5px solid var(--PM);transition:all .2s}
.btn-l:hover{background:#ddd6fe;transform:translateY(-1px)}
.btn-gh{background:var(--bg);border:1.5px solid var(--bdr);color:var(--T2);transition:all .2s}
.btn-gh:hover{border-color:var(--P);color:var(--P);background:var(--PL)}
.btn-d{background:var(--RL);color:var(--R);border:1.5px solid #fda4af;transition:all .2s}
.btn-d:hover{background:#fecdd3;transform:translateY(-1px)}
 
/* ── INPUTS ── */
.fld{margin-bottom:14px}
.lbl{display:block;font-size:11px;font-weight:700;color:var(--T2);margin-bottom:5px;letter-spacing:.3px;text-transform:uppercase}
.inp{width:100%;background:var(--bg);border:1.5px solid var(--bdr);border-radius:10px;padding:9px 13px;color:var(--T);font-size:13px;outline:none;transition:all .22s cubic-bezier(.22,1,.36,1);font-weight:500}
.inp::placeholder{color:var(--T3);font-weight:400}
.inp:focus{border-color:var(--P);background:var(--PL);box-shadow:0 0 0 4px rgba(139,92,246,.12);transform:translateY(-1px)}
select.inp option{background:var(--w)}
textarea.inp{resize:vertical;min-height:76px}
 
/* ── BADGES ── */
.bd{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:800}
.bp{background:var(--PL);color:var(--P)}
.bg{background:var(--GL);color:var(--G)}
.by{background:var(--OL);color:var(--O)}
.br{background:var(--RL);color:var(--R)}
.bb{background:var(--BL);color:var(--B)}
.bz{background:#f3f4f6;color:var(--T2)}
 
/* ── PROGRESS ── */
.pb{background:#f3f4f6;border-radius:20px;height:7px;overflow:hidden}
.pf{height:100%;border-radius:20px;transition:width 1s cubic-bezier(.22,1,.36,1)}
.pp{background:linear-gradient(90deg,#8b5cf6,#7c3aed)}
.pg{background:linear-gradient(90deg,#10b981,#059669)}
.pr{background:linear-gradient(90deg,#f43f5e,#e11d48)}
.py{background:linear-gradient(90deg,#f59e0b,#d97706)}
 
/* ── TABLE ── */
.tw{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
th{background:#f8f7ff;color:var(--T2);font-weight:700;padding:10px 13px;text-align:left;border-bottom:1.5px solid var(--bdr);font-size:11px;letter-spacing:.5px;text-transform:uppercase;white-space:nowrap}
td{padding:11px 13px;border-bottom:1px solid var(--bdr);vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#f8f7ff}
 
/* ── NOTICE CARDS ── */
.nc{background:var(--w);border:1.5px solid var(--bdr);border-radius:12px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all .25s cubic-bezier(.22,1,.36,1);border-left:4px solid var(--bdr)}
.nc:hover{box-shadow:var(--sh2);transform:translateX(4px);border-color:var(--PM)}
.nc.exam{border-left-color:var(--R)}.nc.event{border-left-color:var(--P)}.nc.holiday{border-left-color:var(--O)}.nc.general{border-left-color:var(--G)}
.nc-body{padding-top:11px;margin-top:10px;border-top:1px solid var(--bdr);font-size:13px;color:var(--T2);line-height:1.7;animation:fu .22s cubic-bezier(.22,1,.36,1) forwards}
 
/* ── TABS ── */
.tabs{display:flex;gap:4px;background:var(--bg);border:1.5px solid var(--bdr);border-radius:12px;padding:4px;margin-bottom:18px;overflow-x:auto}
.tab{padding:7px 15px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;color:var(--T2);border:none;background:none;white-space:nowrap;transition:all .2s cubic-bezier(.22,1,.36,1)}
.tab.on{background:var(--P);color:#fff;box-shadow:0 2px 10px rgba(139,92,246,.3);transform:scale(1.02)}
.tab:hover:not(.on){color:var(--P);background:var(--PL)}
 
/* ── ALERTS ── */
.al{padding:11px 14px;border-radius:10px;font-size:13px;margin-bottom:12px;border:1.5px solid;display:flex;align-items:center;gap:8px;font-weight:500}
.al-s{background:var(--GL);border-color:#6ee7b7;color:#065f46}
.al-e{background:var(--RL);border-color:#fda4af;color:#881337}
.al-i{background:var(--PL);border-color:var(--PM);color:#5b21b6}
.al-w{background:var(--OL);border-color:#fcd34d;color:#92400e}
 
/* ── TIMETABLE SLOT ── */
.tsl{padding:12px 14px;border-radius:12px;margin-bottom:8px;transition:all .25s cubic-bezier(.22,1,.36,1);border:1.5px solid var(--bdr);background:var(--w);box-shadow:var(--sh)}
.tsl:hover{transform:translateX(5px);border-color:var(--PM);box-shadow:var(--sh2)}
.tsl-brk{background:var(--OL);border-color:#fcd34d;box-shadow:none}
.tsl-free{background:var(--bg);border-color:var(--bdr);opacity:.6;box-shadow:none}
 
/* ── ATT TOGGLE ── */
.atg{display:flex;border-radius:8px;overflow:hidden;border:1.5px solid var(--bdr)}
.atb{padding:5px 13px;font-size:11px;font-weight:800;border:none;cursor:pointer;background:transparent;color:var(--T2);transition:.12s}
.atb.P{background:var(--GL);color:var(--G)}
.atb.A{background:var(--RL);color:var(--R)}
 
/* ── AI DROP ZONE ── */
.dz{border:2px dashed var(--PM);border-radius:14px;padding:36px;text-align:center;cursor:pointer;transition:.15s;background:var(--PL)}
.dz:hover{border-color:var(--P);background:#ddd6fe}
 
/* ── TODO ── */
.tod{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:12px;background:var(--w);border:1.5px solid var(--bdr);margin-bottom:8px;transition:all .25s cubic-bezier(.22,1,.36,1);box-shadow:var(--sh)}
.tod:hover{border-color:var(--PM);box-shadow:var(--sh2);transform:translateY(-2px)}
.tod.dn{opacity:.4;transform:none}
.tck{width:20px;height:20px;border-radius:50%;border:2px solid var(--bdr);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .22s cubic-bezier(.22,1,.36,1);flex-shrink:0}
.tck:hover{border-color:var(--G);transform:scale(1.15)}
.tck.ok{background:var(--G);border-color:var(--G);animation:pop .3s cubic-bezier(.22,1,.36,1)}
 
/* ── PROFILE ── */
.pcov{height:100px;border-radius:14px 14px 0 0;background:linear-gradient(135deg,#8b5cf6,#6d28d9);position:relative;overflow:hidden}
.pcov::after{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 30% 50%,rgba(255,255,255,.08) 0%,transparent 60%)}
.pav{width:68px;height:68px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#7c3aed);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:26px;color:#fff;border:4px solid var(--w);position:absolute;bottom:-34px;left:20px;box-shadow:0 4px 16px rgba(139,92,246,.35)}
.ig{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.ii{background:var(--bg);border:1.5px solid var(--bdr);border-radius:10px;padding:12px}
.ii label{font-size:10px;color:var(--T2);font-weight:800;letter-spacing:.5px;display:block;margin-bottom:4px;text-transform:uppercase}
.ii span{font-size:13px;font-weight:600}
 
/* ── MODAL ── */
.ov{position:fixed;inset:0;background:rgba(99,83,168,.22);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(6px);animation:fu .22s ease forwards}
.modal{background:var(--w);border:1.5px solid var(--bdr);border-radius:20px;padding:24px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(139,92,246,.2);animation:pop .32s cubic-bezier(.22,1,.36,1) forwards}
.mh{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.mt{font-weight:800;font-size:16px}
 
/* ── FEE ROW ── */
.fr{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(--bdr);font-size:13px}
.fr:last-child{border-bottom:none}
.qrb{width:108px;height:108px;border-radius:12px;background:var(--bg);border:1.5px solid var(--bdr);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:30px;margin:0 auto}
 
/* ── TOAST ── */
.toast{position:fixed;top:68px;right:18px;z-index:999;min-width:240px;max-width:320px;padding:12px 16px;border-radius:12px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;box-shadow:0 8px 28px rgba(0,0,0,.15);animation:toast-in .32s cubic-bezier(.22,1,.36,1) forwards;border:1.5px solid}
.toast-s{background:var(--GL);border-color:#6ee7b7;color:#065f46}
.toast-e{background:var(--RL);border-color:#fda4af;color:#881337}
.toast-i{background:var(--PL);border-color:var(--PM);color:#5b21b6}
.toast-w{background:var(--OL);border-color:#fcd34d;color:#92400e}
 
/* ── NOTIF PANEL ── */
.np{position:fixed;top:62px;right:14px;width:296px;background:var(--w);border:1.5px solid var(--bdr);border-radius:14px;box-shadow:0 16px 48px rgba(139,92,246,.18);z-index:60}
 
/* ── FLOATING NAV ── */
.bnav{
  display:none;position:fixed;bottom:18px;left:50%;transform:translateX(-50%);
  z-index:40;
  background:rgba(10,10,15,0.72);
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:999px;
  padding:6px 10px;
  box-shadow:0 8px 32px rgba(0,0,0,.5);
  width:max-content;
  max-width:calc(100vw - 32px);
}
.bni{
  display:flex;flex-direction:column;align-items:center;gap:2px;
  color:rgba(255,255,255,0.38);font-size:9px;font-weight:700;
  cursor:pointer;padding:7px 12px;border-radius:999px;
  transition:all .2s;letter-spacing:.4px;position:relative;white-space:nowrap
}
.bni:hover{color:rgba(255,255,255,0.65)}
.bni.on{background:rgba(139,92,246,0.85);color:#fff}
.bni.on svg{stroke:#fff!important}
.bni-dot{position:absolute;top:5px;right:9px;width:6px;height:6px;background:#f43f5e;border-radius:50%;border:1.5px solid rgba(10,10,15,0.8)}
 
/* ── GRID HELPERS ── */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.r{display:flex;align-items:center}
.jb{justify-content:space-between}.jc{justify-content:center}
.w{flex-wrap:wrap}
.g4{gap:4px}.g6{gap:6px}.g8{gap:8px}.g10{gap:10px}.g12{gap:12px}
.mt4{margin-top:4px}.mt6{margin-top:6px}.mt8{margin-top:8px}.mt12{margin-top:12px}.mt14{margin-top:14px}.mt16{margin-top:16px}.mt20{margin-top:20px}
.mb6{margin-bottom:6px}.mb8{margin-bottom:8px}.mb10{margin-bottom:10px}.mb12{margin-bottom:12px}.mb16{margin-bottom:16px}
.fw5{font-weight:500}.fw6{font-weight:600}.fw7{font-weight:700}.fw8{font-weight:800}
.f10{font-size:10px}.f11{font-size:11px}.f12{font-size:12px}.f13{font-size:13px}.f14{font-size:14px}.f16{font-size:16px}
.c2{color:var(--T2)}.c3{color:var(--T3)}
.cp{color:var(--P)}.cg{color:var(--G)}.cr{color:var(--R)}.cy{color:var(--O)}.cb{color:var(--B)}
.tc{text-align:center}
 
/* ── LOGIN ── */
.lw{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 35%,#f4f5fb 70%,#e0f2fe 100%);position:relative;overflow:hidden}
.lb1{position:absolute;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.14),transparent);top:-100px;right:-100px;pointer-events:none}
.lb2{position:absolute;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,.1),transparent);bottom:-70px;left:-70px;pointer-events:none}
.lcard{position:relative;background:rgba(255,255,255,.96);backdrop-filter:blur(20px);border:1.5px solid var(--bdr);border-radius:24px;padding:38px;width:420px;max-width:calc(100vw - 24px);box-shadow:0 20px 60px rgba(139,92,246,.14)}
.lic{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-weight:900;font-size:22px;color:#fff;box-shadow:0 8px 24px rgba(139,92,246,.35)}
.rg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px}
.rb{padding:11px;border:1.5px solid var(--bdr);border-radius:12px;background:transparent;color:var(--T2);font-size:12px;font-weight:700;cursor:pointer;transition:.15s;display:flex;flex-direction:column;align-items:center;gap:4px}
.rb:hover,.rb.sel{border-color:var(--P);color:var(--P);background:var(--PL)}
.rb .re{font-size:20px}
.demo{background:var(--PL);border:1.5px solid var(--PM);border-radius:10px;padding:10px 13px;margin-bottom:14px;cursor:pointer;transition:.15s}
.demo:hover{background:#ddd6fe}
 
/* ── DARK MODE ── */
.dark{
  --bg:#0f1117;
  --w:#1a1d27;
  --bdr:#2a2d3e;
  --P:#8b5cf6;
  --PL:#1e1a2e;
  --PM:#5b3fa0;
  --G:#10b981;
  --GL:#0d2b22;
  --O:#f59e0b;
  --OL:#2b2010;
  --R:#f43f5e;
  --RL:#2b1018;
  --B:#3b82f6;
  --BL:#0e1e3d;
  --T:#e8eaf6;
  --T2:#9ca3af;
  --T3:#6b7280;
  --sh:0 2px 12px rgba(0,0,0,.35);
  --sh2:0 6px 28px rgba(0,0,0,.45);
}
.dark body{background:var(--bg);color:var(--T)}
.dark th{background:#1e2235}
.dark tr:hover td{background:#1e2235}
.dark .lw{background:linear-gradient(135deg,#0f0e1a 0%,#1a1230 35%,#0f1117 70%,#0e1520 100%)}
.dark .lcard{background:rgba(26,29,39,.96);border-color:var(--bdr)}
.dark .pb{background:#1e2235}
.dark select.inp option{background:var(--w)}
.dark .recharts-default-tooltip{background:#1a1d27!important;border-color:#2a2d3e!important;color:#e8eaf6!important}
 
/* ── TOGGLE SWITCH ── */
.tog{width:44px;height:24px;border-radius:99px;border:none;cursor:pointer;position:relative;transition:background .22s;flex-shrink:0;padding:0}
.tog-day{background:#e0e7ff}
.tog-night{background:#312e81}
.tog-knob{width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:3px;transition:left .22s;display:flex;align-items:center;justify-content:center;font-size:11px;box-shadow:0 1px 4px rgba(0,0,0,.2)}
.tog-day .tog-knob{left:3px}
.tog-night .tog-knob{left:23px}
 
/* ── RECHARTS ── */
.recharts-default-tooltip{background:#fff!important;border:1.5px solid var(--bdr)!important;border-radius:10px!important;box-shadow:var(--sh2)!important;font-family:'Fustat',sans-serif!important;font-size:12px!important}
.recharts-tooltip-label{font-weight:700!important;color:var(--T)!important}
 
/* ── ANIMATIONS ── */
@keyframes toast-in{from{opacity:0;transform:translateX(60px) scale(.95)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes toast-out{from{opacity:1;transform:translateX(0) scale(1)}to{opacity:0;transform:translateX(60px) scale(.95)}}
@keyframes sl{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes sp{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes pop{0%{transform:scale(.94);opacity:0}60%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
.fu{animation:fu .32s cubic-bezier(.22,1,.36,1) forwards}
.stg>*{animation:fu .36s cubic-bezier(.22,1,.36,1) both}
.stg>*:nth-child(1){animation-delay:.04s}.stg>*:nth-child(2){animation-delay:.09s}
.stg>*:nth-child(3){animation-delay:.14s}.stg>*:nth-child(4){animation-delay:.19s}
.stg>*:nth-child(5){animation-delay:.24s}.stg>*:nth-child(6){animation-delay:.29s}
.ld{width:16px;height:16px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sp .8s linear infinite}
 
/* ── RESPONSIVE ── */
@media(max-width:900px){
  .sb{position:fixed;height:100vh;transform:translateX(-100%);z-index:50;transition:transform .22s;width:242px!important;min-width:242px!important}
  .sb.mob{transform:translateX(0)}
  .main{margin-left:0}
  .ham{display:flex}
  .g2,.g3{grid-template-columns:1fr}
  .sg{grid-template-columns:1fr 1fr}
  .page{padding:14px 14px 100px}
  .bnav{display:flex}
  .ig{grid-template-columns:1fr}
  .hide{display:none!important}
}
@media(max-width:500px){
  .sg{grid-template-columns:1fr 1fr}
  .lcard{padding:24px 16px}
}
`;
 
/* ═══════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════ */
function Login({onLogin}) {
  const [role,setRole]=useState("student");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const cr={student:["rahul@ssipmt.ac.in","student123"],teacher:["priya@ssipmt.ac.in","teacher123"],hod:["hod@ssipmt.ac.in","hod123"],admin:["admin@ssipmt.ac.in","admin123"]};
  const roles=[{id:"student",e:"🎓",l:"Student"},{id:"teacher",e:"👩‍🏫",l:"Teacher"},{id:"hod",e:"🏛️",l:"HOD"},{id:"admin",e:"⚙️",l:"Admin"}];
  const go=()=>{
    setLoading(true);
    setTimeout(()=>{
      const u=USERS.find(u=>u.email===email&&u.password===pass&&u.role===role);
      if(u){setErr("");onLogin(u);}else setErr("Wrong credentials — use the demo box above.");
      setLoading(false);
    },600);
  };
  return(
    <div className="lw">
      <div className="lb1"/><div className="lb2"/>
      <div className="lcard fu">
        <div className="lic">S</div>
        <div className="tc fw8 f16 mb8" style={{color:"var(--T)"}}>SSIPMT Academic Portal</div>
        <div className="tc c3 f11 mb16" style={{lineHeight:1.5}}>Shri Shankaracharya Institute of Professional<br/>Management & Technology, Raipur</div>
        <div className="rg">
          {roles.map(r=>(
            <button key={r.id} className={`rb${role===r.id?" sel":""}`} onClick={()=>{setRole(r.id);setEmail("");setPass("");}}>
              <span className="re">{r.e}</span>{r.l}
            </button>
          ))}
        </div>
        <div className="demo" onClick={()=>{setEmail(cr[role][0]);setPass(cr[role][1]);}}>
          <div className="f10 fw8 cp mb6">⚡ Demo — Click to auto-fill credentials</div>
          <div className="f11 c2">{cr[role][0]} · {cr[role][1]}</div>
        </div>
        {err&&<div className="al al-e mb8"><Ico n="x" s={13}/>{err}</div>}
        <div className="fld"><label className="lbl">Email</label>
          <input className="inp" type="email" placeholder="email@ssipmt.ac.in" value={email} onChange={e=>setEmail(e.target.value)}/>
        </div>
        <div className="fld"><label className="lbl">Password</label>
          <input className="inp" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>
        <button className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"10px",fontSize:14}} onClick={go} disabled={loading}>
          {loading?<><div className="ld"/>Signing in…</>:"Sign In →"}
        </button>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   NAV ITEMS
═══════════════════════════════════════════ */
const NAV={
  student:[
    {id:"dash",  l:"Dashboard",    n:"Home",     i:"home",    s:"Main"},
    {id:"prof",  l:"My Profile",   n:"Profile",  i:"profile", s:"Main"},
    {id:"tt",    l:"My Schedule",  n:"Schedule", i:"calendar",s:"Academic"},
    {id:"att",   l:"Attendance",   n:"Attend",   i:"check",   s:"Academic"},
    {id:"marks", l:"Marks & CGPA", n:"Marks",    i:"chart",   s:"Academic"},
    {id:"ntc",   l:"Notices",      n:"Notices",  i:"bell",    s:"Academic",dot:true},
    {id:"notes", l:"Study Notes",  n:"Notes",    i:"book",    s:"Resources"},
    {id:"pyq",   l:"PYQ Library",  n:"PYQs",     i:"folder",  s:"Resources"},
    {id:"ai",    l:"AI Predictor", n:"AI",       i:"sparkle", s:"Resources"},
    {id:"todo",  l:"Study Planner",n:"Planner",  i:"task",    s:"Tools"},
    {id:"fees",  l:"Fee Portal",   n:"Fees",     i:"credit",  s:"Tools"},
    {id:"links", l:"Portals",      n:"Portals",  i:"globe",   s:"Tools"},
  ],
  teacher:[
    {id:"dash",   l:"Dashboard",       n:"Home",     i:"home",  s:"Main"},
    {id:"t_att",  l:"Take Attendance", n:"Attend",   i:"check", s:"Teaching"},
    {id:"t_notes",l:"Upload Notes",    n:"Notes",    i:"upload",s:"Teaching"},
    {id:"t_marks",l:"Update Marks",    n:"Marks",    i:"chart", s:"Teaching"},
    {id:"t_ntc",  l:"Post Notice",     n:"Notice",   i:"bell",  s:"Teaching"},
    {id:"ntc",    l:"View Notices",    n:"View",     i:"eye",   s:"Teaching"},
    {id:"t_anly", l:"Analytics",       n:"Analytics",i:"fire",  s:"Analytics"},
  ],
  hod:[
    {id:"dash",   l:"Dashboard",      n:"Home",    i:"home",  s:"Main"},
    {id:"h_att",  l:"Attendance",     n:"Attend",  i:"check", s:"Overview"},
    {id:"h_marks",l:"Marks Overview", n:"Marks",   i:"chart", s:"Overview"},
    {id:"t_ntc",  l:"Post Notice",    n:"Notice",  i:"bell",  s:"Overview"},
    {id:"ntc",    l:"View Notices",   n:"Notices", i:"eye",   s:"Overview"},
  ],
  admin:[
    {id:"dash",  l:"Dashboard",  n:"Home",    i:"home",    s:"Main"},
    {id:"a_ntc", l:"Notices",    n:"Notices", i:"bell",    s:"Content"},
    {id:"a_nts", l:"Notes",      n:"Notes",   i:"book",    s:"Content"},
    {id:"a_pyq", l:"PYQs",       n:"PYQs",    i:"folder",  s:"Content"},
    {id:"a_tt",  l:"Timetable",  n:"Timetable",i:"calendar",s:"Content"},
    {id:"a_fee", l:"Fees",       n:"Fees",    i:"credit",  s:"Content"},
    {id:"a_stu", l:"Students",   n:"Students",i:"users",   s:"Data Setup"},
    {id:"a_umg", l:"Manage Users",n:"Users",  i:"shield",  s:"Data Setup"},
    {id:"a_col", l:"College Info",n:"College", i:"globe",   s:"Data Setup"},
    {id:"a_sub", l:"Subjects",   n:"Subjects",i:"book",    s:"Data Setup"},
    {id:"a_usr", l:"Users",      n:"Users",   i:"users",   s:"System"},
    {id:"a_mrk", l:"Marks",      n:"Marks",   i:"chart",   s:"System"},
  ],
};
 
/* ═══════════════════════════════════════════
   APP SHELL
═══════════════════════════════════════════ */
export default function App() {
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dash");
  const [data,setData]=useState(INIT);
  const [mob,setMob]=useState(false);
  const [thin,setThin]=useState(false);
  const [notif,setNotif]=useState(false);
  const [toast,setToast]=useState(null);
  const [modal,setModal]=useState(null);
  const [dark,setDark]=useState(false);
  const [srch,setSrch]=useState("");
  const [srchOpen,setSrchOpen]=useState(false);
  const notify=useCallback((msg,type="s")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),2800);
  },[]);
 
  if(!user) return <><style>{CSS}</style><div className={dark?"dark":""}><Login onLogin={u=>{setUser(u);setPage("dash");}}/></div></>;
 
  const items=NAV[user.role]||[];
  const sections=[...new Set(items.map(i=>i.s))];
  const mobItems=items.slice(0,5);
  const ctx={user,data,setData,notify,setModal,setPage};
  const cur=items.find(i=>i.id===page);
 
  return(
    <>
      <style>{CSS}</style>
      <div className={`app${dark?" dark":""}`}>
        {/* MOBILE OVERLAY */}
        {mob&&<div onClick={()=>setMob(false)} style={{position:"fixed",inset:0,zIndex:49,background:"rgba(99,83,168,.22)",backdropFilter:"blur(2px)"}}/>}
 
        {/* ── SIDEBAR ── */}
        <div className={`sb${thin?" thin":""}${mob?" mob":""}`}>
          <div className="sb-logo">
            <div className="lico">S</div>
            {!thin&&<div><div className="lname">SSIPMT</div><div className="lsub">Academic Portal</div></div>}
          </div>
          <div className="sb-user">
            <div className="av">{user.name[0]}</div>
            {!thin&&<div style={{overflow:"hidden"}}>
              <div className="uname">{user.name}</div>
              <div className="urole">{user.role.toUpperCase()} · {user.dept||"Admin"}</div>
            </div>}
          </div>
          <nav className="sb-nav">
            {sections.map(sec=>(
              <div key={sec}>
                {!thin&&<div className="sb-sec">{sec}</div>}
                {items.filter(i=>i.s===sec).map(item=>(
                  <div key={item.id} className={`sbi${page===item.id?" on":""}`} onClick={()=>{setPage(item.id);setMob(false);}}>
                    <Ico n={item.i} s={16} col={page===item.id?"var(--P)":"var(--T2)"}/>
                    {!thin&&<span style={{flex:1}}>{item.l}</span>}
                    {item.dot&&!thin&&<div className="dot"/>}
                  </div>
                ))}
              </div>
            ))}
          </nav>
          <div className="sb-foot">
            {!thin&&<button className="sbtn" onClick={()=>{setUser(null);setPage("dash");}}><Ico n="logout" s={14}/>Sign Out</button>}
            <button className="sbtn" onClick={()=>setThin(t=>!t)}><Ico n="menu" s={14}/>{!thin&&" Collapse"}</button>
          </div>
        </div>
 
        {/* ── MAIN ── */}
        <div className="main">
          {/* TOPBAR */}
          <div className="tb">
            <div className="tb-l">
              <button className="ham" onClick={()=>setMob(o=>!o)}><Ico n="menu" s={22}/></button>
              <div>
                <div className="tb-title">{cur?.l||"Dashboard"}</div>
                <div className="tb-sub">SSIPMT · {user.dept||"Administration"}</div>
              </div>
            </div>
            <div className="tb-r">
              {/* FUNCTIONAL SEARCH */}
              <div style={{position:"relative"}} className="hide">
                <div className="sbar" onClick={()=>setSrchOpen(true)} style={{minWidth:180}}>
                  <Ico n="search" s={14} col="var(--T3)"/>
                  <input
                    value={srch} onChange={e=>{setSrch(e.target.value);setSrchOpen(true);}}
                    onFocus={()=>setSrchOpen(true)}
                    onBlur={()=>setTimeout(()=>setSrchOpen(false),150)}
                    placeholder="Search pages…"
                    style={{background:"none",border:"none",outline:"none",fontSize:12,color:"var(--T)",width:"100%",fontFamily:"Fustat"}}
                  />
                  {srch&&<span onClick={e=>{e.stopPropagation();setSrch("");setSrchOpen(false);}} style={{cursor:"pointer",color:"var(--T3)",fontSize:14,lineHeight:1}}>×</span>}
                </div>
                {srchOpen&&srch&&(()=>{
                  const res=items.filter(i=>i.l.toLowerCase().includes(srch.toLowerCase())).slice(0,6);
                  return res.length>0?(
                    <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"var(--w)",border:"1.5px solid var(--bdr)",borderRadius:12,boxShadow:"0 8px 28px rgba(139,92,246,.15)",zIndex:100,overflow:"hidden"}}>
                      {res.map(r=>(
                        <div key={r.id} onMouseDown={()=>{setPage(r.id);setSrch("");setSrchOpen(false);}}
                          style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",transition:".14s",fontSize:13,fontWeight:600}}
                          onMouseEnter={e=>e.currentTarget.style.background="var(--PL)"}
                          onMouseLeave={e=>e.currentTarget.style.background=""}>
                          <Ico n={r.i} s={14} col="var(--P)"/>{r.l}
                        </div>
                      ))}
                    </div>
                  ):null;
                })()}
              </div>
              <button className={`tog tog-${dark?"night":"day"}`} onClick={()=>setDark(d=>!d)} title={dark?"Switch to Light Mode":"Switch to Dark Mode"}>
                <div className="tog-knob">{dark?"🌙":"☀️"}</div>
              </button>
              <div className="ib" onClick={()=>{setNotif(o=>!o);setSrchOpen(false);}}>
                <Ico n="bell" s={16}/><div className="nb">{data.notices.length}</div>
              </div>
              <div className="av" style={{cursor:"pointer",width:36,height:36,borderRadius:"50%",minWidth:36,fontSize:14}} onClick={()=>setPage("prof")}>{user.name[0]}</div>
            </div>
          </div>
 
          {/* NOTIFICATION PANEL */}
          {notif&&(
            <div className="np fu" style={{animation:"fu .22s cubic-bezier(.22,1,.36,1) forwards"}}>
              <div className="r jb g8" style={{padding:"13px 16px",borderBottom:"1px solid var(--bdr)"}}>
                <span className="fw8 f14">Notifications</span>
                <button className="btn btn-gh btn-xs" onClick={()=>setNotif(false)}>Close</button>
              </div>
              {data.notices.slice(0,4).map((n,i)=>(
                <div key={n.id} style={{padding:"12px 16px",borderBottom:"1px solid var(--bdr)",cursor:"pointer",
                  transition:"background .18s",animation:`fu .22s cubic-bezier(.22,1,.36,1) ${i*0.05}s both`}}
                  onClick={()=>{setPage("ntc");setNotif(false);}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--PL)"}
                  onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <div className="fw7 f13">{n.title}</div>
                  <div className="c2 f11 mt4">{n.author} · {n.date}</div>
                </div>
              ))}
              <div style={{padding:"10px 16px",textAlign:"center"}}>
                <button className="btn btn-l btn-xs" style={{width:"100%",justifyContent:"center"}} onClick={()=>{setPage("ntc");setNotif(false);}}>View All Notices →</button>
              </div>
            </div>
          )}
 
          {/* PAGE CONTENT */}
          <div className="page fu" key={page} style={{animation:"fu .32s cubic-bezier(.22,1,.36,1) forwards"}}>
            <Router page={page} ctx={ctx}/>
          </div>
          
          {/* FOOTER */}
          <div style={{textAlign:"center", paddingBottom:"20px", fontSize:"12px", color:"var(--T3)"}}>
            Made with <span style={{color:"#f43f5e"}}>❤️</span> by <span style={{color:"var(--P)",fontWeight:700}}>Moi</span>
          </div>
        </div>
 
        {/* FLOATING TOAST */}
        {toast&&(
          <div className={`toast toast-${toast.type}`}>
            <Ico n={toast.type==="s"?"check":toast.type==="e"?"x":"bell"} s={15}/>
            {toast.msg}
          </div>
        )}
 
        {/* FLOATING BLACK NAV */}
        <div className="bnav">
          {mobItems.map(item=>(
            <div key={item.id} className={`bni${page===item.id?" on":""}`} onClick={()=>setPage(item.id)}>
              <Ico n={item.i} s={18} col={page===item.id?"#fff":"rgba(255,255,255,0.45)"}/>
              {item.n||item.l}
              {item.dot&&page!==item.id&&<div className="bni-dot"/>}
            </div>
          ))}
        </div>
 
        {/* MODAL */}
        {modal&&(
          <div className="ov" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mh"><div className="mt">{modal.title}</div>
                <button className="btn btn-gh btn-xs" onClick={()=>setModal(null)}><Ico n="x" s={13}/>Close</button>
              </div>
              {modal.content}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
 
/* ═══════════════════════════════════════════
   ROUTER
═══════════════════════════════════════════ */
function Router({page,ctx}) {
  const map={
    dash:<Dash ctx={ctx}/>,     prof:<Prof ctx={ctx}/>,
    tt:<TT ctx={ctx}/>,         att:<Att ctx={ctx}/>,
    marks:<Marks ctx={ctx}/>,   ntc:<Ntc ctx={ctx}/>,
    notes:<Notes ctx={ctx}/>,   pyq:<PYQ ctx={ctx}/>,
    ai:<AI ctx={ctx}/>,         todo:<Todo ctx={ctx}/>,
    fees:<Fees ctx={ctx}/>,     links:<Links/>,
    t_att:<TeachAtt ctx={ctx}/>,t_notes:<TeachNotes ctx={ctx}/>,
    t_marks:<TeachMarks ctx={ctx}/>,t_ntc:<PostNtc ctx={ctx}/>,
    t_anly:<Analytics ctx={ctx}/>,
    h_att:<HODAtt ctx={ctx}/>,  h_marks:<HODMarks ctx={ctx}/>,
    a_ntc:<AdminNtc ctx={ctx}/>,a_nts:<AdminNotes ctx={ctx}/>,
    a_pyq:<AdminPYQ ctx={ctx}/>,a_tt:<AdminTT ctx={ctx}/>,
    a_fee:<AdminFees ctx={ctx}/>,a_usr:<AdminUsers/>,
    a_mrk:<AdminMarks ctx={ctx}/>,
    a_stu:<AdminStudents ctx={ctx}/>,a_umg:<AdminManageUsers ctx={ctx}/>,
    a_col:<AdminCollegeInfo ctx={ctx}/>,a_sub:<AdminSubjects ctx={ctx}/>,
  };
  return map[page]||<Dash ctx={ctx}/>;
}
 
/* ─── REUSABLE STAT CARD ─── */
function St({n,lbl,sub,trend,up,color,bg,icon,onClick}) {
  return(
    <div className="st" onClick={onClick} style={{borderTop:`3px solid ${color}`}}>
      <div className="st-ic" style={{background:bg}}><Ico n={icon} s={20} col={color}/></div>
      <div className="st-n" style={{color}}>{n}</div>
      <div className="st-l">{lbl}</div>
      {sub&&<div className="st-s">{sub}</div>}
      {trend&&<div className={`st-tr ${up?"tu":"td"}`}>{trend}</div>}
    </div>
  );
}
 
/* ─── PROGRESS BAR ─── */
function Pb({v,cls="pp",h=7}) {
  return <div className="pb" style={{height:h}}><div className={`pf ${cls}`} style={{width:v+"%"}}/></div>;
}
 
/* ═══════════════════════════════════════════
   DASHBOARDS
═══════════════════════════════════════════ */
function Dash({ctx:{user,data,setPage}}) {
  if(user.role==="teacher") return <TDash user={user} data={data} setPage={setPage}/>;
  if(user.role==="hod")     return <HDash user={user} data={data} setPage={setPage}/>;
  if(user.role==="admin")   return <ADash user={user} data={data} setPage={setPage}/>;
 
  const att=data.attendance[user.rollNo]||{};
  const ms=data.marks[user.rollNo]||[];
  const keys=Object.keys(att);
  const avgAtt=keys.length?Math.round(keys.reduce((s,k)=>s+pct(att[k].present,att[k].total),0)/keys.length):0;
  const avgM=ms.length?Math.round(ms.reduce((s,m)=>s+pct(m.mid,m.mx.mid),0)/ms.length):0;
  const low=keys.filter(k=>pct(att[k].present,att[k].total)<75).length;
  const barD=ms.map(m=>({n:m.sub.split(" ").slice(-1)[0],v:pct(m.mid,m.mx.mid)}));
  const daysLeft=Math.max(0,Math.ceil((new Date("2026-03-15")-new Date())/86400000));
  const todayTT=data.timetable[3]||data.timetable[0]; /* Thursday */
 
  return(
    <div className="stg">
      {/* Greeting row */}
      <div className="r jb w g8 mb16">
        <div>
          <div className="fw8" style={{fontSize:22,color:"var(--T)"}}>Good morning, {user.name.split(" ")[0]}! 👋</div>
          <div className="c2 f13 mt6">{user.dept} · Sem {user.semester} · Sec {user.section} · <span className="cp fw7">{user.rollNo}</span></div>
        </div>
        <div className="r g12">
          {/* Attendance Circle */}
          {(()=>{
            const r=44, circ=2*Math.PI*r, dash=(avgAtt/100)*circ;
            const col=avgAtt>=75?"#10b981":avgAtt>=60?"#f59e0b":"#f43f5e";
            return(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{position:"relative",width:110,height:110}}>
                  <svg width="110" height="110" style={{transform:"rotate(-90deg)"}}>
                    <circle cx="55" cy="55" r={r} fill="none" stroke="var(--bdr)" strokeWidth="8"/>
                    <circle cx="55" cy="55" r={r} fill="none" stroke={col} strokeWidth="8"
                      strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                      style={{transition:"stroke-dasharray 1s ease"}}/>
                  </svg>
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <div style={{fontSize:22,fontWeight:900,color:col,lineHeight:1}}>{avgAtt}%</div>
                    <div style={{fontSize:9,fontWeight:700,color:"var(--T3)",letterSpacing:.5,marginTop:2}}>ATTENDANCE</div>
                  </div>
                </div>
                <div style={{fontSize:10,fontWeight:700,color:col}}>{avgAtt>=75?"✅ Safe":"⚠️ Low"}</div>
              </div>
            );
          })()}
          {/* Exam countdown */}
          <div style={{background:"var(--RL)",border:"1.5px solid #fda4af",borderRadius:14,padding:"10px 18px",textAlign:"center",minWidth:78}}>
            <div className="fw8 cr" style={{fontSize:24}}>{daysLeft}</div>
            <div className="cr f10 fw7" style={{letterSpacing:.5}}>DAYS TO EXAM</div>
          </div>
        </div>
      </div>
 
      {/* Stats */}
      <div className="sg">
        <St n={avgAtt+"%"} lbl="Avg Attendance" sub={`${low} below 75%`}  trend="↑ This month" up  color="var(--P)" bg="var(--PL)" icon="check"  onClick={()=>setPage("att")}/>
        <St n={avgM+"%"}   lbl="Avg Marks"       sub={`${ms.length} subjects`} trend="Mid-sem done" up color="var(--G)" bg="var(--GL)" icon="chart"  onClick={()=>setPage("marks")}/>
        <St n={data.notices.length} lbl="Notices" sub={`${data.notices.filter(n=>n.imp).length} important`} trend="2 unread" color="var(--O)" bg="var(--OL)" icon="bell"    onClick={()=>setPage("ntc")}/>
        <St n={data.notes.length}   lbl="Study Notes"  sub="Available"  trend="2 new" up color="var(--B)" bg="var(--BL)" icon="book"    onClick={()=>setPage("notes")}/>
        <St n={data.pyqs.length}    lbl="PYQ Papers"   sub="Verified"              color="var(--P)" bg="var(--PL)" icon="folder"  onClick={()=>setPage("pyq")}/>
        <St n={(data.todos||[]).filter(t=>!t.done).length} lbl="Pending Tasks" sub="Study planner" trend="Due soon" color="var(--R)" bg="var(--RL)" icon="task" onClick={()=>setPage("todo")}/>
      </div>
 
      {/* ── TODAY'S CLASSES ── */}
      <div className="card mt16">
        <div className="ct"><Ico n="calendar" s={16} col="var(--P)"/>Today's Classes <span className="bd bp" style={{marginLeft:"auto"}}>Thursday</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
          {todayTT.slots.map((s,i)=>(
            <div key={i} style={{
              borderRadius:12,padding:"12px 14px",border:"1.5px solid",
              borderColor:s.sub==="BREAK"?"#fcd34d":s.sub==="FREE"?"var(--bdr)":"var(--PM)",
              background:s.sub==="BREAK"?"var(--OL)":s.sub==="FREE"?"var(--bg)":"var(--PL)",
              opacity:s.sub==="FREE"?.5:1
            }}>
              <div className="fw7 f10" style={{color:s.sub==="BREAK"?"var(--O)":s.sub==="FREE"?"var(--T3)":"var(--P)",marginBottom:4,letterSpacing:.5}}>{s.time}</div>
              <div className="fw8 f13" style={{color:s.sub==="BREAK"?"var(--O)":s.sub==="FREE"?"var(--T3)":"var(--T)"}}>{s.sub}</div>
              {s.room&&<div className="f10 c3 mt4">{s.room}</div>}
            </div>
          ))}
        </div>
      </div>
 
      {/* ── LATEST NOTICES ── */}
      <div className="card mt16">
        <div className="ct"><Ico n="bell" s={16} col="var(--O)"/>Latest Notices
          <button className="btn btn-gh btn-xs" style={{marginLeft:"auto"}} onClick={()=>setPage("ntc")}>View All →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
          {data.notices.slice(0,4).map(n=>(
            <div key={n.id} className={`nc ${(n.cat||"general").toLowerCase()}`} onClick={()=>setPage("ntc")} style={{margin:0}}>
              <div className="r g6 mb6">
                <span className={`bd ${n.cat==="Exam"?"br":n.cat==="Event"?"bp":"by"} f9`}>{n.cat}</span>
                {n.imp&&<span className="bd br f9">🔴 Important</span>}
              </div>
              <div className="fw7 f13" style={{color:"var(--T)",lineHeight:1.4}}>{n.title}</div>
              <div className="r g6 c2 f11 mt6"><span>{n.author}</span><span>·</span><span>{n.date}</span></div>
            </div>
          ))}
        </div>
      </div>
 
      {/* ── SUBJECT PERFORMANCE ── */}
      <div className="card mt16">
        <div className="ct"><Ico n="chart" s={16} col="var(--P)"/>Subject Performance</div>
        <div className="g2">
          {/* Bar chart */}
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barD} barSize={22}>
              <XAxis dataKey="n" tick={{fill:"var(--T2)",fontSize:11,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fill:"var(--T3)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{fontFamily:"Fustat"}} cursor={{fill:"rgba(139,92,246,.05)"}}/>
              <Bar dataKey="v" name="Score %" radius={[6,6,0,0]}>
                {barD.map((_,i)=><Cell key={i} fill={CC[i%CC.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Attendance bars */}
          <div>
            {Object.entries(att).map(([sub,val])=>{
              const p=pct(val.present,val.total);
              return(
                <div key={sub} style={{marginBottom:12}}>
                  <div className="r jb mb6">
                    <span className="fw6 f12">{sub.split(" ").slice(0,2).join(" ")}</span>
                    <span className="fw8 f12" style={{color:gcol(p)}}>{p}% att.</span>
                  </div>
                  <Pb v={p} cls={p>=75?"pg":p>=60?"py":"pr"}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: PROFILE
═══════════════════════════════════════════ */
function Prof({ctx:{user}}) {
  return(
    <div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div className="pcov"><div className="pav">{user.name[0]}</div></div>
        <div style={{padding:"48px 20px 20px"}}>
          <div className="fw8 f16">{user.name}</div>
          <div className="c2 f13 mt4">{user.dept||"Administration"} · {user.role.toUpperCase()}</div>
          <div className="r g6 mt12 w">
            {user.rollNo&&<span className="bd bp">{user.rollNo}</span>}
            {user.semester&&<span className="bd bb">Sem {user.semester}</span>}
            {user.section&&<span className="bd bg">Sec {user.section}</span>}
            {user.cgpa&&<span className="bd by">CGPA {user.cgpa}</span>}
          </div>
        </div>
      </div>
      <div className="card mt16">
        <div className="ct"><Ico n="profile" s={16} col="var(--P)"/>Personal Information</div>
        <div className="ig">
          {[
            ["Full Name",user.name],["Email",user.email],
            ["Phone",user.phone||"N/A"],["Date of Birth",user.dob||"N/A"],
            ["Department",user.dept||"Administration"],["Role",user.role.toUpperCase()],
            user.rollNo&&["Roll No",user.rollNo],
            user.semester&&["Semester","Semester "+user.semester],
          ].filter(Boolean).map(([k,v])=>(
            <div key={k} className="ii"><label>{k}</label><span>{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: TIMETABLE
═══════════════════════════════════════════ */
function TT({ctx:{user,data}}) {
  const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const today=days[Math.min(new Date().getDay()-1,4)]||"Monday";
  const [day,setDay]=useState(today);
  const cur=data.timetable.find(d=>d.day===day)||data.timetable[0];
 
  return(
    <div>
      {/* Day picker — like the reference screenshot calendar strip */}
      <div className="card mb16">
        <div className="r g6 w">
          {days.map((d,i)=>{
            const act=d===day;
            const isToday=d===today;
            return(
              <div key={d} onClick={()=>setDay(d)} style={{
                flex:1,minWidth:54,padding:"10px 6px",
                borderRadius:12,textAlign:"center",cursor:"pointer",transition:"all .18s",
                background:act?"var(--P)":isToday?"var(--PL)":"var(--bg)",
                border:`1.5px solid ${act?"var(--P)":isToday?"var(--PM)":"var(--bdr)"}`,
                boxShadow:act?"0 4px 14px rgba(139,92,246,.3)":"none",
              }}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",color:act?"rgba(255,255,255,.75)":"var(--T3)",marginBottom:4}}>{d.slice(0,3)}</div>
                <div style={{fontSize:17,fontWeight:800,color:act?"#fff":isToday?"var(--P)":"var(--T)"}}>{18+i}</div>
              </div>
            );
          })}
        </div>
      </div>
 
      <div className="card mb16">
        <div className="ct"><Ico n="calendar" s={16} col="var(--P)"/>{cur.day} — CSE Sem {user.semester} Sec {user.section}</div>
        {cur.slots.map((s,i)=>(
          <div key={i} className={`tsl ${s.sub==="BREAK"?"tsl-brk":s.sub==="FREE"?"tsl-free":""}`}>
            <div className="r jb">
              <div className="r g12">
                <div style={{textAlign:"center",minWidth:56}}>
                  <div className="fw7 f12 cp">{s.time.split(" ")[0]}</div>
                  <div className="c3 f10">{s.time.split(" ")[1]||""}</div>
                </div>
                <div>
                  <div className="fw6 f13" style={{color:s.sub==="BREAK"?"var(--O)":s.sub==="FREE"?"var(--T3)":"var(--T)"}}>{s.sub}</div>
                  {s.room&&<div className="c2 f11 mt4">Room: {s.room}</div>}
                </div>
              </div>
              {s.room&&<span className="bd bz">{s.room}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: ATTENDANCE
═══════════════════════════════════════════ */
function Att({ctx:{user,data}}) {
  const att=data.attendance[user.rollNo]||{};
  return(
    <div>
      <div className="sg mb16">
        {Object.entries(att).map(([sub,val])=>{
          const p=pct(val.present,val.total);
          const col=p>=75?"var(--G)":p>=60?"var(--O)":"var(--R)";
          const cls=p>=75?"pg":p>=60?"py":"pr";
          return(
            <div key={sub} className="st" style={{borderTop:`3px solid ${col}`}}>
              <div className="st-l mb8">{sub.split(" ").slice(0,2).join(" ")}</div>
              <div className="fw8" style={{fontSize:30,color:col,lineHeight:1}}>{p}%</div>
              <div className="c2 f11 mt6">{val.present}/{val.total} classes</div>
              <Pb v={p} cls={cls} h={6}/>
            </div>
          );
        })}
      </div>
 
      {Object.entries(att).map(([sub,val])=>{
        const p=pct(val.present,val.total);
        const need=p<75?Math.ceil((0.75*val.total-val.present)/0.25):0;
        const bunk=p>75?Math.floor((val.present-0.75*val.total)/0.75):0;
        return(
          <div key={sub} className="card mb12">
            <div className="r jb g8 mb14">
              <div className="ct" style={{marginBottom:0}}><Ico n="check" s={16} col={p>=75?"var(--G)":"var(--R)"}/>{sub}</div>
              <span className={`bd ${p>=75?"bg":"br"}`}>{p}% Attendance</span>
            </div>
            {/* Stats row */}
            <div className="r g10 w mb12">
              {[["Present",val.present,"var(--G)"],["Absent",val.total-val.present,"var(--R)"],["Total",val.total,"var(--P)"]].map(([k,v,c])=>(
                <div key={k} style={{background:"var(--bg)",borderRadius:10,padding:"10px 14px",flex:1,textAlign:"center",minWidth:74}}>
                  <div className="c2 f10 fw7 mb4" style={{textTransform:"uppercase",letterSpacing:.4}}>{k}</div>
                  <div className="fw8 f16" style={{color:c}}>{v}</div>
                </div>
              ))}
            </div>
            <Pb v={p} cls={p>=75?"pg":p>=60?"py":"pr"}/>
            {p<75&&<div className="al al-e mt8"><Ico n="fire" s={14}/>Need <strong>&nbsp;{need} more classes&nbsp;</strong> to reach 75% minimum</div>}
            {bunk>0&&<div className="al al-s mt8"><Ico n="check" s={14}/>Can miss <strong>&nbsp;{bunk} more classes&nbsp;</strong> and stay above 75%</div>}
            {val.hist&&(
              <div className="mt12">
                <div className="c2 f10 fw7 mb8" style={{textTransform:"uppercase",letterSpacing:.5}}>Attendance History ({val.hist.length} classes)</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:4}}>
                  {val.hist.map((h,i)=>(
                    <div key={i} title={h?"Present":"Absent"} style={{
                      aspectRatio:1,borderRadius:4,
                      background:h?"var(--GL)":"var(--RL)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:9,fontWeight:800,color:h?"var(--G)":"var(--R)",
                    }}>{h?"P":"A"}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: MARKS
═══════════════════════════════════════════ */
function Marks({ctx:{user,data}}) {
  const ms=data.marks[user.rollNo]||[];
  const cgpa=user.cgpa||8.4;
  const semH=[{s:"Sem 1",v:7.8},{s:"Sem 2",v:8.1},{s:"Sem 3",v:8.3},{s:"Sem 4",v:8.2},{s:"Sem 5",v:cgpa}];
  const total=ms.reduce((s,m)=>s+m.t1+m.t2+m.mid+m.asgn,0);
  const maxT=ms.reduce((s,m)=>s+m.mx.t1+m.mx.t2+m.mx.mid+m.mx.asgn,0);
 
  return(
    <div>
      <div className="sg mb16">
        <St n={cgpa}            lbl="CGPA"        sub="Cumulative GPA"           color="var(--P)" bg="var(--PL)" icon="award"/>
        <St n={pct(total,maxT)+"%"} lbl="Overall" sub={`${total}/${maxT} total`} color="var(--G)" bg="var(--GL)" icon="chart"/>
        <St n="DBMS"            lbl="Best Subject" sub="46/50 mid-sem"           color="var(--O)" bg="var(--OL)" icon="sparkle"/>
      </div>
 
      <div className="g2 mb16">
        <div className="card">
          <div className="ct"><Ico n="chart" s={16} col="var(--P)"/>CGPA Trend</div>
          <ResponsiveContainer width="100%" height={165}>
            <LineChart data={semH}>
              <XAxis dataKey="s" tick={{fill:"var(--T2)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <YAxis domain={[6,10]} tick={{fill:"var(--T3)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{fontFamily:"Fustat"}}/>
              <Line type="monotone" dataKey="v" name="CGPA" stroke="var(--P)" strokeWidth={2.5} dot={{fill:"var(--P)",r:4,strokeWidth:0}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="ct"><Ico n="award" s={16} col="var(--G)"/>Mid-Sem Scores</div>
          <ResponsiveContainer width="100%" height={165}>
            <BarChart data={ms.map(m=>({n:m.sub.split(" ")[0],v:pct(m.mid,m.mx.mid)}))} barSize={18}>
              <XAxis dataKey="n" tick={{fill:"var(--T2)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fill:"var(--T3)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{fontFamily:"Fustat"}}/>
              <Bar dataKey="v" name="Score %" radius={[5,5,0,0]}>
                {ms.map((_,i)=><Cell key={i} fill={CC[i%CC.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
 
      <div className="card">
        <div className="ct"><Ico n="chart" s={16} col="var(--P)"/>Detailed Marks Breakdown</div>
        <div className="tw">
          <table>
            <thead><tr><th>Subject</th><th>Test 1/20</th><th>Test 2/20</th><th>Assign/10</th><th>Mid/50</th><th>Total</th><th>Grade</th></tr></thead>
            <tbody>
              {ms.map((m,i)=>{
                const tot=m.t1+m.t2+m.mid+m.asgn;
                const mxT=m.mx.t1+m.mx.t2+m.mx.mid+m.mx.asgn;
                const p=pct(tot,mxT);
                const grade=p>=90?"O":p>=80?"A+":p>=70?"A":p>=60?"B+":"B";
                return(
                  <tr key={i}>
                    <td className="fw7">{m.sub}</td>
                    <td style={{color:m.t1>=15?"var(--G)":m.t1>=10?"var(--O)":"var(--R)",fontWeight:700}}>{m.t1}</td>
                    <td style={{color:m.t2>=15?"var(--G)":m.t2>=10?"var(--O)":"var(--R)",fontWeight:700}}>{m.t2}</td>
                    <td>{m.asgn}</td>
                    <td><span className="fw7">{m.mid}</span><Pb v={pct(m.mid,m.mx.mid)} cls="pp" h={4}/></td>
                    <td className="fw7">{tot}/{mxT} <span className="c2 fw5">({p}%)</span></td>
                    <td><span className={`bd ${p>=80?"bg":p>=60?"by":"br"}`}>{grade}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: NOTICES
═══════════════════════════════════════════ */
function Ntc({ctx:{data}}) {
  const [filt,setFilt]=useState("All");
  const [open,setOpen]=useState(null);
  const cats=["All","Exam","Event","Holiday","General"];
  const list=filt==="All"?data.notices:data.notices.filter(n=>n.cat===filt);
  return(
    <div>
      <div className="tabs">
        {cats.map(c=><button key={c} className={`tab${filt===c?" on":""}`} onClick={()=>setFilt(c)}>{c}</button>)}
      </div>
      {list.map(n=>(
        <div key={n.id} className={`nc ${(n.cat||"general").toLowerCase()}`} onClick={()=>setOpen(open===n.id?null:n.id)}>
          <div className="r jb g8 mb6">
            <span className="fw7 f14">{n.title}{n.img&&<span className="bd bb f9" style={{marginLeft:6}}>📷</span>}</span>
            <div className="r g5">
              {n.imp&&<span className="bd by f9">⚠ Imp</span>}
              <span className={`bd ${n.cat==="Exam"?"br":n.cat==="Event"?"bp":"by"} f9`}>{n.cat}</span>
            </div>
          </div>
          <div className="r g8 c2 f11"><span>{n.author}</span><span>·</span><span>{n.date}</span></div>
          {open===n.id&&<div className="nc-body">{n.body}{n.img&&<img src={n.img} alt="attachment" style={{maxWidth:"100%",borderRadius:10,marginTop:10,border:"1.5px solid var(--bdr)"}}/> }</div>}
        </div>
      ))}
      {list.length===0&&<div className="tc c2 f13" style={{padding:30}}>No notices in this category.</div>}
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: NOTES
═══════════════════════════════════════════ */
function Notes({ctx:{data}}) {
  const [q,setQ]=useState("");
  const [sub,setSub]=useState("All");
  const subs=["All",...new Set(data.notes.map(n=>n.sub))];
  const list=data.notes.filter(n=>(sub==="All"||n.sub===sub)&&n.title.toLowerCase().includes(q.toLowerCase()));
  return(
    <div>
      <div className="r g8 mb16 w">
        <div style={{flex:1,minWidth:140,position:"relative"}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ico n="search" s={14} col="var(--T3)"/></div>
          <input className="inp" placeholder="Search notes…" style={{paddingLeft:38}} value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <select className="inp" style={{width:"auto"}} value={sub} onChange={e=>setSub(e.target.value)}>
          {subs.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(258px,1fr))",gap:13}}>
        {list.map(n=>(
          <div key={n.id} className="card" style={{cursor:"pointer",transition:"all .2s",borderTop:`3px solid ${n.type==="PDF"?"var(--R)":"var(--O)"}`}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="var(--sh2)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="var(--sh)"}}>
            <div className="r jb mb8"><span className={`bd ${n.type==="PDF"?"br":"by"}`}>{n.type}</span><span className="c3 f10">{n.size}</span></div>
            <div className="fw7 f14 mb6">{n.title}</div>
            <div className="c2 f11 mb12">{n.by} · {n.date}</div>
            <div className="r jb">
              <span className="bd bp f10">{n.sub.split(" ").slice(0,2).join(" ")}</span>
              <div className="r g6"><span className="c3 f10">⬇ {n.dl}</span><button className="btn btn-p btn-xs"><Ico n="download" s={11}/>Get</button></div>
            </div>
          </div>
        ))}
        {list.length===0&&<div className="c2 f13 tc" style={{padding:30,gridColumn:"1/-1"}}>No notes found.</div>}
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: PYQ
═══════════════════════════════════════════ */
function PYQ({ctx:{data}}) {
  const [sub,setSub]=useState("All");
  const subs=["All",...new Set(data.pyqs.map(p=>p.sub))];
  const list=sub==="All"?data.pyqs:data.pyqs.filter(p=>p.sub===sub);
  return(
    <div>
      <div className="al al-i mb16"><Ico n="shield" s={14}/>Official PYQ Library — All papers verified by Admin only</div>
      <div className="r g8 mb16">
        <select className="inp" style={{width:"auto"}} value={sub} onChange={e=>setSub(e.target.value)}>
          {subs.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="card tw">
        <table>
          <thead><tr><th>Paper Title</th><th>Subject</th><th>Semester</th><th>Year</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {list.map(p=>(
              <tr key={p.id}>
                <td className="fw7">{p.title}</td>
                <td><span className="bd bp">{p.sub.split(" ").slice(0,2).join(" ")}</span></td>
                <td className="c2">Sem {p.sem}</td>
                <td><span className="bd bb">{p.year}</span></td>
                <td><span className="bd bg">✓ Verified</span></td>
                <td><button className="btn btn-gh btn-sm"><Ico n="download" s={12}/>Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: AI PREDICTOR
═══════════════════════════════════════════ */
function AI() {
  const [files,setFiles]=useState([]);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(false);
  const [tab,setTab]=useState("topics");
  const ref=useRef();
 
  const topics=[
    {n:"Sorting Algorithms (Quick, Merge, Heap)",f:92},
    {n:"Binary Trees & BST Operations",f:87},
    {n:"Dynamic Programming — Knapsack",f:83},
    {n:"Graph Algorithms (Dijkstra, Kruskal)",f:79},
    {n:"Hashing & Collision Resolution",f:74},
    {n:"Recursion & Backtracking",f:68},
  ];
  const qs=[
    {q:"Explain and code Quick Sort with time complexity analysis.",m:10,d:"Medium"},
    {q:"Write Dijkstra's shortest path algorithm with a worked example.",m:10,d:"Hard"},
    {q:"What is Dynamic Programming? Solve 0/1 Knapsack for n=4.",m:10,d:"Hard"},
    {q:"Compare DFS and BFS. Implement both using adjacency list.",m:8,d:"Medium"},
    {q:"Explain AVL tree rotations (LL, LR, RL, RR) with examples.",m:8,d:"Medium"},
    {q:"Merge two sorted linked lists. State time complexity.",m:6,d:"Easy"},
  ];
 
  if(result) return(
    <div>
      <div className="al al-s mb16"><Ico n="check" s={14}/>Analysis complete! Showing predicted topics and questions.</div>
      <div className="tabs">
        {["topics","questions"].map(t=><button key={t} className={`tab${tab===t?" on":""}`} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
      </div>
      {tab==="topics"&&(
        <div className="card">
          <div className="ct"><Ico n="fire" s={16} col="var(--R)"/>High-Priority Topics</div>
          {topics.map((t,i)=>(
            <div key={i} style={{marginBottom:15}}>
              <div className="r jb mb6">
                <div className="r g8"><span className="bd bp f9">#{i+1}</span><span className="fw6 f13">{t.n}</span></div>
                <span className="fw8 f11" style={{color:t.f>80?"var(--R)":t.f>70?"var(--O)":"var(--G)"}}>{t.f}%</span>
              </div>
              <Pb v={t.f} cls={t.f>80?"pr":t.f>70?"py":"pg"}/>
            </div>
          ))}
        </div>
      )}
      {tab==="questions"&&(
        <div className="card">
          <div className="ct"><Ico n="book" s={16} col="var(--P)"/>Predicted Questions</div>
          {qs.map((q,i)=>(
            <div key={i} style={{padding:"12px 0",borderBottom:"1px solid var(--bdr)",display:"flex",gap:10}}>
              <span className="fw8 f14 cp">Q{i+1}.</span>
              <div>
                <div className="f13" style={{lineHeight:1.6}}>{q.q}</div>
                <div className="r g6 mt6">
                  <span className="bd bp">{q.m} marks</span>
                  <span className={`bd ${q.d==="Hard"?"br":q.d==="Medium"?"by":"bg"}`}>{q.d}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="btn btn-gh mt12" onClick={()=>{setResult(false);setFiles([]);}}>← Analyze Another File</button>
    </div>
  );
 
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,var(--PL),#e0e7ff)",border:"1.5px solid var(--PM)",borderRadius:14,padding:16,marginBottom:18}}>
        <div className="r g8 mb6"><Ico n="sparkle" s={18} col="var(--P)"/><span className="fw8 f14">AI Exam Predictor</span><span className="bd bp">Powered by AI</span></div>
        <div className="c2 f13">Upload PYQs, notes, or syllabus. Our AI analyzes exam patterns to predict important topics and probable questions.</div>
      </div>
      <div className="card">
        <div className="dz" onClick={()=>ref.current.click()}>
          <div style={{fontSize:42,marginBottom:12}}>📄</div>
          <div className="fw7 f14 cp mb6">Drop files here or click to upload</div>
          <div className="c2 f12">Supports PDF, PPT, DOCX, Images</div>
          <input ref={ref} type="file" multiple style={{display:"none"}} onChange={e=>setFiles(Array.from(e.target.files))}/>
        </div>
        {files.length>0&&(
          <div className="mt12">
            {files.map((f,i)=>(
              <div key={i} className="r g8 mb6">
                <span className="bd bp">{f.name.split(".").pop().toUpperCase()}</span>
                <span className="f12">{f.name}</span>
              </div>
            ))}
          </div>
        )}
        <button className="btn btn-p mt16" style={{width:"100%",justifyContent:"center",padding:"10px",fontSize:14}}
          onClick={()=>{setLoading(true);setTimeout(()=>{setLoading(false);setResult(true);},2000);}}
          disabled={loading}>
          {loading?<><div className="ld"/>Analyzing patterns…</>:<><Ico n="sparkle" s={15}/>Analyze & Predict</>}
        </button>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: STUDY PLANNER
═══════════════════════════════════════════ */
function Todo({ctx:{data,setData,notify}}) {
  const todos=data.todos||[];
  const [form,setForm]=useState({text:"",sub:"Data Structures",due:"",pri:"medium"});
  const toggle=id=>setData(p=>({...p,todos:p.todos.map(t=>t.id===id?{...t,done:!t.done}:t)}));
  const del=id=>setData(p=>({...p,todos:p.todos.filter(t=>t.id!==id)}));
  const add=()=>{
    if(!form.text.trim())return;
    setData(p=>({...p,todos:[...p.todos,{id:Date.now(),...form,done:false}]}));
    notify("Task added!");
    setForm({text:"",sub:"Data Structures",due:"",pri:"medium"});
  };
  const done=todos.filter(t=>t.done).length;
 
  return(
    <div>
      <div className="sg mb16">
        <St n={todos.length} lbl="Total Tasks" color="var(--P)" bg="var(--PL)" icon="task"/>
        <St n={done}         lbl="Completed"   color="var(--G)" bg="var(--GL)" icon="check"/>
        <St n={todos.length-done} lbl="Pending" color="var(--R)" bg="var(--RL)" icon="fire"/>
      </div>
 
      <div className="card mb16">
        <div className="ct"><Ico n="plus" s={16} col="var(--P)"/>Add New Task</div>
        <div className="g2">
          <div className="fld" style={{gridColumn:"1/-1"}}>
            <label className="lbl">Task Description</label>
            <input className="inp" placeholder="What do you need to study?" value={form.text} onChange={e=>setForm(f=>({...f,text:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&add()}/>
          </div>
          <div className="fld">
            <label className="lbl">Subject</label>
            <select className="inp" value={form.sub} onChange={e=>setForm(f=>({...f,sub:e.target.value}))}>
              {SUBS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="fld">
            <label className="lbl">Due Date</label>
            <input type="date" className="inp" value={form.due} onChange={e=>setForm(f=>({...f,due:e.target.value}))}/>
          </div>
          <div className="fld">
            <label className="lbl">Priority</label>
            <select className="inp" value={form.pri} onChange={e=>setForm(f=>({...f,pri:e.target.value}))}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
        </div>
        <button className="btn btn-p" onClick={add}><Ico n="plus" s={14}/>Add Task</button>
      </div>
 
      <div className="card">
        <div className="ct"><Ico n="task" s={16} col="var(--P)"/>My Tasks</div>
        {["high","medium","low"].map(pri=>{
          const items=todos.filter(t=>t.pri===pri);
          if(!items.length) return null;
          const col=pri==="high"?"var(--R)":pri==="medium"?"var(--O)":"var(--G)";
          return(
            <div key={pri} style={{marginBottom:16}}>
              <div className="r g6 mb8">
                <div style={{width:8,height:8,borderRadius:"50%",background:col,flexShrink:0}}/>
                <span className="fw8 f11" style={{textTransform:"uppercase",letterSpacing:.8,color:col}}>{pri} Priority</span>
              </div>
              {items.map(t=>(
                <div key={t.id} className={`tod${t.done?" dn":""}`}>
                  <div className={`tck${t.done?" ok":""}`} onClick={()=>toggle(t.id)}>
                    {t.done&&<Ico n="check" s={11} col="#fff"/>}
                  </div>
                  <div style={{width:7,height:7,borderRadius:"50%",background:col,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div className="fw6 f13" style={{textDecoration:t.done?"line-through":"none"}}>{t.text}</div>
                    <div className="r g6 mt4">
                      <span className="bd bp f9">{t.sub.split(" ")[0]}</span>
                      {t.due&&<span className="c3 f10">Due: {t.due}</span>}
                    </div>
                  </div>
                  <button className="btn btn-d btn-xs" onClick={()=>del(t.id)}><Ico n="trash" s={11}/></button>
                </div>
              ))}
            </div>
          );
        })}
        {todos.length===0&&<div className="tc c2 f13" style={{padding:24}}>No tasks yet. Add your first study task above! 📚</div>}
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: FEES
═══════════════════════════════════════════ */
function Fees({ctx:{data}}) {
  const [tab,setTab]=useState("college");
  const {college,hostel,bus}=data.fees;
  return(
    <div>
      <div className="tabs">
        {["college","hostel","bus"].map(t=><button key={t} className={`tab${tab===t?" on":""}`} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)} Fees</button>)}
      </div>
 
      {tab==="college"&&(
        <div className="card">
          <div className="r jb mb16 g8">
            <div className="ct" style={{marginBottom:0}}><Ico n="credit" s={16} col="var(--P)"/>College Fee Details</div>
            <span className="bd bg">{college.status}</span>
          </div>
          <div className="g2">
            <div>
              {[["Bank",college.bank],["Branch",college.branch],["Account No",college.acc],["IFSC Code",college.ifsc],["Annual Fee","₹"+college.amt.toLocaleString()],["Last Paid",college.paid]].map(([k,v])=>(
                <div key={k} className="fr"><span className="c2 f12">{k}</span><span className="fw7 f13" style={{fontFamily:"monospace"}}>{v}</span></div>
              ))}
            </div>
            <div className="tc">
              <div className="qrb"><span>QR</span><span className="f10 c2">Scan to Pay</span></div>
              <div className="c2 f11 mt8">UPI / PhonePe / GPay</div>
              <button className="btn btn-p btn-sm mt12" style={{margin:"12px auto 0",display:"flex"}}>Pay ₹{college.amt.toLocaleString()}</button>
            </div>
          </div>
        </div>
      )}
 
      {tab==="hostel"&&(
        <div className="card">
          <div className="ct"><Ico n="credit" s={16} col="var(--P)"/>Hostel Fee Details</div>
          <div className="g2">
            <div>
              {[["Bank",hostel.bank],["Account",hostel.acc],["IFSC",hostel.ifsc],["Annual Fee","₹"+hostel.amt.toLocaleString()],["Status",hostel.status]].map(([k,v])=>(
                <div key={k} className="fr"><span className="c2 f12">{k}</span><span className="fw7 f13">{v}</span></div>
              ))}
            </div>
            <div className="tc">
              <div className="qrb"><span>QR</span><span className="f10 c2">Hostel Pay</span></div>
            </div>
          </div>
        </div>
      )}
 
      {tab==="bus"&&(
        <div className="card">
          <div className="ct"><Ico n="credit" s={16} col="var(--P)"/>Bus Routes & Fares</div>
          {bus.map((r,i)=>(
            <div key={i} style={{background:"var(--bg)",border:"1.5px solid var(--bdr)",borderRadius:12,padding:14,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div className="fw7 f13">{r.name}</div><div className="c2 f11 mt4">Annual fare</div></div>
              <span className="fw8 f14 cg">₹{r.fare.toLocaleString()}/yr</span>
            </div>
          ))}
          <div className="al al-i mt12"><Ico n="bell" s={14}/>Contact transport office for bus pass. Bring fee receipt & student ID.</div>
        </div>
      )}
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STUDENT: PORTALS
═══════════════════════════════════════════ */
function Links() {
  const list=[
    {n:"CSVTU Portal",  d:"University academic portal",   e:"🎓",url:"https://csvtu.ac.in",         c:"var(--P)"},
    {n:"DigiLocker",    d:"Digital document storage",     e:"📁",url:"https://digilocker.gov.in",    c:"var(--B)"},
    {n:"NSP",           d:"National Scholarship Portal",  e:"💰",url:"https://scholarships.gov.in",  c:"var(--G)"},
    {n:"NPTEL",         d:"Free online MOOCs",            e:"📚",url:"https://nptel.ac.in",          c:"var(--O)"},
    {n:"AICTE",         d:"All India Council for Tech Ed",e:"🏛️",url:"https://aicte-india.org",      c:"var(--R)"},
    {n:"SWAYAM",        d:"Govt MOOCs platform",          e:"🖥️",url:"https://swayam.gov.in",        c:"var(--B)"},
  ];
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:13}}>
      {list.map(l=>(
        <a key={l.n} href={l.url} target="_blank" rel="noreferrer" className="card"
          style={{display:"block",cursor:"pointer",transition:"all .2s",borderTop:`3px solid ${l.c}`}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="var(--sh2)"}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="var(--sh)"}}>
          <div style={{fontSize:32,marginBottom:10}}>{l.e}</div>
          <div className="fw7 f14 mb4">{l.n}</div>
          <div className="c2 f11 mb12">{l.d}</div>
          <span className="fw7 f11" style={{color:l.c}}>Open Portal →</span>
        </a>
      ))}
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   TEACHER DASHBOARD
═══════════════════════════════════════════ */
function TDash({user,data,setPage}) {
  const trend=[{m:"Oct",v:82},{m:"Nov",v:79},{m:"Dec",v:75},{m:"Jan",v:84},{m:"Feb",v:88},{m:"Mar",v:86}];
  return(
    <div className="stg">
      <div className="mb16">
        <div className="fw8" style={{fontSize:22}}>Welcome, {user.name.split(" ").pop()}! 👋</div>
        <div className="c2 f13 mt6">{user.dept} · {user.subject}</div>
      </div>
      <div className="sg">
        <St n={63}               lbl="My Students"    color="var(--P)" bg="var(--PL)" icon="users"/>
        <St n={data.notes.length} lbl="Notes Uploaded" color="var(--G)" bg="var(--GL)" icon="book"/>
        <St n="86%"               lbl="Class Avg Att"  color="var(--O)" bg="var(--OL)" icon="check"/>
        <St n="74%"               lbl="Class Avg Marks"color="var(--B)" bg="var(--BL)" icon="chart"/>
      </div>
      <div className="g2">
        <div className="card">
          <div className="ct"><Ico n="chart" s={16} col="var(--P)"/>Monthly Attendance Trend</div>
          <ResponsiveContainer width="100%" height={185}>
            <AreaChart data={trend}>
              <XAxis dataKey="m" tick={{fill:"var(--T2)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <YAxis domain={[60,100]} tick={{fill:"var(--T3)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{fontFamily:"Fustat"}}/>
              <Area type="monotone" dataKey="v" name="%" stroke="var(--P)" fill="var(--PL)" strokeWidth={2.5}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="ct"><Ico n="sparkle" s={16} col="var(--P)"/>Quick Actions</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {[["t_att","Take Attendance","check","btn-p"],["t_notes","Upload Notes","upload","btn-l"],["t_marks","Update Marks","chart","btn-gh"],["t_ntc","Post Notice","bell","btn-gh"],["t_anly","Analytics","fire","btn-gh"]].map(([id,l,ic,cls])=>(
              <button key={id} className={`btn ${cls}`} style={{justifyContent:"flex-start"}} onClick={()=>setPage(id)}>
                <Ico n={ic} s={14}/>{l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   TEACHER: TAKE ATTENDANCE
═══════════════════════════════════════════ */
function TeachAtt({ctx:{data,setData,notify}}) {
  const [sub,setSub]=useState("Data Structures");
  const [att,setAtt]=useState({});
  const [saved,setSaved]=useState(false);
  const [sec,setSec]=useState("All");
  const subs=data.subjects||SUBS;
  const filtered=sec==="All"?data.students:data.students.filter(s=>s.section===sec);
  const present=filtered.filter(s=>att[s.rollNo]!=="A").length;
 
  const markAll=v=>{
    const o={...att};
    filtered.forEach(s=>{o[s.rollNo]=v;});
    setAtt(o);
  };
 
  const submit=()=>{
    filtered.forEach(s=>{
      const isP=att[s.rollNo]!=="A";
      setData(prev=>{
        const a={...prev.attendance};
        if(!a[s.rollNo]) a[s.rollNo]={};
        const sa=a[s.rollNo][sub]||{total:0,present:0,hist:[]};
        a[s.rollNo]={...a[s.rollNo],[sub]:{total:sa.total+1,present:sa.present+(isP?1:0),hist:[...sa.hist,isP?1:0]}};
        return{...prev,attendance:a};
      });
    });
    setSaved(true);
    notify(`Attendance saved for ${sub}!`);
  };
 
  return(
    <div>
      <div className="card mb16">
        <div className="r jb w g12 mb16">
          <div className="r g12 w">
            <div className="fld" style={{marginBottom:0}}>
              <label className="lbl">Subject</label>
              <select className="inp" style={{width:210}} value={sub} onChange={e=>{setSub(e.target.value);setSaved(false);setAtt({});}}>
                {subs.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="fld" style={{marginBottom:0}}>
              <label className="lbl">Section</label>
              <div className="r g4">
                {["All","A","B","C","D"].map(s=>(
                  <button key={s} className={`btn btn-xs ${sec===s?"btn-p":"btn-gh"}`} onClick={()=>setSec(s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{background:"var(--PL)",border:"1.5px solid var(--PM)",borderRadius:12,padding:"10px 18px",display:"flex",gap:16,alignItems:"center"}}>
            <div className="tc"><div className="fw8 f22 cg">{present}</div><div className="c2 f10">Present</div></div>
            <div className="c3 f14">/</div>
            <div className="tc"><div className="fw8 f22">{filtered.length}</div><div className="c2 f10">Total</div></div>
          </div>
        </div>
        <div className="r g8 mb16">
          <button className="btn btn-g btn-sm" onClick={()=>markAll("P")}><Ico n="check" s={13}/>All Present</button>
          <button className="btn btn-d btn-sm" onClick={()=>markAll("A")}><Ico n="x" s={13}/>All Absent</button>
        </div>
        {saved&&<div className="al al-s mb12"><Ico n="check" s={14}/>Attendance saved for <strong>{sub}</strong></div>}
        {filtered.map(s=>(
          <div key={s.rollNo} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--bdr)"}}>
            <div className="r g10">
              <div className="av" style={{width:30,height:30,minWidth:30,fontSize:11}}>{s.name[0]}</div>
              <div>
                <div className="fw6 f13">{s.name} <span className="bd bz f9">Sec {s.section}</span></div>
                <div className="c3 f11">{s.rollNo}</div>
              </div>
            </div>
            <div className="atg">
              <button className={`atb${att[s.rollNo]!=="A"?" P":""}`} onClick={()=>setAtt(a=>({...a,[s.rollNo]:"P"}))}>P</button>
              <button className={`atb${att[s.rollNo]==="A"?" A":""}`} onClick={()=>setAtt(a=>({...a,[s.rollNo]:"A"}))}>A</button>
            </div>
          </div>
        ))}
        <button className="btn btn-p mt16" onClick={submit}><Ico n="check" s={14}/>Submit — {present}/{filtered.length} present</button>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   TEACHER: UPLOAD NOTES
═══════════════════════════════════════════ */
function TeachNotes({ctx:{data,setData,notify}}) {
  const [form,setForm]=useState({title:"",sub:"Data Structures",type:"PDF"});
  const del=id=>{setData(p=>({...p,notes:p.notes.filter(n=>n.id!==id)}));notify("Deleted","e");};
  return(
    <div>
      <div className="card mb16">
        <div className="ct"><Ico n="upload" s={16} col="var(--P)"/>Upload Study Notes</div>
        <div className="g2">
          <div className="fld">
            <label className="lbl">Title</label>
            <input className="inp" placeholder="e.g. DS Unit 3 — Trees" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
          </div>
          <div className="fld">
            <label className="lbl">Subject</label>
            <select className="inp" value={form.sub} onChange={e=>setForm(f=>({...f,sub:e.target.value}))}>
              {SUBS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="fld">
            <label className="lbl">File Type</label>
            <select className="inp" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              {["PDF","PPT","DOCX"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="dz mb12" style={{padding:"22px 18px"}}>
          <div style={{fontSize:28,marginBottom:8}}>📎</div>
          <div className="fw6 f13 cp">Click to attach file</div>
        </div>
        <button className="btn btn-p" onClick={()=>{
          if(!form.title.trim())return;
          setData(p=>({...p,notes:[{id:Date.now(),...form,by:"Dr. Priya Verma",date:now(),size:"1.0 MB",dl:0},...p.notes]}));
          notify("Notes uploaded!");
          setForm({title:"",sub:"Data Structures",type:"PDF"});
        }}><Ico n="upload" s={14}/>Upload Notes</button>
      </div>
      <div className="card tw">
        <div className="ct">Uploaded Notes ({data.notes.length})</div>
        <table>
          <thead><tr><th>Title</th><th>Subject</th><th>Date</th><th>Downloads</th><th>Action</th></tr></thead>
          <tbody>
            {data.notes.map(n=>(
              <tr key={n.id}>
                <td className="fw6">{n.title}</td>
                <td><span className="bd bp">{n.sub.split(" ")[0]}</span></td>
                <td className="c2">{n.date}</td>
                <td className="c2">⬇ {n.dl}</td>
                <td><button className="btn btn-d btn-xs" onClick={()=>del(n.id)}><Ico n="trash" s={11}/>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   TEACHER: UPDATE MARKS
═══════════════════════════════════════════ */
function TeachMarks({ctx:{data,setData,notify}}) {
  const [roll,setRoll]=useState("CSE21001");
  const [sub,setSub]=useState("Data Structures");
  const [v,setV]=useState({t1:"",t2:"",mid:"",asgn:""});
  const ex=(data.marks[roll]||[]).find(m=>m.sub===sub);
 
  const save=()=>{
    setData(prev=>{
      const sm=prev.marks[roll]||[];
      const idx=sm.findIndex(m=>m.sub===sub);
      const e={sub,t1:+v.t1||0,t2:+v.t2||0,mid:+v.mid||0,asgn:+v.asgn||0,mx:{t1:20,t2:20,mid:50,asgn:10}};
      return{...prev,marks:{...prev.marks,[roll]:idx>=0?sm.map((m,i)=>i===idx?e:m):[...sm,e]}};
    });
    notify("Marks updated!");
    setV({t1:"",t2:"",mid:"",asgn:""});
  };
 
  return(
    <div className="card">
      <div className="ct"><Ico n="chart" s={16} col="var(--P)"/>Update Student Marks</div>
      <div className="g2 mb14">
        <div className="fld">
          <label className="lbl">Student</label>
          <select className="inp" value={roll} onChange={e=>setRoll(e.target.value)}>
            {data.students.map(s=><option key={s.rollNo} value={s.rollNo}>{s.rollNo} — {s.name}</option>)}
          </select>
        </div>
        <div className="fld">
          <label className="lbl">Subject</label>
          <select className="inp" value={sub} onChange={e=>setSub(e.target.value)}>
            {SUBS.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {ex&&<div className="al al-i mb12"><Ico n="eye" s={14}/>Current: T1={ex.t1}, T2={ex.t2}, Mid={ex.mid}, Assign={ex.asgn}</div>}
      <div className="g2">
        {[["t1","Test 1","20"],["t2","Test 2","20"],["mid","Mid-Sem","50"],["asgn","Assignment","10"]].map(([k,lbl,mx])=>(
          <div key={k} className="fld">
            <label className="lbl">{lbl} (max {mx})</label>
            <input type="number" min="0" max={mx} className="inp" placeholder={`0–${mx}`} value={v[k]} onChange={e=>setV(x=>({...x,[k]:e.target.value}))}/>
          </div>
        ))}
      </div>
      <button className="btn btn-p" onClick={save}><Ico n="check" s={14}/>Save Marks</button>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   TEACHER / HOD: POST NOTICE
═══════════════════════════════════════════ */
function PostNtc({ctx:{user,data,setData,notify}}) {
  const [form,setForm]=useState({title:"",body:"",cat:"Exam",imp:false,img:""});
  const del=id=>{setData(p=>({...p,notices:p.notices.filter(n=>n.id!==id)}));notify("Notice deleted","e");};
  const handleImg=e=>{
    const file=e.target.files[0];
    if(!file)return;
    if(file.size>50*1024*1024){notify("File too large (max 50MB)","e");return;}
    const reader=new FileReader();
    reader.onload=ev=>setForm(f=>({...f,img:ev.target.result}));
    reader.readAsDataURL(file);
  };
  return(
    <div>
      <div className="card mb16">
        <div className="ct"><Ico n="bell" s={16} col="var(--P)"/>Post New Notice</div>
        <div className="fld"><label className="lbl">Title</label><input className="inp" placeholder="Notice title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
        <div className="fld"><label className="lbl">Message</label><textarea className="inp" rows={3} placeholder="Notice details…" value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))}/></div>
        <div className="g2">
          <div className="fld">
            <label className="lbl">Category</label>
            <select className="inp" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>
              {["Exam","Event","Holiday","General"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="fld" style={{display:"flex",alignItems:"center",gap:9,paddingTop:20}}>
            <input type="checkbox" id="imp" checked={form.imp} onChange={e=>setForm(f=>({...f,imp:e.target.checked}))} style={{width:16,height:16,accentColor:"var(--P)"}}/>
            <label htmlFor="imp" className="lbl" style={{marginBottom:0,cursor:"pointer"}}>Mark as Important</label>
          </div>
        </div>
        <div className="fld">
          <label className="lbl">Attach Image (optional)</label>
          <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImg} className="inp" style={{padding:"7px 10px"}}/>
          {form.img&&<div className="mt8"><img src={form.img} alt="preview" style={{maxWidth:200,borderRadius:10,border:"1.5px solid var(--bdr)"}}/><button className="btn btn-d btn-xs mt6" onClick={()=>setForm(f=>({...f,img:""}))}><Ico n="x" s={11}/>Remove</button></div>}
        </div>
        <button className="btn btn-p" onClick={()=>{
          if(!form.title.trim())return;
          setData(p=>({...p,notices:[{id:Date.now(),...form,date:now(),author:user.name},...p.notices]}));
          notify("Notice posted!");
          setForm({title:"",body:"",cat:"Exam",imp:false,img:""});
        }}><Ico n="bell" s={14}/>Post Notice</button>
      </div>
 
      <div className="card">
        <div className="ct"><Ico n="eye" s={16} col="var(--P)"/>All Notices</div>
        {data.notices.map(n=>(
          <div key={n.id} className="r jb g8" style={{padding:"11px 0",borderBottom:"1px solid var(--bdr)"}}>
            <div>
              <div className="fw6 f13">{n.title}{n.img&&<span className="bd bb f9" style={{marginLeft:6}}>📷 Image</span>}</div>
              <div className="c2 f11 mt4">{n.author} · {n.date}</div>
            </div>
            <div className="r g6">
              <span className={`bd ${n.cat==="Exam"?"br":n.cat==="Event"?"bp":"by"}`}>{n.cat}</span>
              <button className="btn btn-d btn-xs" onClick={()=>del(n.id)}><Ico n="trash" s={11}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   TEACHER: ANALYTICS
═══════════════════════════════════════════ */
function Analytics({ctx:{data}}) {
  const bySub=SUBS.map(s=>{
    const vals=Object.values(data.marks).flatMap(m=>m.filter(x=>x.sub===s).map(x=>pct(x.mid,x.mx.mid)));
    return{n:s.split(" ")[0],avg:vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0};
  });
  return(
    <div>
      <div className="sg mb16">
        <St n={63}    lbl="Class Size"    color="var(--P)" bg="var(--PL)" icon="users"/>
        <St n="82%"   lbl="Avg Att"       color="var(--G)" bg="var(--GL)" icon="check"/>
        <St n="74%"   lbl="Avg Marks"     color="var(--O)" bg="var(--OL)" icon="chart"/>
        <St n={11}    lbl="Below 75% Att" color="var(--R)" bg="var(--RL)" icon="fire"/>
      </div>
      <div className="g2">
        <div className="card">
          <div className="ct"><Ico n="chart" s={16} col="var(--P)"/>Subject Avg Marks</div>
          <ResponsiveContainer width="100%" height={195}>
            <BarChart data={bySub} barSize={22}>
              <XAxis dataKey="n" tick={{fill:"var(--T2)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fill:"var(--T3)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{fontFamily:"Fustat"}}/>
              <Bar dataKey="avg" name="Avg %" radius={[5,5,0,0]}>
                {bySub.map((_,i)=><Cell key={i} fill={CC[i%CC.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="ct"><Ico n="award" s={16} col="var(--O)"/>Top Performers</div>
          {[...data.students].sort((a,b)=>b.cgpa-a.cgpa).slice(0,7).map((s,i)=>(
            <div key={s.rollNo} className="r jb" style={{padding:"8px 0",borderBottom:"1px solid var(--bdr)"}}>
              <div className="r g8">
                <span className={`bd ${i===0?"br":i===1?"by":"bp"} f9`}>#{i+1}</span>
                <span className="fw6 f12">{s.name}</span>
              </div>
              <span className="bd bg">CGPA {s.cgpa}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   HOD DASHBOARD
═══════════════════════════════════════════ */
function HDash({user,data,setPage}) {
  const depts=[{d:"CSE",att:82,mrk:71},{d:"IT",att:79,mrk:68},{d:"ECE",att:85,mrk:74},{d:"ME",att:77,mrk:65}];
  return(
    <div className="stg">
      <div className="mb16">
        <div className="fw8" style={{fontSize:22}}>HOD Dashboard</div>
        <div className="c2 f13 mt6">{user.dept} Department</div>
      </div>
      <div className="sg">
        <St n={284}  lbl="Students"    color="var(--P)" bg="var(--PL)" icon="users"/>
        <St n="82%"  lbl="Avg Att"     color="var(--G)" bg="var(--GL)" icon="check"/>
        <St n="71%"  lbl="Avg Marks"   color="var(--O)" bg="var(--OL)" icon="chart"/>
        <St n={12}   lbl="Faculty"     color="var(--B)" bg="var(--BL)" icon="award"/>
      </div>
      <div className="g2">
        <div className="card">
          <div className="ct"><Ico n="chart" s={16} col="var(--P)"/>Dept Comparison</div>
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={depts} barSize={14}>
              <XAxis dataKey="d" tick={{fill:"var(--T2)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"var(--T3)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{fontFamily:"Fustat"}}/>
              <Bar dataKey="att" name="Attendance %" fill="var(--P)" radius={[3,3,0,0]}/>
              <Bar dataKey="mrk" name="Marks %" fill="var(--G)" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="ct"><Ico n="bell" s={16} col="var(--O)"/>Recent Notices</div>
          {data.notices.slice(0,4).map(n=>(
            <div key={n.id} className={`nc ${(n.cat||"general").toLowerCase()}`} onClick={()=>setPage("ntc")} style={{marginBottom:8}}>
              <div className="fw6 f12">{n.title}</div>
              <div className="c2 f11 mt4">{n.author} · {n.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   HOD: ATTENDANCE
═══════════════════════════════════════════ */
function HODAtt({ctx:{data}}) {
  return(
    <div>
      <div className="sg mb16">
        <St n="82%"  lbl="Dept Avg"    color="var(--P)" bg="var(--PL)" icon="chart"/>
        <St n={261}  lbl="Above 75%"   color="var(--G)" bg="var(--GL)" icon="check"/>
        <St n={23}   lbl="Below 75%"   color="var(--R)" bg="var(--RL)" icon="fire"/>
      </div>
      <div className="card tw">
        <div className="ct"><Ico n="check" s={16} col="var(--P)"/>Student Attendance Report</div>
        <table>
          <thead><tr><th>Roll No</th><th>Name</th><th>Avg Att</th><th>Status</th>{SUBS.slice(0,3).map(s=><th key={s}>{s.split(" ")[0]}</th>)}</tr></thead>
          <tbody>
            {data.students.map(s=>{
              const a=data.attendance[s.rollNo]||{};
              const vals=Object.values(a);
              const avg=vals.length?Math.round(vals.reduce((sum,v)=>sum+pct(v.present,v.total),0)/vals.length):0;
              return(
                <tr key={s.rollNo}>
                  <td className="fw6 cp">{s.rollNo}</td>
                  <td className="fw6">{s.name}</td>
                  <td><span className="fw7" style={{color:gcol(avg)}}>{avg}%</span></td>
                  <td><span className={`bd ${avg>=75?"bg":"br"}`}>{avg>=75?"OK":"⚠ Low"}</span></td>
                  {SUBS.slice(0,3).map(sub=>{
                    const v=a[sub];
                    return<td key={sub} className="c2">{v?pct(v.present,v.total)+"%":"—"}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   HOD: MARKS OVERVIEW
═══════════════════════════════════════════ */
function HODMarks({ctx:{data}}) {
  const dist=[{r:"90-100",c:2},{r:"80-89",c:3},{r:"70-79",c:3},{r:"60-69",c:1},{r:"<60",c:1}];
  return(
    <div>
      <div className="g2 mb16">
        <div className="card">
          <div className="ct"><Ico n="chart" s={16} col="var(--P)"/>Grade Distribution</div>
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={dist} barSize={28}>
              <XAxis dataKey="r" tick={{fill:"var(--T2)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"var(--T3)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{fontFamily:"Fustat"}}/>
              <Bar dataKey="c" name="Students" radius={[5,5,0,0]}>
                {dist.map((_,i)=><Cell key={i} fill={CC[i%CC.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="ct"><Ico n="award" s={16} col="var(--O)"/>Top Students</div>
          {[...data.students].sort((a,b)=>b.cgpa-a.cgpa).slice(0,6).map((s,i)=>(
            <div key={s.rollNo} className="r jb" style={{padding:"8px 0",borderBottom:"1px solid var(--bdr)"}}>
              <div className="r g8"><span className={`bd ${i<3?"by":"bz"} f9`}>#{i+1}</span><span className="fw6 f12">{s.name}</span></div>
              <span className="bd bg">CGPA {s.cgpa}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card tw">
        <div className="ct">All Student Marks</div>
        <table>
          <thead><tr><th>Student</th><th>CGPA</th>{SUBS.slice(0,3).map(s=><th key={s}>{s.split(" ")[0]}</th>)}<th>Avg</th></tr></thead>
          <tbody>
            {data.students.map(s=>{
              const ms=data.marks[s.rollNo]||[];
              const avg=ms.length?Math.round(ms.reduce((sum,m)=>sum+pct(m.mid,m.mx.mid),0)/ms.length):0;
              return(
                <tr key={s.rollNo}>
                  <td className="fw6">{s.name}</td>
                  <td><span className="bd bp">{s.cgpa}</span></td>
                  {SUBS.slice(0,3).map(sub=>{const m=ms.find(x=>x.sub===sub);return<td key={sub} className="c2">{m?pct(m.mid,m.mx.mid)+"%":"—"}</td>;})}
                  <td><span className={`bd ${avg>=75?"bg":avg>=60?"by":"br"}`}>{avg}%</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════ */
function ADash({user,data,setPage}) {
  const growth=[{m:"Jan",v:180},{m:"Feb",v:220},{m:"Mar",v:261}];
  return(
    <div className="stg">
      <div className="mb16">
        <div className="fw8" style={{fontSize:22}}>Admin Control Panel ⚙️</div>
        <div className="c2 f13 mt6">Full system access · {now()}</div>
      </div>
      <div className="sg">
        <St n="1,247" lbl="Students"    color="var(--P)" bg="var(--PL)" icon="users"/>
        <St n={84}    lbl="Teachers"    color="var(--G)" bg="var(--GL)" icon="award"/>
        <St n={data.notices.length} lbl="Notices" color="var(--O)" bg="var(--OL)" icon="bell"/>
        <St n={data.pyqs.length}    lbl="PYQs"    color="var(--B)" bg="var(--BL)" icon="folder"/>
        <St n={data.notes.length}   lbl="Notes"   color="var(--P)" bg="var(--PL)" icon="book"/>
        <St n={4}     lbl="Depts"       color="var(--R)" bg="var(--RL)" icon="shield"/>
      </div>
      <div className="g2">
        <div className="card">
          <div className="ct"><Ico n="chart" s={16} col="var(--P)"/>Active Users Growth</div>
          <ResponsiveContainer width="100%" height={165}>
            <AreaChart data={growth}>
              <XAxis dataKey="m" tick={{fill:"var(--T2)",fontSize:10,fontFamily:"Fustat"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{fontFamily:"Fustat"}}/>
              <Area type="monotone" dataKey="v" name="Users" stroke="var(--P)" fill="var(--PL)" strokeWidth={2.5}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="ct"><Ico n="shield" s={16} col="var(--P)"/>Quick Modules</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["a_ntc","Notices","bell"],["a_nts","Notes","book"],["a_pyq","PYQs","folder"],["a_tt","Timetable","calendar"],["a_fee","Fees","credit"],["a_usr","Users","users"]].map(([id,l,ic])=>(
              <button key={id} className="btn btn-l" style={{justifyContent:"flex-start"}} onClick={()=>setPage(id)}>
                <Ico n={ic} s={14}/>{l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: NOTICES
═══════════════════════════════════════════ */
function AdminNtc({ctx:{data,setData,notify}}) {
  const [form,setForm]=useState({title:"",body:"",cat:"Exam",imp:false,img:""});
  const handleImg=e=>{
    const file=e.target.files[0];
    if(!file)return;
    if(file.size>50*1024*1024){notify("File too large (max 50MB)","e");return;}
    const reader=new FileReader();
    reader.onload=ev=>setForm(f=>({...f,img:ev.target.result}));
    reader.readAsDataURL(file);
  };
  return(
    <div>
      <div className="card mb16">
        <div className="ct"><Ico n="shield" s={16} col="var(--O)"/>Admin — Manage Notices</div>
        <div className="fld"><label className="lbl">Title</label><input className="inp" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
        <div className="fld"><label className="lbl">Body</label><textarea className="inp" rows={2} value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))}/></div>
        <div className="g2">
          <div className="fld">
            <label className="lbl">Category</label>
            <select className="inp" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>
              {["Exam","Event","Holiday","General"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="fld" style={{display:"flex",alignItems:"center",gap:9,paddingTop:20}}>
            <input type="checkbox" checked={form.imp} onChange={e=>setForm(f=>({...f,imp:e.target.checked}))} style={{width:16,height:16,accentColor:"var(--P)"}}/>
            <label className="lbl" style={{marginBottom:0}}>Important</label>
          </div>
        </div>
        <div className="fld">
          <label className="lbl">Attach Image (optional)</label>
          <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImg} className="inp" style={{padding:"7px 10px"}}/>
          {form.img&&<div className="mt8"><img src={form.img} alt="preview" style={{maxWidth:200,borderRadius:10,border:"1.5px solid var(--bdr)"}}/><button className="btn btn-d btn-xs mt6" onClick={()=>setForm(f=>({...f,img:""}))}><Ico n="x" s={11}/>Remove</button></div>}
        </div>
        <button className="btn btn-p" onClick={()=>{
          if(!form.title.trim())return;
          setData(p=>({...p,notices:[{id:Date.now(),...form,date:now(),author:"Admin"},...p.notices]}));
          notify("Notice added!");setForm({title:"",body:"",cat:"Exam",imp:false,img:""});
        }}><Ico n="plus" s={13}/>Add Notice</button>
      </div>
      <div className="card tw">
        <table>
          <thead><tr><th>Title</th><th>Author</th><th>Date</th><th>Cat</th><th>Action</th></tr></thead>
          <tbody>
            {data.notices.map(n=>(
              <tr key={n.id}>
                <td className="fw6">{n.title}{n.img&&<span className="bd bb f9" style={{marginLeft:6}}>📷</span>}</td>
                <td className="c2">{n.author}</td>
                <td className="c2">{n.date}</td>
                <td><span className="bd by">{n.cat}</span></td>
                <td><button className="btn btn-d btn-xs" onClick={()=>{setData(p=>({...p,notices:p.notices.filter(x=>x.id!==n.id)}));notify("Deleted","e");}}><Ico n="trash" s={11}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: NOTES
═══════════════════════════════════════════ */
function AdminNotes({ctx:{data,setData,notify}}) {
  const [form,setForm]=useState({title:"",sub:"Data Structures",type:"PDF"});
  return(
    <div>
      <div className="card mb16">
        <div className="ct"><Ico n="shield" s={16} col="var(--O)"/>Admin — Manage Notes</div>
        <div className="g2">
          <div className="fld"><label className="lbl">Title</label><input className="inp" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
          <div className="fld"><label className="lbl">Subject</label><select className="inp" value={form.sub} onChange={e=>setForm(f=>({...f,sub:e.target.value}))}>{SUBS.map(s=><option key={s}>{s}</option>)}</select></div>
        </div>
        <button className="btn btn-p" onClick={()=>{
          if(!form.title.trim())return;
          setData(p=>({...p,notes:[{id:Date.now(),...form,by:"Admin",date:now(),size:"1.0 MB",dl:0},...p.notes]}));
          notify("Note added!");setForm({title:"",sub:"Data Structures",type:"PDF"});
        }}><Ico n="plus" s={13}/>Add Note</button>
      </div>
      <div className="card tw">
        <table>
          <thead><tr><th>Title</th><th>Subject</th><th>By</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {data.notes.map(n=>(
              <tr key={n.id}>
                <td className="fw6">{n.title}</td>
                <td><span className="bd bp">{n.sub.split(" ")[0]}</span></td>
                <td className="c2">{n.by}</td>
                <td className="c2">{n.date}</td>
                <td><button className="btn btn-d btn-xs" onClick={()=>{setData(p=>({...p,notes:p.notes.filter(x=>x.id!==n.id)}));notify("Deleted","e");}}><Ico n="trash" s={11}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: PYQs
═══════════════════════════════════════════ */
function AdminPYQ({ctx:{data,setData,notify}}) {
  const [form,setForm]=useState({title:"",sub:"Data Structures",sem:5,year:2025});
  return(
    <div>
      <div className="card mb16">
        <div className="ct"><Ico n="shield" s={16} col="var(--O)"/>Admin — Manage PYQs</div>
        <div className="g2">
          <div className="fld"><label className="lbl">Paper Title</label><input className="inp" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
          <div className="fld"><label className="lbl">Subject</label><select className="inp" value={form.sub} onChange={e=>setForm(f=>({...f,sub:e.target.value}))}>{SUBS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="fld"><label className="lbl">Semester</label><select className="inp" value={form.sem} onChange={e=>setForm(f=>({...f,sem:+e.target.value}))}>{[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Sem {s}</option>)}</select></div>
          <div className="fld"><label className="lbl">Year</label><input type="number" className="inp" value={form.year} onChange={e=>setForm(f=>({...f,year:+e.target.value}))}/></div>
        </div>
        <button className="btn btn-p" onClick={()=>{
          if(!form.title.trim())return;
          setData(p=>({...p,pyqs:[{id:Date.now(),...form},...p.pyqs]}));
          notify("PYQ added!");setForm({title:"",sub:"Data Structures",sem:5,year:2025});
        }}><Ico n="plus" s={13}/>Add PYQ</button>
      </div>
      <div className="card tw">
        <table>
          <thead><tr><th>Title</th><th>Subject</th><th>Sem</th><th>Year</th><th>Action</th></tr></thead>
          <tbody>
            {data.pyqs.map(p=>(
              <tr key={p.id}>
                <td className="fw6">{p.title}</td>
                <td><span className="bd bp">{p.sub.split(" ")[0]}</span></td>
                <td className="c2">Sem {p.sem}</td>
                <td><span className="bd bb">{p.year}</span></td>
                <td><button className="btn btn-d btn-xs" onClick={()=>{setData(x=>({...x,pyqs:x.pyqs.filter(q=>q.id!==p.id)}));notify("Deleted","e");}}><Ico n="trash" s={11}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: TIMETABLE
═══════════════════════════════════════════ */
function AdminTT({ctx:{data,setData,notify}}) {
  const [day,setDay]=useState("Monday");
  const [sl,setSl]=useState({sub:"",time:"",room:""});
  return(
    <div>
      <div className="card mb16">
        <div className="ct"><Ico n="shield" s={16} col="var(--O)"/>Admin — Timetable</div>
        <div className="g2">
          <div className="fld"><label className="lbl">Day</label><select className="inp" value={day} onChange={e=>setDay(e.target.value)}>{["Monday","Tuesday","Wednesday","Thursday","Friday"].map(d=><option key={d}>{d}</option>)}</select></div>
          <div className="fld"><label className="lbl">Subject</label><input className="inp" placeholder="Subject name" value={sl.sub} onChange={e=>setSl(s=>({...s,sub:e.target.value}))}/></div>
          <div className="fld"><label className="lbl">Time</label><input className="inp" placeholder="9:00 AM" value={sl.time} onChange={e=>setSl(s=>({...s,time:e.target.value}))}/></div>
          <div className="fld"><label className="lbl">Room</label><input className="inp" placeholder="LH-1" value={sl.room} onChange={e=>setSl(s=>({...s,room:e.target.value}))}/></div>
        </div>
        <button className="btn btn-p" onClick={()=>{
          if(!sl.sub.trim())return;
          setData(p=>({...p,timetable:p.timetable.map(d=>d.day===day?{...d,slots:[...d.slots,{...sl}]}:d)}));
          notify("Slot added!");setSl({sub:"",time:"",room:""});
        }}><Ico n="plus" s={13}/>Add Slot</button>
      </div>
      <div className="card">
        {data.timetable.map(d=>(
          <div key={d.day} style={{marginBottom:14}}>
            <div className="fw8 f11 cp mb8" style={{textTransform:"uppercase",letterSpacing:.8}}>{d.day}</div>
            <div className="r g5 w">
              {d.slots.map((s,i)=>(
                <span key={i} style={{background:s.sub==="BREAK"?"var(--OL)":s.sub==="FREE"?"var(--bg)":"var(--PL)",border:"1.5px solid var(--bdr)",borderRadius:7,padding:"4px 9px",fontSize:11,fontWeight:600,color:s.sub==="BREAK"?"var(--O)":s.sub==="FREE"?"var(--T3)":"var(--T)"}}>
                  {s.time} {s.sub}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: FEES
═══════════════════════════════════════════ */
function AdminFees({ctx:{data,setData,notify}}) {
  const [form,setForm]=useState({...data.fees.college});
  return(
    <div>
      <div className="card mb16">
        <div className="ct"><Ico n="shield" s={16} col="var(--O)"/>Admin — Fee Details</div>
        <div className="g2">
          {[["bank","Bank Name"],["branch","Branch"],["acc","Account No"],["ifsc","IFSC Code"],["amt","Amount (₹)"]].map(([k,lbl])=>(
            <div key={k} className="fld"><label className="lbl">{lbl}</label><input className="inp" value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/></div>
          ))}
        </div>
        <button className="btn btn-p" onClick={()=>{setData(p=>({...p,fees:{...p.fees,college:{...p.fees.college,...form}}}));notify("Fee details updated!");}}>
          <Ico n="check" s={13}/>Save Changes
        </button>
      </div>
      <div className="card">
        <div className="ct"><Ico n="eye" s={16} col="var(--P)"/>Current Fee Details</div>
        {Object.entries(data.fees.college).map(([k,v])=>(
          <div key={k} className="fr"><span className="c2 f12">{k}</span><span className="fw7 f13" style={{fontFamily:"monospace"}}>{String(v)}</span></div>
        ))}
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: USERS
═══════════════════════════════════════════ */
function AdminUsers() {
  return(
    <div>
      <div className="card mb16 tw">
        <div className="ct"><Ico n="shield" s={16} col="var(--O)"/>All Users</div>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Dept</th><th>Status</th></tr></thead>
          <tbody>
            {USERS.map(u=>(
              <tr key={u.id}>
                <td className="fw6">{u.name}</td>
                <td className="c2">{u.email}</td>
                <td><span className={`bd ${u.role==="admin"?"br":u.role==="hod"?"by":u.role==="teacher"?"bb":"bp"}`}>{u.role.toUpperCase()}</span></td>
                <td className="c2">{u.dept||"—"}</td>
                <td><span className="bd bg">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <div className="ct"><Ico n="users" s={16} col="var(--P)"/>Students by Department</div>
        {[["CSE",284],["IT",180],["ECE",210],["ME",150],["Civil",93],["MBA",80]].map(([dept,count])=>(
          <div key={dept} style={{marginBottom:11}}>
            <div className="r jb mb6"><span className="fw6 f13">{dept}</span><span className="cp fw7 f12">{count}</span></div>
            <Pb v={pct(count,284)} cls="pp"/>
          </div>
        ))}
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: MARKS
═══════════════════════════════════════════ */
function AdminMarks({ctx:{data}}) {
  return(
    <div className="card tw">
      <div className="ct"><Ico n="shield" s={16} col="var(--O)"/>All Marks Data</div>
      <table>
        <thead><tr><th>Roll No</th><th>Subject</th><th>T1/20</th><th>T2/20</th><th>Asgn/10</th><th>Mid/50</th><th>%</th><th>Grade</th></tr></thead>
        <tbody>
          {Object.entries(data.marks).flatMap(([roll,ms])=>
            ms.map((m,i)=>{
              const tot=m.t1+m.t2+m.mid+m.asgn;
              const mx=m.mx.t1+m.mx.t2+m.mx.mid+m.mx.asgn;
              const p=pct(tot,mx);
              const g=p>=90?"O":p>=80?"A+":p>=70?"A":p>=60?"B+":"B";
              return(
                <tr key={`${roll}-${i}`}>
                  <td className="fw6 cp">{roll}</td>
                  <td><span className="bd bp f9">{m.sub.split(" ")[0]}</span></td>
                  <td className="fw6">{m.t1}</td><td className="fw6">{m.t2}</td>
                  <td>{m.asgn}</td><td className="fw7">{m.mid}</td>
                  <td className="fw7">{p}%</td>
                  <td><span className={`bd ${p>=80?"bg":p>=60?"by":"br"}`}>{g}</span></td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: STUDENTS (section-wise)
═══════════════════════════════════════════ */
function AdminStudents({ctx:{data,setData,notify}}) {
  const [sec,setSec]=useState("All");
  const [form,setForm]=useState({name:"",rollNo:"",email:"",phone:"",section:"A",semester:5,dept:"CSE",cgpa:""});
  const filtered=sec==="All"?data.students:data.students.filter(s=>s.section===sec);
  const add=()=>{
    if(!form.name.trim()||!form.rollNo.trim())return;
    if(data.students.find(s=>s.rollNo===form.rollNo)){notify("Roll No already exists!","e");return;}
    setData(p=>({...p,students:[...p.students,{...form,cgpa:parseFloat(form.cgpa)||0}]}));
    notify("Student added!");
    setForm({name:"",rollNo:"",email:"",phone:"",section:"A",semester:5,dept:"CSE",cgpa:""});
  };
  const del=rollNo=>{setData(p=>({...p,students:p.students.filter(s=>s.rollNo!==rollNo)}));notify("Student removed","e");};
  return(
    <div>
      <div className="card mb16">
        <div className="ct"><Ico n="plus" s={16} col="var(--P)"/>Add New Student</div>
        <div className="g2">
          <div className="fld"><label className="lbl">Full Name</label><input className="inp" placeholder="Student name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
          <div className="fld"><label className="lbl">Roll No</label><input className="inp" placeholder="CSE21011" value={form.rollNo} onChange={e=>setForm(f=>({...f,rollNo:e.target.value}))}/></div>
          <div className="fld"><label className="lbl">Email</label><input className="inp" placeholder="email@ssipmt.ac.in" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
          <div className="fld"><label className="lbl">Phone</label><input className="inp" placeholder="9876543210" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
          <div className="fld"><label className="lbl">Section</label><select className="inp" value={form.section} onChange={e=>setForm(f=>({...f,section:e.target.value}))}>{["A","B","C","D"].map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="fld"><label className="lbl">Semester</label><select className="inp" value={form.semester} onChange={e=>setForm(f=>({...f,semester:+e.target.value}))}>{[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Sem {s}</option>)}</select></div>
          <div className="fld"><label className="lbl">Department</label><input className="inp" value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))}/></div>
          <div className="fld"><label className="lbl">CGPA</label><input type="number" step="0.1" min="0" max="10" className="inp" placeholder="8.5" value={form.cgpa} onChange={e=>setForm(f=>({...f,cgpa:e.target.value}))}/></div>
        </div>
        <button className="btn btn-p" onClick={add}><Ico n="plus" s={13}/>Add Student</button>
      </div>
 
      <div className="card tw">
        <div className="r jb w g8 mb14">
          <div className="ct" style={{marginBottom:0}}><Ico n="users" s={16} col="var(--P)"/>Students ({filtered.length})</div>
          <div className="r g4">
            {["All","A","B","C","D"].map(s=>(
              <button key={s} className={`btn btn-xs ${sec===s?"btn-p":"btn-gh"}`} onClick={()=>setSec(s)}>{s==="All"?"All Sections":"Sec "+s}</button>
            ))}
          </div>
        </div>
        <table>
          <thead><tr><th>Roll No</th><th>Name</th><th>Sec</th><th>Sem</th><th>Dept</th><th>CGPA</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map(s=>(
              <tr key={s.rollNo}>
                <td className="fw6 cp">{s.rollNo}</td>
                <td className="fw6">{s.name}</td>
                <td><span className="bd bp">{s.section}</span></td>
                <td className="c2">Sem {s.semester||5}</td>
                <td className="c2">{s.dept||"CSE"}</td>
                <td><span className="bd bg">{s.cgpa}</span></td>
                <td><button className="btn btn-d btn-xs" onClick={()=>del(s.rollNo)}><Ico n="trash" s={11}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: MANAGE USERS (CRUD)
═══════════════════════════════════════════ */
function AdminManageUsers({ctx:{data,setData,notify,setModal}}) {
  const users=data.users||USERS;
  const [editId,setEditId]=useState(null);
  const blank={name:"",email:"",password:"",role:"student",dept:"CSE",section:"A",semester:5,rollNo:"",phone:"",subject:""};
  const [form,setForm]=useState({...blank});
 
  const save=()=>{
    if(!form.name.trim()||!form.email.trim())return;
    if(editId){
      setData(p=>({...p,users:p.users.map(u=>u.id===editId?{...u,...form}:u)}));
      notify("User updated!");
    } else {
      setData(p=>({...p,users:[...p.users,{id:Date.now(),...form}]}));
      notify("User added!");
    }
    setForm({...blank});setEditId(null);setModal(null);
  };
  const del=id=>{setData(p=>({...p,users:p.users.filter(u=>u.id!==id)}));notify("User deleted","e");};
  const edit=u=>{setForm({name:u.name,email:u.email,password:u.password||"",role:u.role,dept:u.dept||"",section:u.section||"A",semester:u.semester||5,rollNo:u.rollNo||"",phone:u.phone||"",subject:u.subject||""});setEditId(u.id);};
 
  const formUI=(
    <div>
      <div className="g2">
        <div className="fld"><label className="lbl">Name</label><input className="inp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
        <div className="fld"><label className="lbl">Email</label><input className="inp" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
        <div className="fld"><label className="lbl">Password</label><input className="inp" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/></div>
        <div className="fld"><label className="lbl">Role</label><select className="inp" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>{["student","teacher","hod","admin"].map(r=><option key={r}>{r}</option>)}</select></div>
        <div className="fld"><label className="lbl">Department</label><input className="inp" value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))}/></div>
        <div className="fld"><label className="lbl">Section</label><select className="inp" value={form.section} onChange={e=>setForm(f=>({...f,section:e.target.value}))}>{["A","B","C","D"].map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="fld"><label className="lbl">Semester</label><select className="inp" value={form.semester} onChange={e=>setForm(f=>({...f,semester:+e.target.value}))}>{[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Sem {s}</option>)}</select></div>
        <div className="fld"><label className="lbl">Roll No</label><input className="inp" value={form.rollNo} onChange={e=>setForm(f=>({...f,rollNo:e.target.value}))}/></div>
        <div className="fld"><label className="lbl">Phone</label><input className="inp" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
        <div className="fld"><label className="lbl">Subject</label><input className="inp" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}/></div>
      </div>
      <div className="r g8 mt12">
        <button className="btn btn-p" onClick={save}><Ico n="check" s={13}/>{editId?"Update":"Add"} User</button>
        {editId&&<button className="btn btn-gh" onClick={()=>{setForm({...blank});setEditId(null);}}>Cancel</button>}
      </div>
    </div>
  );
 
  return(
    <div>
      <div className="card mb16">
        <div className="r jb w g8 mb14">
          <div className="ct" style={{marginBottom:0}}><Ico n="shield" s={16} col="var(--O)"/>{editId?"Edit User":"Add New User"}</div>
          {!editId&&<button className="btn btn-l btn-sm" onClick={()=>setModal({title:"Add User",content:formUI})}><Ico n="plus" s={13}/>Quick Add</button>}
        </div>
        {formUI}
      </div>
 
      <div className="card tw">
        <div className="ct"><Ico n="users" s={16} col="var(--P)"/>All Users ({users.length})</div>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Dept</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id}>
                <td className="fw6">{u.name}</td>
                <td className="c2">{u.email}</td>
                <td><span className={`bd ${u.role==="admin"?"br":u.role==="hod"?"by":u.role==="teacher"?"bb":"bp"}`}>{u.role.toUpperCase()}</span></td>
                <td className="c2">{u.dept||"—"}</td>
                <td className="c2">{u.phone||"—"}</td>
                <td>
                  <div className="r g4">
                    <button className="btn btn-l btn-xs" onClick={()=>edit(u)}><Ico n="eye" s={11}/>Edit</button>
                    <button className="btn btn-d btn-xs" onClick={()=>del(u.id)}><Ico n="trash" s={11}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: COLLEGE INFO
═══════════════════════════════════════════ */
function AdminCollegeInfo({ctx:{data,setData,notify}}) {
  const info=data.collegeInfo||{name:"SSIPMT",address:"",phone:"",email:"",principal:"",established:"",university:"",examDates:"",academicYear:"",departments:""};
  const [form,setForm]=useState({...info});
  const fields=[
    ["name","College Name"],["address","Address"],["phone","Phone"],["email","Email"],
    ["principal","Principal Name"],["established","Established Year"],
    ["university","Affiliated University"],["examDates","Exam Dates"],
    ["academicYear","Academic Year"],["departments","Departments"]
  ];
  const save=()=>{setData(p=>({...p,collegeInfo:{...form}}));notify("College info updated!");};
  return(
    <div>
      <div className="card mb16">
        <div className="ct"><Ico n="globe" s={16} col="var(--P)"/>Edit College Information</div>
        <div className="g2">
          {fields.map(([k,lbl])=>(
            <div key={k} className="fld">
              <label className="lbl">{lbl}</label>
              <input className="inp" value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>
            </div>
          ))}
        </div>
        <button className="btn btn-p mt12" onClick={save}><Ico n="check" s={13}/>Save Changes</button>
      </div>
 
      <div className="card">
        <div className="ct"><Ico n="eye" s={16} col="var(--G)"/>Live Preview</div>
        <div style={{background:"linear-gradient(135deg,var(--PL),#e0e7ff)",borderRadius:14,padding:20,border:"1.5px solid var(--PM)"}}>
          <div className="fw8 f16 mb8" style={{color:"var(--P)"}}>{form.name||"College Name"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {fields.map(([k,lbl])=>(
              <div key={k} className="ii">
                <label>{lbl}</label>
                <span>{form[k]||"—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ADMIN: SUBJECTS
═══════════════════════════════════════════ */
function AdminSubjects({ctx:{data,setData,notify}}) {
  const subjects=data.subjects||SUBS;
  const [newSub,setNewSub]=useState("");
  const add=()=>{
    if(!newSub.trim())return;
    if(subjects.includes(newSub.trim())){notify("Subject already exists!","e");return;}
    setData(p=>({...p,subjects:[...(p.subjects||SUBS),newSub.trim()]}));
    notify("Subject added!");
    setNewSub("");
  };
  const del=sub=>{setData(p=>({...p,subjects:(p.subjects||SUBS).filter(s=>s!==sub)}));notify("Subject removed","e");};
  return(
    <div>
      <div className="card mb16">
        <div className="ct"><Ico n="plus" s={16} col="var(--P)"/>Add Subject</div>
        <div className="r g8">
          <input className="inp" style={{flex:1}} placeholder="Enter subject name" value={newSub} onChange={e=>setNewSub(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
          <button className="btn btn-p" onClick={add}><Ico n="plus" s={13}/>Add</button>
        </div>
      </div>
 
      <div className="card">
        <div className="ct"><Ico n="book" s={16} col="var(--P)"/>All Subjects ({subjects.length})</div>
        {subjects.map((s,i)=>(
          <div key={s} className="r jb g8" style={{padding:"12px 0",borderBottom:"1px solid var(--bdr)"}}>
            <div className="r g10">
              <span className="bd bp f9">#{i+1}</span>
              <span className="fw6 f13">{s}</span>
            </div>
            <button className="btn btn-d btn-xs" onClick={()=>del(s)}><Ico n="trash" s={11}/>Remove</button>
          </div>
        ))}
        <div className="al al-i mt12"><Ico n="bell" s={14}/>Subjects are used in attendance, marks, notes, and PYQ dropdowns across the portal.</div>
      </div>
    </div>
  );
}