import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { supabase } from '../lib/supabaseClient';

const V0 = [
  {id:'v01',gn:'CLAW RESTAURANT L.L.C',vn:'Claw BBQ',rg:'UAE',rev:44350000,fin:83,red:84,mz:83,ceil:4,la:1770000,vr:1,pi:150000,p1:200000,p2:800000,an:'Pranit',poc:'Justin',dt:'2026-03-25',loc:'Marsa Dubai',url:'',str:['Strongest overall profile — near-zero debt, lean cost structure, premium spend','High card revenue traceability above 90%','Low rent-to-revenue ratio at 4.8%, well below threshold'],wk:['Single location concentration; minor H2 revenue softening','Limited diversification across venues'],dec:'Approved',rat:'Strong Profile'},
  {id:'v02',gn:'FAB FOOD CO',vn:'Ellas Eatery',rg:'UAE',rev:5770000,fin:63,red:67,mz:64,ceil:2,la:115400,vr:2,pi:40000,p1:150000,p2:600000,an:'Pranit',poc:'Justin',dt:'2026-03-25',loc:'Palm Jumeirah',url:'',str:['7.0 years established history with consistent operations','Zero existing debt across all facilities','Good salary/revenue ratio of 28% within acceptable range'],wk:['Trade License EXPIRED 27-Feb-2026 — hard lending hold recommended','Rent/revenue at 31.19% far exceeds 15% critical threshold','H1/H2 revenue declining -10.2% — negative trajectory'],dec:'Approved',rat:''},
  {id:'v03',gn:'Gates Hospitality',vn:'Reform Social Bar',rg:'UAE',rev:20400000,fin:72,red:67,mz:70,ceil:3,la:612000,vr:2,pi:100000,p1:500000,p2:1000000,an:'Pranit',poc:'Justin',dt:'2026-03-25',loc:'The Lakes',url:'',str:['12.7 years operating history — strong longevity','Zero debt across all facilities','Strong card revenue traceability; diversified revenue streams'],wk:['Void order rate at 10.8% exceeds threshold — POS controls require attention','Weekend-heavy revenue concentration creates weekday volatility'],dec:'Approved',rat:''},
  {id:'v04',gn:'Gates Hospitality',vn:'Ultra Brasserie Emaar Square',rg:'UAE',rev:1560000,fin:36,red:60,mz:43,ceil:0,la:0,vr:0,pi:100000,p1:500000,p2:1000000,an:'Pranit',poc:'Justin',dt:'2026-03-25',loc:'Emaar Square, Downtown',url:'',str:['12.3 years of operational history','Zero existing debt across facilities'],wk:['Rent at 21% of revenue — well above critical threshold','Weak average spend per head; higher lending tiers not viable'],dec:'Approved',rat:''},
  {id:'v05',gn:'Gates Hospitality',vn:'Ultra Brasserie Marina',rg:'UAE',rev:1990000,fin:34,red:54,mz:40,ceil:0,la:0,vr:0,pi:100000,p1:500000,p2:1000000,an:'Pranit',poc:'Justin',dt:'2026-03-25',loc:'Marina Branch',url:'',str:['12.9 years of established operations','Zero existing debt; modest positive revenue momentum'],wk:['Trade License expiring in 8 days triggers 50% lending cap','Rent at 17.6% above the 15% critical threshold'],dec:'Approved',rat:''},
  {id:'v06',gn:'Gates Hospitality',vn:'Bistro Des Arts',rg:'UAE',rev:5910000,fin:64,red:60,mz:63,ceil:2,la:118200,vr:2,pi:100000,p1:500000,p2:1000000,an:'Pranit',poc:'Justin',dt:'2026-03-25',loc:'Dubai Marina',url:'',str:['Strong average spend per head — premium positioning','10.6 years of history with consistent operations','Zero debt across all facilities'],wk:['Salary at 27% is the primary drag on financial health','Conservative drawdown strongly recommended'],dec:'Approved',rat:''},
  {id:'v07',gn:'MANN MARZI',vn:'Mann Marzi Restaurant LLC',rg:'UAE',rev:1757450,fin:42,red:55,mz:46,ceil:0,la:10000,vr:0,pi:10000,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-03-25',loc:'',url:'',str:['Some operational history','Experimental basis — management override'],wk:['Financial health 42.0 below threshold','Mezza 46.0 — NO MATCH territory','AED 10K experimental advance only'],dec:'Rejection Overridden',rat:'AED 10K experimental basis — management override'},
  {id:'v08',gn:'MINE LIFESTYLE MANAGING LTD',vn:'Chic Nonna',rg:'UAE',rev:34600000,fin:73,red:79,mz:75,ceil:3,la:1040000,vr:2,pi:200000,p1:800000,p2:0,an:'Pranit',poc:'Justin',dt:'2026-03-25',loc:'DIFC',url:'',str:['Good sales growth rate with positive trajectory','Healthy profit margins — excellent avg spend per head','Strong redemption score at 79.0'],wk:['High rent to revenue of 13% — approaching threshold','4.7 years operating history relatively short'],dec:'Approved',rat:''},
  {id:'v09',gn:'MONARCH HOSPITALITY',vn:'Kraken',rg:'UAE',rev:987836,fin:38,red:43,mz:39,ceil:0,la:0,vr:0,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-03-25',loc:'Jumeirah 2',url:'',str:['Excellent avg spend AED 488','Zero debt'],wk:['Rent 45.67% — catastrophically above ceiling','Only 3 months POS data','Revenue <AED 1M'],dec:'Rejected',rat:'Multiple critical failures'},
  {id:'v10',gn:'PARIS JUICE CATERING SERVICES',vn:'Wild and the Moon Al Serkal',rg:'UAE',rev:2110000,fin:56,red:59,mz:57,ceil:1,la:21100,vr:3,pi:75000,p1:100000,p2:250000,an:'Pranit',poc:'Justin',dt:'2026-02-15',loc:'Al Goze',url:'',str:['Decade of operation; parent entity backing','Strong community following'],wk:['Trade License & Tenancy both unrenewed','Conditional — 3 votes required'],dec:'Approved',rat:''},
  {id:'v11',gn:'PARIS JUICE CATERING SERVICES',vn:'Wild and the Moon Downtown',rg:'UAE',rev:1600000,fin:39,red:59,mz:45,ceil:0,la:0,vr:0,pi:75000,p1:100000,p2:250000,an:'Pranit',poc:'Justin',dt:'2026-02-15',loc:'Burj Khalifa District',url:'',str:['100% card-based sales','Parent entity support available'],wk:['Labour 35%; rent 16.9%','Declining H2 revenue','Financial health 39.0 — NO MATCH'],dec:'Approved',rat:''},
  {id:'v12',gn:'RADISSON HOTEL',vn:'Issel',rg:'UAE',rev:2240000,fin:48,red:72,mz:55,ceil:1,la:22400,vr:3,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-01-20',loc:'',url:'',str:['Zero debt, owned premises (rent 0%)','Diversified revenue; license valid 2027; 6yr record'],wk:['Revenue contraction -33.1% H2 vs H1','Financial health 47.8 — High Risk'],dec:'Approved',rat:''},
  {id:'v13',gn:'RADISSON HOTEL',vn:'Fire Lake Grill House',rg:'UAE',rev:7980000,fin:73,red:72,mz:72,ceil:3,la:239500,vr:2,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-01-20',loc:'Damac Hills, Dubai',url:'',str:['6 years ops; zero debt; excellent DBR','Positive H2 growth +6.5%'],wk:['Salary/revenue 32% above benchmark'],dec:'Approved',rat:''},
  {id:'v14',gn:'RADISSON HOTEL',vn:'Hills Pool Deck',rg:'UAE',rev:2410000,fin:50,red:70,mz:56,ceil:1,la:24100,vr:3,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-01-20',loc:'',url:'',str:['6yr longevity; zero bank debt; 88% card revenue'],wk:['Salary 35%; growth decline -22.6%'],dec:'Approved',rat:''},
  {id:'v15',gn:'ROSY HOSPITALITY',vn:'CQ Brasserie',rg:'UAE',rev:22950000,fin:65,red:57,mz:63,ceil:2,la:459100,vr:2,pi:70000,p1:550000,p2:1300000,an:'Pranit',poc:'Justin',dt:'2026-02-28',loc:'Barsha Heights',url:'',str:['Zero debt; excellent LTM AED 22.95M','Rent/revenue 7.62% — lean'],wk:['Revenue growth -23%','1.4 years history only'],dec:'Approved',rat:''},
  {id:'v16',gn:'ROSY HOSPITALITY',vn:'Coquley',rg:'UAE',rev:24700000,fin:96,red:60,mz:85,ceil:4,la:988000,vr:1,pi:70000,p1:550000,p2:1300000,an:'Pranit',poc:'Justin',dt:'2026-02-28',loc:'JLT',url:'',str:['10.2yr; zero debt; rent 3.63%; 14 green flags, 0 red','TL valid Dec-2029','Financial 96.0 — near-perfect'],wk:['Tenancy expires May-2026 — 50% cap until renewal'],dec:'Approved',rat:''},
  {id:'v17',gn:'ROSY HOSPITALITY',vn:'Girl and the Goose',rg:'UAE',rev:7600000,fin:72,red:63,mz:69,ceil:2,la:152000,vr:2,pi:70000,p1:550000,p2:1300000,an:'Pranit',poc:'Justin',dt:'2026-02-28',loc:'Business Bay',url:'',str:['Zero debt; POS ~95% card; 13yr operator'],wk:['Rent ~26%; salaries ~28%','Tenancy lapsed Dec-2025'],dec:'Approved',rat:''},
  {id:'v18',gn:'VKD Hospitality',vn:'Miss Lilly',rg:'UAE',rev:16879043,fin:79,red:76,mz:79,ceil:3,la:506400,vr:2,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-03-10',loc:'',url:'',str:['Zero debt; rent 4.74%; salary 30%','AED 16.9M base; 89% card; 6 green, 0 red','B+ LOW RISK'],wk:[],dec:'Approved',rat:''},
  // ═══ SUNSET HOSPITALITY GROUP — 12 venues ═══
  {id:'v19',gn:'Sunset Hospitality Group',vn:'Sky Pool Cafe & Restaurant',rg:'UAE',rev:150609099,fin:90.6,red:90.8,mz:90.6,ceil:4,la:6024364,vr:1,pi:4788250,p1:4788250,p2:4788250,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Nakheel Malls',url:'',str:['Highest venue score 90.6 — A+ grade','AED 150.6M LTM — 25.2% of group revenue','6 green flags, 0 red flags','1.35% rent/revenue — exceptional','Qlub active; 115K monthly visits'],wk:['TL expires 25 May 2026 (~47 days) — within 60-day advisory window','Confirm renewal before drawdown'],dec:'Approved',rat:''},
  {id:'v20',gn:'Sunset Hospitality Group',vn:'Cloud Fifty One Cafe & Restaurant',rg:'UAE',rev:118954694,fin:90.8,red:80.4,mz:87.7,ceil:4,la:4758188,vr:1,pi:4788250,p1:4788250,p2:4788250,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'The Palm',url:'',str:['87.7 Mezza — Grade A','AED 118.9M LTM — 19.9% of group','5 green flags, 0 red flags','Strong revenue scale and brand presence'],wk:['TL expires 25 May 2026 (~47 days)','Tenancy expires 30 Sep 2026 (~175 days) — approaching advisory threshold'],dec:'Approved',rat:''},
  {id:'v21',gn:'Sunset Hospitality Group',vn:'Epik Entertainment LLC FZ',rg:'UAE',rev:56691936,fin:86.3,red:71.0,mz:81.7,ceil:4,la:2267677,vr:1,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Nad Al Shiba',url:'',str:['81.7 Mezza — Grade A','5 green flags','Long tenancy secured to Oct 2030'],wk:['HARD HOLD — TL EXPIRED 18 Mar 2026','Venue temporarily closed','No disbursement until TL renewed and venue reopened','Extreme trough month AED 473K — 10% of avg'],dec:'Approved',rat:'Hard Hold — TL Expired + Closed'},
  {id:'v22',gn:'Sunset Hospitality Group',vn:'Dream Restaurant and Cafe',rg:'UAE',rev:38456710,fin:90.8,red:72.8,mz:85.4,ceil:4,la:1538268,vr:1,pi:4788250,p1:4788250,p2:4788250,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Marsa Dubai',url:'',str:['85.4 Mezza — Grade A','5 green flags, 0 red flags','Both TL and Tenancy green — fast-track approved','Conservative & moderate tier cleared'],wk:[],dec:'Approved',rat:'Fast-track'},
  {id:'v23',gn:'Sunset Hospitality Group',vn:'Mott Restaurant and Cafe',rg:'UAE',rev:23477243,fin:84.7,red:83.9,mz:84.4,ceil:4,la:939090,vr:1,pi:4788250,p1:4788250,p2:4788250,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Dubai Marina',url:'',str:['84.4 Mezza — Grade A','6 green flags, 0 red flags','Strongest H2 growth in portfolio: +61.3%','No conditions at conservative/moderate tier'],wk:[],dec:'Approved',rat:''},
  {id:'v24',gn:'Sunset Hospitality Group',vn:'Signor Sassi Restaurant',rg:'UAE',rev:36362155,fin:84.7,red:82.8,mz:84.1,ceil:4,la:1454486,vr:1,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Palm Jumeirah',url:'',str:['84.1 Mezza — Grade A','6 green flags','AED 1,230 AOV; Qlub active; 100% UAE/GCC audience','Tenancy secure to Sep 2028'],wk:['CRITICAL — TL expires 24 Apr 2026 (~14 days)','Hard lending hold until renewal confirmed','Contact operator TODAY'],dec:'Approved',rat:'Critical TL — contact immediately'},
  {id:'v25',gn:'Sunset Hospitality Group',vn:'Stage Entertainments L.L.C-FZ',rg:'UAE',rev:43248733,fin:77.4,red:83.6,mz:83.6,ceil:4,la:1729949,vr:1,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Meydan',url:'',str:['83.6 Mezza — Grade A','8 green flags — most in group','7yr tenure; 100% card revenue; AED 1,250 AOV','Best underlying case post-renewal','Tenancy secure to Nov 2027'],wk:['HARD HOLD — TL EXPIRED 18 Mar 2026 (23 days ago)','Operating without valid license — regulatory breach','No disbursement until renewed TL in hand'],dec:'Approved',rat:'Hard Hold — TL Expired'},
  {id:'v26',gn:'Sunset Hospitality Group',vn:'Sunset Harbour Restaurant',rg:'UAE',rev:26303609,fin:82.8,red:82.6,mz:82.7,ceil:4,la:1052144,vr:1,pi:4788250,p1:4788250,p2:4788250,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Marsa Dubai',url:'',str:['82.7 Mezza — Grade A','6 green flags, 0 red flags','+48.8% H2 growth; highest website engagement (230s)','Conservative/moderate approved'],wk:[],dec:'Approved',rat:''},
  {id:'v27',gn:'Sunset Hospitality Group',vn:'Azure Restaurant',rg:'UAE',rev:46632434,fin:79.0,red:86.7,mz:81.3,ceil:4,la:1865297,vr:1,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Rixos JBR',url:'',str:['81.3 Mezza — Grade A','7 green flags — tied highest','AED 46.6M LTM; Qlub active; diversified revenue; +16.8% YoY','25% direct web traffic — strong brand recall'],wk:['CRITICAL — TL expires 30 Apr 2026 (~22 days)','No disbursement until renewal confirmed'],dec:'Approved',rat:'Critical TL'},
  {id:'v28',gn:'Sunset Hospitality Group',vn:'Sunset JI Gym',rg:'UAE',rev:30431276,fin:84.4,red:75.3,mz:81.7,ceil:4,la:1217251,vr:1,pi:4788250,p1:4788250,p2:4788250,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Jumeirah Islands',url:'',str:['81.7 Mezza — Grade A','6 green flags, 0 red flags','91% card revenue; 5.1yr tenure','Longest tenancy in portfolio (~5yr to Mar 2031)'],wk:[],dec:'Approved',rat:''},
  {id:'v29',gn:'Sunset Hospitality Group',vn:'Hanu Restaurant and Cafe',rg:'UAE',rev:18627734,fin:71.8,red:84.2,mz:75.5,ceil:3,la:558832,vr:2,pi:186277,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Nakheel Mall, Palm',url:'',str:['75.5 Mezza — Grade B+','6 green flags','+48.4% H2 momentum — strong growth','Tenancy secure to Feb 2028'],wk:['Rent/revenue 16.09% — exceeds 15% threshold','TL expires 19 Jun 2026 (~71 days)','Conservative tier only until rent normalises'],dec:'Approved',rat:'Conservative only — rent flag'},
  {id:'v30',gn:'Sunset Hospitality Group',vn:'Gold Fish A N Restaurant',rg:'UAE',rev:8735689,fin:71.0,red:78.7,mz:73.3,ceil:3,la:262071,vr:2,pi:87357,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-10',loc:'Al Wasl',url:'',str:['73.3 Mezza — Grade B+','6 green flags','TL valid Dec 2026; Tenancy to Dec 2030'],wk:['59% delivery revenue concentration','In-venue base only ~AED 3.6M for Mezza sizing','-8.1% H2 decline — steepest in group','Conservative only; advance vs in-venue base'],dec:'Approved',rat:'Conservative — delivery concentration'},
  // ═══ SOLUTIONS LEISURE GROUP — 7 venues ═══
  {id:'v31',gn:'Solutions Leisure Group',vn:'Lock Stock & Barrel Dubai Marina',rg:'UAE',rev:16491092,fin:78.5,red:82.2,mz:79.6,ceil:3,la:494733,vr:2,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-14',loc:'Dubai Marina',url:'',str:['79.6 Mezza — Grade B+','Strong H2 acceleration; excellent revenue momentum','Zero existing debt','Established nightlife brand with loyal base','Tenancy confirmed to Dec 2028'],wk:['TL expires 10 Nov 2026 — monitoring window','Spartans Investment concentration risk'],dec:'Approved',rat:''},
  {id:'v32',gn:'Solutions Leisure Group',vn:'Lock Stock & Barrel JBR',rg:'UAE',rev:42745453,fin:73.9,red:83.9,mz:76.9,ceil:3,la:1282364,vr:2,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-14',loc:'JBR, Dubai',url:'',str:['76.9 Mezza — Grade B+','Most tenured venue in portfolio','Zero existing debt','Strong H2 acceleration Oct-Mar','AED 42.7M LTM — largest in Solutions Leisure'],wk:['TL expires 25 Jul 2026 — confirm renewal by May 2026','Deep mid-year trough Jun-Aug','Cross-entity signatory risk (Paul John Evans across 3 entities)'],dec:'Approved',rat:''},
  {id:'v33',gn:'Solutions Leisure Group',vn:'Asia Asia Pier 7',rg:'UAE',rev:34015428,fin:88.9,red:80.2,mz:86.3,ceil:4,la:1360617,vr:1,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-14',loc:'Dubai Marina (Pier 7)',url:'',str:['86.3 Mezza — Grade A','Joint highest green flags in portfolio','Zero debt; Qlub active; +30.9% H2 growth','Diversified revenue: Dining Flow + B2B channels','Premiere Pier 7 location','TL and Tenancy both comfortable windows'],wk:['TL expires 28 Oct 2026 — initiate renewal planning','Tenancy expires 28 Apr 2027'],dec:'Approved',rat:''},
  {id:'v34',gn:'Solutions Leisure Group',vn:'Asia Asia The Palm',rg:'UAE',rev:9022382,fin:79.3,red:80.3,mz:79.6,ceil:3,la:270671,vr:2,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-14',loc:'The Palm',url:'',str:['79.6 Mezza — Grade B+','Zero existing debt','Strong brand extension from Pier 7 flagship'],wk:['Rent/revenue 16% exceeds threshold — hard condition','Missing Tenancy/Ejari documentation','TL expires 28 Oct 2026','Conservative only until rent normalises + tenancy provided'],dec:'Approved',rat:'Conservative — rent flag + missing tenancy'},
  {id:'v35',gn:'Solutions Leisure Group',vn:'The 305 Beach Club',rg:'UAE',rev:9129992,fin:66.2,red:79.2,mz:70.1,ceil:3,la:273900,vr:2,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-14',loc:'Palm Jumeirah',url:'',str:['70.1 Mezza — Grade B+','Zero existing debt','Strong domestic audience mix','TL valid Mar 2027; Tenancy Jun 2028 — both green'],wk:['Financial score 66.2 — 2nd lowest in portfolio','Ceiling constrained by revenue scale','Cross-signatory risk with Paul John Evans'],dec:'Approved',rat:''},
  {id:'v36',gn:'Solutions Leisure Group',vn:'ULA Beach Club FZE',rg:'UAE',rev:32731433,fin:72.5,red:74.4,mz:73.1,ceil:3,la:981943,vr:2,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-14',loc:'Palm Jumeirah',url:'',str:['73.1 Mezza — Grade B+','Zero existing debt','Strong Palm Jumeirah brand presence','Equal organic and direct web traffic'],wk:['CRITICAL — TL expires 18 Apr 2026 (4 DAYS)','Tenancy expires 31 Jul 2026 (~108 days)','HARD HOLD until TL renewed','Rent above threshold — confirm lease renewal'],dec:'Approved',rat:'CRITICAL — TL expires in days'},
  {id:'v37',gn:'Solutions Leisure Group',vn:'Tranquil Hills Restaurant',rg:'UAE',rev:3322558,fin:36.5,red:74.8,mz:48.0,ceil:0,la:0,vr:0,pi:0,p1:0,p2:0,an:'Pranit',poc:'Justin',dt:'2026-04-14',loc:'Al Thanayah Fourth',url:'',str:['Zero existing debt — clean balance sheet','36K visits/month digital launch','Strong UAE/GCC domestic audience','95%+ card revenue — excellent traceability'],wk:['Financial health 36.5 — CRITICAL NO MATCH','Mezza 48.0 — below all lending thresholds','DECLINE — structural red flags','Rent and cost structure fundamentally unviable'],dec:'Rejected',rat:'DECLINE — score 48.0'},
];

const venueFromDB = v => ({
  id: v.id,
  gn: v.group_name ?? v.gn,
  vn: v.venue_name ?? v.vn,
  rg: v.region ?? v.rg,
  rev: v.revenue ?? v.rev,
  fin: v.fin_score ?? v.fin,
  red: v.red_score ?? v.red,
  mz: v.mezza_score ?? v.mz,
  ceil: v.ceiling_pct ?? v.ceil,
  la: v.lending_amt ?? v.la,
  vr: v.votes_required ?? v.vr,
  pi: v.pilot ?? v.pi,
  p1: v.p1,
  p2: v.p2,
  an: v.analyst ?? v.an,
  poc: v.poc,
  dt: v.case_date ?? v.dt,
  loc: v.location ?? v.loc,
  url: v.sheet_url ?? v.url,
  str: v.strengths ?? v.str ?? [],
  wk: v.weaknesses ?? v.wk ?? [],
  dec: v.decision ?? v.dec,
  rat: v.rationale ?? v.rat,
});
const venueToDB = v => ({
  id: v.id,
  group_name: v.gn || '', venue_name: v.vn || '', region: v.rg || 'UAE',
  revenue: +v.rev || 0, fin_score: +v.fin || 0, red_score: +v.red || 0,
  mezza_score: v.mz != null && v.mz !== '' && !isNaN(+v.mz) ? +v.mz : null,
  ceiling_pct: +v.ceil || 0, lending_amt: +v.la || 0, votes_required: +v.vr || 0,
  pilot: +v.pi || 0, p1: +v.p1 || 0, p2: +v.p2 || 0,
  analyst: v.an || '', poc: v.poc || '', case_date: v.dt || null,
  location: v.loc || '', sheet_url: v.url || '',
  strengths: Array.isArray(v.str) ? v.str.filter(Boolean) : [],
  weaknesses: Array.isArray(v.wk) ? v.wk.filter(Boolean) : [],
  decision: v.dec || null, rationale: v.rat || '',
});

const BANDS=[{min:90,max:100,c:5,v:1,g:'A+'},{min:80,max:89.99,c:4,v:1,g:'A'},{min:70,max:79.99,c:3,v:2,g:'B+'},{min:60,max:69.99,c:2,v:2,g:'B'},{min:55,max:59.99,c:1,v:3,g:'C+'},{min:50,max:54.99,c:1,v:3,g:'C'},{min:0,max:49.99,c:0,v:0,g:'NM'}];
const gB=s=>BANDS.find(b=>s>=b.min&&s<=b.max)||BANDS[6];
const sc=s=>s>=90?'#00c86e':s>=75?'#2ecc71':s>=60?'#52c8b0':s>=50?'#d4a800':s>=25?'#e08800':'#d43030';
const fm=n=>{if(!n&&n!==0)return'N/A';if(n>=1e6)return'AED '+(n/1e6).toFixed(2)+'M';if(n>=1e3)return'AED '+(n/1e3).toFixed(1)+'K';return'AED '+n.toLocaleString();};
const pt=(v,t)=>t?(v/t*100).toFixed(1)+'%':'';
const CC=['#ff6b35','#00c86e','#2ecc71','#52c8b0','#d4a800','#e08800','#d43030','#8b5cf6','#3b82f6','#ec4899'];
const DECS=['Approved','Rejected','Approval Overridden','Rejection Overridden'];
const decColor=d=>d==='Approved'||d==='Approval Overridden'?'#00c86e':d==='Rejected'||d==='Rejection Overridden'?'#d43030':'#888078';
const decBg=d=>d==='Approved'||d==='Approval Overridden'?'rgba(0,200,110,.12)':d==='Rejected'||d==='Rejection Overridden'?'rgba(212,48,48,.12)':'#1e1e1e';
const DISB_OPTS=['Recommended','Custom'];
const CASE_STATUSES = [
  'Approved','Rejected','Additional Info Requested','Documents Incomplete',
  'Disbursed Pilot','Disbursed P1','Disbursed P2',
  'Rejected & Appealed','Approved & Appealed'
];
const statusColor = s => {
  if (s?.includes('Disbursed')) return '#00c86e';
  if (s === 'Approved' || s === 'Approved & Appealed') return '#2ecc71';
  if (s === 'Rejected' || s === 'Rejected & Appealed') return '#d43030';
  if (s?.includes('Info') || s?.includes('Documents')) return '#d4a800';
  return '#888078';
};
// Group-level recommended = ceiling% × group LTM (not sum of venue la)
function grpRecommended(vl) {
  const tr = vl.reduce((s, x) => s + (x.rev || 0), 0);
  const wM = tr > 0 ? vl.reduce((s, x) => s + (x.mz || 0) * (x.rev || 0), 0) / tr : 0;
  const band = gB(wM);
  return Math.round(tr * band.c / 100);
}
function getDisb(vl, sel, customAmt) {
  if (sel === 'Custom' && customAmt > 0) return customAmt;
  return grpRecommended(vl);
}

function Bdg({s, big}) {
  const b = gB(s), c = sc(s);
  const sz = big ? { padding: '6px 14px', fontSize: 15, fontWeight: 900 } : { padding: '4px 10px', fontSize: 13, fontWeight: 800 };
  if (s == null || isNaN(s)) return null;
  return <span style={{ ...sz, borderRadius: 8, background: c + '25', color: c, whiteSpace: 'nowrap', display: 'inline-block', margin: 2, border: '1px solid ' + c + '40' }}>{s.toFixed(1)} <span style={{ fontSize: big ? 12 : 10, opacity: .8 }}>{b.g}</span></span>;
}

const C = { background: '#161616', border: '2px solid rgba(255,135,53,.15)', borderRadius: 14, padding: '22px 26px' };
const CL = { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.4, color: '#888078', marginBottom: 10 };
const I = { width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,.12)', background: '#1e1e1e', color: '#f2ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box' };
const BG = { padding: '8px 18px', borderRadius: 6, border: '1px solid rgba(255,107,53,.4)', background: 'rgba(255,107,53,.1)', color: '#ff6b35', fontWeight: 700, fontSize: 13, cursor: 'pointer' };
const bS = a => ({ padding: '5px 14px', borderRadius: 6, border: a ? '1px solid rgba(255,107,53,.5)' : '1px solid rgba(255,255,255,.12)', background: a ? 'rgba(255,107,53,.12)' : 'transparent', color: a ? '#ff6b35' : '#888078', fontSize: 11, fontWeight: 600, cursor: 'pointer' });
const bW = a => ({ padding: '5px 14px', borderRadius: 6, border: a ? '1px solid rgba(255,107,53,.5)' : '1px solid #ddd', background: a ? 'rgba(255,107,53,.1)' : '#fff', color: a ? '#ff6b35' : '#666', fontSize: 11, fontWeight: 600, cursor: 'pointer' });
const tt = { background: '#1e1e1e', border: '1px solid rgba(255,107,53,.2)', borderRadius: 8, fontSize: 12, color: '#f2ede8' };

function FI({ l, v, o, s, t, p }) { return <div><label style={{ fontSize: 9, fontWeight: 600, color: '#888078', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>{l}</label><input type={t || 'text'} value={v == null ? '' : v} onChange={e => o(e.target.value)} placeholder={p || ''} style={s} /></div>; }
function Modal({ children, onClose }) { return <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}><div onClick={e => e.stopPropagation()} style={{ background: '#161616', border: '2px solid rgba(255,107,53,.2)', borderRadius: 16, padding: 24, maxWidth: 880, width: '94%', maxHeight: '88vh', overflow: 'auto', position: 'relative' }}><button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', color: '#888078', cursor: 'pointer', fontSize: 18 }}>×</button>{children}</div></div>; }

export default function App() {
  const [venues, setVenues] = useState([]);
  const [region, setRegion] = useState('ALL');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState(true);
  const [tab, setTab] = useState('portfolio');
  const [showForm, setShowForm] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiText, setAiText] = useState('');
  const [aiUrls, setAiUrls] = useState('');
  const [aiFiles, setAiFiles] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [decs, setDecs] = useState({});
  const [rats, setRats] = useState({});
  const [aView, setAView] = useState('group');
  const [cFilt, setCFilt] = useState(null);
  const [globalDisb, setGlobalDisb] = useState('Recommended');
  const [grpDisb, setGrpDisb] = useState({});
  const [tracker, setTracker] = useState({}); // {groupName: {status,pilotAmt,pilotDate,p1Amt,p1Date,p2Date,notes}}
  const [loading, setLoading] = useState(true);
  const fileRef = useRef(null);

  const empty = { gn: '', vn: '', rg: 'UAE', rev: 0, fin: 0, red: 0, mz: null, ceil: 0, la: 0, vr: 0, pi: 0, p1: 0, p2: 0, an: 'Pranit', poc: 'Justin', dt: new Date().toISOString().split('T')[0], loc: '', url: '', str: [''], wk: [''] };
  const [form, setForm] = useState(empty);

  const fetchAll = useCallback(async () => {
    const [{ data: vd }, { data: gd }, { data: td }] = await Promise.all([
      supabase.from('venues').select('*').order('id'),
      supabase.from('groups').select('*'),
      supabase.from('tracker').select('*'),
    ]);
    if (vd) setVenues(vd.map(venueFromDB));
    if (gd?.length) {
      const dc = {}, rt = {}, gdMap = {};
      gd.forEach(row => {
        const key = row.name;
        if (row.decision) dc[key] = row.decision;
        if (row.rationale) rt[key] = row.rationale;
        gdMap[key] = { mode: row.disb_mode || 'Recommended', customAmt: row.custom_amt || 0, p1Amt: row.p1_amt || 0, p2Amt: row.p2_amt || 0, pilotDisbursed: row.pilot_disbursed || 0, p1Disbursed: row.p1_disbursed || 0, p2Disbursed: row.p2_disbursed || 0 };
      });
      setDecs(dc); setRats(rt); setGrpDisb(gdMap);
    }
    if (td?.length) {
      const tk = {};
      td.forEach(row => { tk[row.group_name] = { status: row.status || '', pilotAmt: row.pilot_amt || 0, pilotDate: row.pilot_date || '', p1Amt: row.p1_amt || 0, p1Date: row.p1_date || '', p2Date: row.p2_date || '', notes: row.notes || '' }; });
      setTracker(tk);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let mounted = true;
    fetchAll().catch(console.error).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [fetchAll]);

  const saveGrp = async (gn, d, r, gd) => {
    const g = gd[gn] || {};
    const { error } = await supabase.from('groups').upsert({ name: gn, decision: d[gn] || 'Pending', rationale: r[gn] || '', disb_mode: g.mode || 'Recommended', custom_amt: g.customAmt || 0, p1_amt: g.p1Amt || 0, p2_amt: g.p2Amt || 0, pilot_disbursed: g.pilotDisbursed || 0, p1_disbursed: g.p1Disbursed || 0, p2_disbursed: g.p2Disbursed || 0 }, { onConflict: 'name' });
    if (error) console.error('saveGrp:', error.message);
  };
  const saveTk = async (gn, tk) => {
    const t = tk[gn] || {};
    const { error } = await supabase.from('tracker').upsert({ group_name: gn, status: t.status || '', pilot_amt: t.pilotAmt || 0, pilot_date: t.pilotDate || null, p1_amt: t.p1Amt || 0, p1_date: t.p1Date || null, p2_date: t.p2Date || null, notes: t.notes || '' }, { onConflict: 'group_name' });
    if (error) console.error('saveTk:', error.message);
  };

  const saveVenue = async () => {
    if (!form.gn?.trim() || !form.vn?.trim()) return;
    const m = form.mz != null && form.mz !== '' && !isNaN(+form.mz) ? +form.mz : Math.round((+form.fin || 0) * 0.7 + (+form.red || 0) * 0.3);
    const entry = { ...form, mz: m, pi: (+form.p2 || 0) * 0.2, str: (form.str || []).filter(Boolean), wk: (form.wk || []).filter(Boolean) };
    setForm(empty); setEditId(null); setShowForm(false);

    // Ensure the group row exists before writing the venue (prevents FK violations and missing group data)
    const gd = grpDisb[form.gn] || {};
    await supabase.from('groups').upsert(
      { name: form.gn, decision: decs[form.gn] || 'Pending', rationale: rats[form.gn] || '', disb_mode: gd.mode || 'Recommended', custom_amt: gd.customAmt || 0, p1_amt: gd.p1Amt || 0, p2_amt: gd.p2Amt || 0, pilot_disbursed: gd.pilotDisbursed || 0, p1_disbursed: gd.p1Disbursed || 0, p2_disbursed: gd.p2Disbursed || 0 },
      { onConflict: 'name' }
    );

    if (editId) {
      entry.id = editId;
      const { error } = await supabase.from('venues').upsert(venueToDB(entry), { onConflict: 'id' });
      if (error) { alert('Save failed — ' + error.message); await fetchAll(); return; }
    } else {
      const dbRow = venueToDB(entry);
      delete dbRow.id;
      const { error } = await supabase.from('venues').insert(dbRow);
      if (error) { alert('Save failed — ' + error.message); return; }
    }
    await fetchAll();
  };
  const delV = async id => {
    const { error } = await supabase.from('venues').delete().eq('id', id);
    if (error) { alert('Delete failed — ' + error.message); return; }
    await fetchAll();
  };
  const editV = v => { setForm({ ...v, str: v.str?.length ? v.str : [''], wk: v.wk?.length ? v.wk : [''] }); setEditId(v.id); setShowForm(true); };
  const setDc = (g, val) => { const d = { ...decs, [g]: val }; setDecs(d); saveGrp(g, d, rats, grpDisb); };
  const setRt = (g, val) => { const r = { ...rats, [g]: val }; setRats(r); saveGrp(g, decs, r, grpDisb); };
  const setGD = (g, patch) => { const gd = { ...grpDisb, [g]: { ...(grpDisb[g] || {}), ...patch } }; setGrpDisb(gd); saveGrp(g, decs, rats, gd); };
  const setTk = (g, patch) => { const tk = { ...tracker, [g]: { ...(tracker[g] || {}), ...patch } }; setTracker(tk); saveTk(g, tk); };
  const disbModeFor = gn => (grpDisb[gn]?.mode) || globalDisb;

  const exportCSV = () => { const rows = venues.map(v => [v.gn, v.vn, v.fin, v.red, v.mz, gB(v.mz).g, v.rev, v.la, v.pi, v.p1, v.p2, v.an, v.poc, v.dt, v.loc].map(c => `"${c}"`).join(',')); const csv = 'Group,Venue,Fin,Red,Mezza,Grade,Rev,Lending,Pilot,P1,P2,Analyst,POC,Date,Loc\n' + rows.join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'mezza.csv'; a.click(); };
  const exportJSON = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ v: venues, d: decs, r: rats, gd: grpDisb, tk: tracker }, null, 2)], { type: 'application/json' })); a.download = 'mezza.json'; a.click(); };
  const importJSON = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = async ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.v) {
          // Groups first (prevents FK violations)
          const gnSet = new Set([...d.v.map(v => v.gn).filter(Boolean), ...Object.keys(d.d || {}), ...Object.keys(d.r || {}), ...Object.keys(d.gd || {})]);
          const grpRows = [...gnSet].map(gn => { const g = (d.gd || {})[gn] || {}; return { name: gn, decision: (d.d || {})[gn] || 'Pending', rationale: (d.r || {})[gn] || '', disb_mode: g.mode || 'Recommended', custom_amt: g.customAmt || 0, p1_amt: g.p1Amt || 0, p2_amt: g.p2Amt || 0, pilot_disbursed: g.pilotDisbursed || 0, p1_disbursed: g.p1Disbursed || 0, p2_disbursed: g.p2Disbursed || 0 }; });
          if (grpRows.length) await supabase.from('groups').upsert(grpRows, { onConflict: 'name' });
          // Venues: upsert if integer id exists, otherwise insert fresh (lets DB assign id)
          await Promise.all(d.v.map(async v => {
            const dbRow = venueToDB(v);
            if (Number.isInteger(dbRow.id)) {
              await supabase.from('venues').upsert(dbRow, { onConflict: 'id' });
            } else {
              delete dbRow.id;
              await supabase.from('venues').insert(dbRow);
            }
          }));
          const tkRows = Object.entries(d.tk || {}).map(([gn, t]) => ({ group_name: gn, status: t.status || '', pilot_amt: t.pilotAmt || 0, pilot_date: t.pilotDate || null, p1_amt: t.p1Amt || 0, p1_date: t.p1Date || null, p2_date: t.p2Date || null, notes: t.notes || '' }));
          if (tkRows.length) await supabase.from('tracker').upsert(tkRows, { onConflict: 'group_name' });
          await fetchAll();
        }
      } catch (err) { alert('Import failed — ' + err.message); }
    };
    r.readAsText(f);
  };

  const handleAIF = e => { Promise.all(Array.from(e.target.files).map(f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res({ name: f.name, type: f.type, data: r.result.split(',')[1] }); r.onerror = rej; r.readAsDataURL(f); }))).then(setAiFiles); };
  const parseAI = async () => { setAiLoading(true); try { const parts = []; aiFiles.forEach(f => { if (f.type.startsWith('image/')) parts.push({ type: 'image', source: { type: 'base64', media_type: f.type, data: f.data } }); }); let p = 'Extract venue data. Return ONLY JSON:\n{"gn":"","vn":"","fin":0,"red":0,"mz":null,"rev":0,"ceil":0,"la":0,"vr":0,"pi":0,"p1":0,"p2":0,"dt":"YYYY-MM-DD","an":"","poc":"","rg":"UAE","loc":"","url":"","str":[""],"wk":[""]}\n'; if (aiUrls) p += '\nURLs: ' + aiUrls; if (aiText) p += '\n' + aiText; parts.push({ type: 'text', text: p }); const resp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: parts }] }) }); const data = await resp.json(); const t = data.content.find(i => i.type === 'text')?.text || ''; setAiResult(JSON.parse(t.replace(/```json|```/g, '').trim())); } catch (err) { alert('Error: ' + err.message); } finally { setAiLoading(false); } };
  const applyAI = () => { if (aiResult) { setForm({ ...empty, ...aiResult, str: aiResult.str || [''], wk: aiResult.wk || [''] }); setAiResult(null); setAiText(''); setAiUrls(''); setAiFiles([]); setShowAI(false); setShowForm(true); } };

  // Filtering
  let filt = region === 'ALL' ? venues : venues.filter(x => x.rg === region);
  if (cFilt) {
    if (cFilt.t === 'group') filt = filt.filter(x => x.gn === cFilt.v);
    else { const b = BANDS.find(x => x.g === cFilt.v); if (b) filt = filt.filter(x => x.mz >= b.min && x.mz <= b.max); }
  }
  const srch = filt.filter(x => { const t = search.toLowerCase(); return !t || x.gn.toLowerCase().includes(t) || x.vn.toLowerCase().includes(t); });
  const grps = {}; srch.forEach(x => { if (!grps[x.gn]) grps[x.gn] = []; grps[x.gn].push(x); });
  const all = region === 'ALL' ? venues : venues.filter(x => x.rg === region);
  const tRev = all.reduce((s, x) => s + (x.rev || 0), 0);
  const nGrp = new Set(all.map(x => x.gn)).size;
  const wM = tRev > 0 ? all.reduce((s, x) => s + (x.mz || 0) * (x.rev || 0), 0) / tRev : 0;

  // Total selected disbursal across portfolio
  const allGrps = {};
  all.forEach(x => { if (!allGrps[x.gn]) allGrps[x.gn] = []; allGrps[x.gn].push(x); });
  const totalSelDisb = Object.entries(allGrps).reduce((s, [gn, vl]) => s + getDisb(vl, disbModeFor(gn), grpDisb[gn]?.customAmt || 0), 0);

  if (loading) return <div style={{ background: '#161616', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}><div style={{ color: '#555', fontSize: 13, letterSpacing: 1 }}>LOADING…</div></div>;

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: '#fff', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: '#161616', borderBottom: '2px solid rgba(255,107,53,.3)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#ff6b35,#ff8e53)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15 }}>M</div>
          <span style={{ fontWeight: 900, fontSize: 15, letterSpacing: 2, color: '#ff6b35' }}>MEZZA</span>
        </div>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
          {['portfolio', 'tracker', 'analytics'].map(t => <button key={t} onClick={() => { setTab(t); setCFilt(null); }} style={{ ...bS(tab === t), textTransform: 'uppercase', letterSpacing: 1 }}>{t}</button>)}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.1)', margin: '0 3px' }} />
          {['ALL', 'UAE', 'USA'].map(r => <button key={r} onClick={() => setRegion(r)} style={bS(region === r)}>{r}</button>)}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.1)', margin: '0 3px' }} />
          <span style={{ fontSize: 10, color: '#888078', marginRight: 2 }}>Default:</span>
          {['Recommended','Custom'].map(d => <button key={d} onClick={() => setGlobalDisb(d)} style={{ ...bS(globalDisb === d), fontSize: 10, padding: '4px 10px' }}>{d}</button>)}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.1)', margin: '0 3px' }} />
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(empty); }} style={{ ...BG, fontSize: 11, padding: '5px 12px' }}>+ Add</button>
          <button onClick={() => setShowAI(true)} style={{ ...BG, fontSize: 11, padding: '5px 12px', background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.3)', color: '#8b5cf6' }}>✦ AI Import</button>
          <button onClick={exportCSV} style={{ ...bS(false), fontSize: 10 }}>CSV</button>
          <button onClick={exportJSON} style={{ ...bS(false), fontSize: 10 }}>JSON</button>
          <label style={{ ...bS(false), fontSize: 10, cursor: 'pointer' }}>Import<input type="file" accept=".json" onChange={importJSON} style={{ display: 'none' }} /></label>
          <button onClick={() => supabase.auth.signOut().catch(() => {})} style={{ ...bS(false), fontSize: 10, color: '#d43030', borderColor: 'rgba(212,48,48,.25)' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px' }}>
        {/* Stats — 5th card shows total selected disbursal */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 20 }}>
          <div style={C}><div style={CL}>GROUPS</div><div style={{ fontSize: 28, fontWeight: 900, color: '#f2ede8' }}>{nGrp}</div></div>
          <div style={C}><div style={CL}>VENUES</div><div style={{ fontSize: 28, fontWeight: 900, color: '#f2ede8' }}>{all.length}</div></div>
          <div style={C}><div style={CL}>TOTAL REVENUE</div><div style={{ fontSize: 28, fontWeight: 900, color: '#f2ede8' }}>AED {(tRev / 1e6).toFixed(1)}M</div></div>
          <div style={C}><div style={CL}>PORTFOLIO MEZZA</div><div style={{ fontSize: 28, fontWeight: 900, color: '#f2ede8' }}>{wM.toFixed(1)} / {gB(wM).g}</div></div>
          <div style={{ ...C, borderColor: 'rgba(255,107,53,.3)' }}><div style={{ ...CL, color: '#ff6b35' }}>TOTAL DISBURSAL ({globalDisb})</div><div style={{ fontSize: 28, fontWeight: 900, color: '#ff6b35' }}>{fm(totalSelDisb)}</div><div style={{ fontSize: 10, color: '#888078' }}>{tRev > 0 ? pt(totalSelDisb, tRev) + ' of LTM' : ''}</div></div>
        </div>

        {cFilt && <div style={{ marginBottom: 12, padding: '8px 14px', background: 'rgba(255,107,53,.06)', border: '1px solid rgba(255,107,53,.2)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#ff6b35', fontWeight: 600 }}>Filtered: {cFilt.v} ({srch.length} venues)</span>
          <button onClick={() => setCFilt(null)} style={{ background: 'transparent', border: '1px solid rgba(255,107,53,.3)', borderRadius: 4, color: '#ff6b35', cursor: 'pointer', padding: '2px 10px', fontSize: 11 }}>Clear ×</button>
        </div>}

        {tab === 'portfolio' && <PortfolioView grps={grps} notes={notes} setNotes={setNotes} search={search} setSearch={setSearch} decs={decs} rats={rats} editV={editV} delV={delV} setDc={setDc} setRt={setRt} globalDisb={globalDisb} grpDisb={grpDisb} setGD={setGD} disbModeFor={disbModeFor} />}
        {tab === 'tracker' && <TrackerView venues={all} decs={decs} rats={rats} tracker={tracker} setTk={setTk} disbModeFor={disbModeFor} grpDisb={grpDisb} />}
        {tab === 'analytics' && <AnalyticsView venues={all} grps={grps} aView={aView} setAView={setAView} setCFilt={setCFilt} setTab={setTab} globalDisb={globalDisb} grpDisb={grpDisb} disbModeFor={disbModeFor} />}
      </div>

      {/* FORM */}
      {showForm && <Modal onClose={() => { setShowForm(false); setEditId(null); }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ff6b35', margin: '0 0 16px' }}>✦ {editId ? 'Edit' : 'Add'} Venue</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <FI l="Group" v={form.gn} o={v => setForm({ ...form, gn: v })} s={I} />
          <FI l="Venue" v={form.vn} o={v => setForm({ ...form, vn: v })} s={I} />
          <FI l="Location" v={form.loc} o={v => setForm({ ...form, loc: v })} s={I} />
          <FI l="Date" v={form.dt} o={v => setForm({ ...form, dt: v })} s={I} t="date" />
          <FI l="Analyst" v={form.an} o={v => setForm({ ...form, an: v })} s={I} />
          <FI l="Commercial POC" v={form.poc} o={v => setForm({ ...form, poc: v })} s={I} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
          <FI l="Financial" v={form.fin} o={v => setForm({ ...form, fin: +v || 0 })} s={I} t="number" />
          <FI l="Redemption" v={form.red} o={v => setForm({ ...form, red: +v || 0 })} s={I} t="number" />
          <FI l="Mezza Override" v={form.mz || ''} o={v => setForm({ ...form, mz: v ? +v : null })} s={I} t="number" />
          <FI l="LTM Revenue" v={form.rev} o={v => setForm({ ...form, rev: +v || 0 })} s={I} t="number" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
          <FI l="Ceiling %" v={form.ceil} o={v => setForm({ ...form, ceil: +v || 0 })} s={I} t="number" />
          <FI l="Lending Amt" v={form.la} o={v => setForm({ ...form, la: +v || 0 })} s={I} t="number" />
          <FI l="Votes Req'd" v={form.vr} o={v => setForm({ ...form, vr: +v || 0 })} s={I} t="number" />
          <FI l="P1" v={form.p1} o={v => setForm({ ...form, p1: +v || 0 })} s={I} t="number" />
          <FI l="P2 (Final)" v={form.p2} o={v => setForm({ ...form, p2: +v || 0 })} s={I} t="number" />
        </div>
        <FI l="Sheet URL" v={form.url} o={v => setForm({ ...form, url: v })} s={{ ...I, marginTop: 8 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
          <div><label style={{ fontSize: 10, fontWeight: 700, color: '#00c86e', display: 'block', marginBottom: 4 }}>↑ STRENGTHS</label>{(form.str || ['']).map((s, i) => <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 3 }}><input value={s} onChange={e => { const a = [...(form.str || [''])]; a[i] = e.target.value; setForm({ ...form, str: a }); }} style={{ ...I, flex: 1, borderColor: 'rgba(0,200,110,.2)' }} />{i === (form.str || ['']).length - 1 && <button onClick={() => setForm({ ...form, str: [...(form.str || ['']), ''] })} style={{ background: 'transparent', border: '1px solid rgba(0,200,110,.3)', color: '#00c86e', borderRadius: 3, cursor: 'pointer', padding: '0 8px', fontSize: 14 }}>+</button>}</div>)}</div>
          <div><label style={{ fontSize: 10, fontWeight: 700, color: '#d43030', display: 'block', marginBottom: 4 }}>↓ WEAKNESSES</label>{(form.wk || ['']).map((s, i) => <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 3 }}><input value={s} onChange={e => { const a = [...(form.wk || [''])]; a[i] = e.target.value; setForm({ ...form, wk: a }); }} style={{ ...I, flex: 1, borderColor: 'rgba(212,48,48,.2)' }} />{i === (form.wk || ['']).length - 1 && <button onClick={() => setForm({ ...form, wk: [...(form.wk || ['']), ''] })} style={{ background: 'transparent', border: '1px solid rgba(212,48,48,.3)', color: '#d43030', borderRadius: 3, cursor: 'pointer', padding: '0 8px', fontSize: 14 }}>+</button>}</div>)}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={saveVenue} style={{ ...BG, flex: 1, padding: 12, fontSize: 14 }}>{editId ? 'Update' : 'Save'}</button>
          <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ padding: '12px 20px', borderRadius: 6, border: '1px solid #555', background: 'transparent', color: '#888', cursor: 'pointer' }}>Cancel</button>
        </div>
      </Modal>}

      {/* AI */}
      {showAI && <Modal onClose={() => setShowAI(false)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><span style={{ color: '#8b5cf6', fontSize: 16 }}>✦</span><h3 style={{ fontSize: 15, fontWeight: 700, color: '#f2ede8', margin: 0 }}>AI Smart Import</h3></div>
        <textarea value={aiText} onChange={e => setAiText(e.target.value)} placeholder="Paste text..." rows={4} style={{ ...I, minHeight: 60, resize: 'vertical', fontFamily: 'inherit', marginBottom: 8 }} />
        <FI l="URLs" v={aiUrls} o={setAiUrls} s={{ ...I, marginBottom: 8 }} />
        <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed rgba(139,92,246,.3)', borderRadius: 8, padding: 12, textAlign: 'center', cursor: 'pointer', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#8b5cf6', fontWeight: 600 }}>{aiFiles.length ? aiFiles.length + ' file(s)' : 'Upload screenshots / files'}</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*,.pdf" multiple onChange={handleAIF} style={{ display: 'none' }} />
        {!aiResult ? (
          <button onClick={parseAI} disabled={(!aiText && !aiUrls && !aiFiles.length) || aiLoading} style={{ width: '100%', padding: 10, borderRadius: 8, border: 'none', background: aiLoading ? '#333' : 'linear-gradient(135deg,#8b5cf6,#a78bfa)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{aiLoading ? 'Analysing...' : '✦ Parse with Claude'}</button>
        ) : (
          <div>
            <pre style={{ fontSize: 9, color: '#aaa', fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0, padding: 10, background: 'rgba(0,200,110,.06)', borderRadius: 8, marginBottom: 8, maxHeight: 150, overflow: 'auto' }}>{JSON.stringify(aiResult, null, 2)}</pre>
            <div style={{ display: 'flex', gap: 6 }}><button onClick={applyAI} style={{ ...BG, flex: 1, padding: 10 }}>Apply →</button><button onClick={() => { setAiResult(null); setAiText(''); }} style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #555', background: 'transparent', color: '#888', cursor: 'pointer' }}>Discard</button></div>
          </div>
        )}
      </Modal>}
    </div>
  );
}

/* ════ PORTFOLIO ════ */
function PortfolioView({ grps, notes, setNotes, search, setSearch, decs, rats, editV, delV, setDc, setRt, globalDisb, grpDisb, setGD, disbModeFor }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search groups or venues..." style={{ ...I, maxWidth: 340, background: '#f8f8f8', color: '#161616', border: '1px solid #ddd' }} />
        <button onClick={() => setNotes(!notes)} style={bW(notes)}>{notes ? 'Collapse notes' : 'Expand notes'}</button>
      </div>
      {Object.entries(grps).map(([gn, vl]) => {
        const tr = vl.reduce((s, x) => s + (x.rev || 0), 0);
        const wF = tr > 0 ? vl.reduce((s, x) => s + x.fin * (x.rev || 0), 0) / tr : 0;
        const wR = tr > 0 ? vl.reduce((s, x) => s + x.red * (x.rev || 0), 0) / tr : 0;
        const wM = tr > 0 ? vl.reduce((s, x) => s + (x.mz || 0) * (x.rev || 0), 0) / tr : 0;
        const gb = gB(wM);
        const recAmt = grpRecommended(vl);
        const gd = grpDisb[gn] || {};
        const mode = gd.mode || globalDisb;
        const customAmt = gd.customAmt || 0;
        const activeAmt = mode === 'Custom' && customAmt > 0 ? customAmt : recAmt;
        const p1Amt = gd.p1Amt || 0;
        const p2Amt = gd.p2Amt || 0;
        const pilotD = gd.pilotDisbursed || 0;
        const p1D = gd.p1Disbursed || 0;
        const p2D = gd.p2Disbursed || 0;
        const totalD = pilotD + p1D + p2D;
        const remain = activeAmt - totalD;
        const dec = decs[gn] || 'Pending';
        return (
          <div key={gn} style={{ background: '#161616', border: '2px solid rgba(255,107,53,.2)', borderRadius: 16, overflow: 'hidden', marginBottom: 18 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,107,53,.15)', background: 'linear-gradient(90deg,rgba(255,107,53,.06),transparent)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 17, fontWeight: 900, color: '#f2ede8' }}>{gn}</span>
              <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800, background: 'rgba(255,107,53,.15)', color: '#ff6b35', border: '1px solid rgba(255,107,53,.3)' }}>{vl.length} VENUE{vl.length > 1 ? 'S' : ''}</span>
              <span style={{ fontSize: 12, color: '#888078' }}>AED {(tr / 1e6).toFixed(2)}M LTM</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}><Bdg s={wF} big /><Bdg s={wR} big /><Bdg s={wM} big /></div>
            </div>
            {vl.map(v => {
              const vb = gB(v.mz);
              return (
                <div key={v.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.05)', display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: 14, alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#f2ede8' }}>{v.vn}</span>
                      <button onClick={() => editV(v)} style={{ background: 'rgba(255,107,53,.08)', border: '1px solid rgba(255,107,53,.25)', borderRadius: 4, color: '#ff6b35', cursor: 'pointer', padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>Edit</button>
                      <button onClick={() => delV(v.id)} style={{ background: 'rgba(212,48,48,.08)', border: '1px solid rgba(212,48,48,.2)', borderRadius: 4, color: '#d43030', cursor: 'pointer', padding: '2px 8px', fontSize: 10 }}>Delete</button>
                    </div>
                    <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>AED {(v.rev / 1e6).toFixed(2)}M · {tr > 0 ? ((v.rev / tr) * 100).toFixed(1) + '% of group' : ''}{v.loc ? ' · ' + v.loc : ''}</div>
                    <div style={{ marginBottom: 6 }}><Bdg s={v.fin} /><Bdg s={v.red} /><Bdg s={v.mz} /></div>
                    <div style={{ fontSize: 12, color: '#888078' }}>{v.an} · {v.poc} · {v.dt}</div>
                  </div>
                  {notes ? (
                    <div>
                      {(v.str || []).filter(Boolean).map((s, i) => <div key={i} style={{ color: '#00c86e', fontSize: 12, marginBottom: 3, lineHeight: 1.4 }}>↑ {s}</div>)}
                      {(v.wk || []).filter(Boolean).map((w, i) => <div key={i} style={{ color: '#d43030', fontSize: 12, marginBottom: 3, lineHeight: 1.4 }}>↓ {w}</div>)}
                    </div>
                  ) : <div />}
                  <div>
                    {v.ceil > 0 ? (
                      <div><span style={{ fontSize: 26, fontWeight: 900, color: sc(v.mz) }}>{v.ceil}%</span><span style={{ fontSize: 13, color: '#f2ede8', marginLeft: 8, fontWeight: 600 }}>{fm(v.la)}</span><div style={{ fontSize: 11, color: sc(v.mz), fontWeight: 600, marginTop: 2 }}>{v.vr} vote{v.vr > 1 ? 's' : ''} required · Score {v.mz.toFixed(1)} · {vb.g}</div></div>
                    ) : <div style={{ fontSize: 13, color: '#888078', fontWeight: 600 }}>NO MATCH</div>}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 8 }}>
                      {[['PILOT', v.pi, '#00c86e', 'rgba(0,200,110,.1)'], ['P1', v.p1, '#e08800', 'rgba(224,136,0,.1)'], ['P2', v.p2, '#d43030', 'rgba(212,48,48,.1)']].map(([l, val, c, bg]) => (
                        <div key={l} style={{ background: bg, borderRadius: 6, padding: '5px 8px', border: '1px solid ' + c + '30' }}><div style={{ fontSize: 9, fontWeight: 700, color: c }}>{l}</div><div style={{ fontSize: 12, fontWeight: 700, color: '#f2ede8' }}>{val ? fm(val) : 'N/A'}</div>{val && v.rev ? <div style={{ fontSize: 9, color: c }}>{pt(val, v.rev)}</div> : null}</div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* GROUP SUMMARY */}
            <div style={{ background: 'linear-gradient(90deg,rgba(255,107,53,.08),rgba(255,107,53,.02))', borderTop: '2px solid rgba(255,107,53,.25)', padding: '18px' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>GROUP SUMMARY — {gn}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#888078', marginBottom: 6 }}>WEIGHTED SCORES</div>
                  <div style={{ marginBottom: 4 }}><span style={{ fontSize: 10, color: '#888078' }}>Financial:</span> <Bdg s={wF} big /></div>
                  <div style={{ marginBottom: 4 }}><span style={{ fontSize: 10, color: '#888078' }}>Redemption:</span> <Bdg s={wR} big /></div>
                  <div style={{ marginBottom: 6 }}><span style={{ fontSize: 10, color: '#888078' }}>Mezza:</span> <Bdg s={wM} big /></div>
                  {gb.c > 0 ? (
                    <div style={{ marginTop: 4 }}><div style={{ fontSize: 22, fontWeight: 900, color: sc(wM) }}>{gb.c}% ceiling</div><div style={{ fontSize: 13, fontWeight: 700, color: '#f2ede8' }}>{fm(recAmt)}</div><div style={{ fontSize: 11, color: sc(wM), fontWeight: 600 }}>{gb.v} vote{gb.v > 1 ? 's' : ''} required · {wM.toFixed(1)} · {gb.g}</div></div>
                  ) : <div style={{ fontSize: 13, color: '#888078', fontWeight: 600, marginTop: 4 }}>NO MATCH — score {wM.toFixed(1)}</div>}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#888078', marginBottom: 6 }}>LENDING AMOUNT</div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    {['Recommended', 'Custom'].map(m => (
                      <button key={m} onClick={() => setGD(gn, { mode: m })} style={{ flex: 1, padding: '5px 8px', borderRadius: 5, border: mode === m ? '1px solid rgba(255,107,53,.5)' : '1px solid rgba(255,255,255,.12)', background: mode === m ? 'rgba(255,107,53,.12)' : 'transparent', color: mode === m ? '#ff6b35' : '#888078', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>{m}</button>
                    ))}
                  </div>
                  {mode === 'Custom' && (
                    <div style={{ marginBottom: 8 }}><label style={{ fontSize: 9, color: '#ff6b35', fontWeight: 700 }}>Custom Amount (AED)</label><input type="number" value={customAmt || ''} onChange={e => setGD(gn, { customAmt: +e.target.value || 0 })} placeholder={String(recAmt)} style={{ ...I, borderColor: 'rgba(255,107,53,.3)', fontSize: 14, fontWeight: 800, color: '#ff6b35', marginTop: 4 }} /></div>
                  )}
                  <div style={{ background: 'rgba(255,107,53,.12)', borderRadius: 8, padding: '10px 12px', border: '1px solid rgba(255,107,53,.3)', marginBottom: 8 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#ff6b35' }}>ACTIVE: {mode.toUpperCase()}</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#ff6b35' }}>{fm(activeAmt)}</div>
                    {tr > 0 && <div style={{ fontSize: 10, color: '#ff6b35' }}>{pt(activeAmt, tr)} of LTM</div>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                    <div><label style={{ fontSize: 9, color: '#e08800', fontWeight: 700 }}>P1 Amount</label><input type="number" value={p1Amt || ''} onChange={e => setGD(gn, { p1Amt: +e.target.value || 0 })} placeholder="0" style={{ ...I, borderColor: 'rgba(224,136,0,.3)', color: '#e08800', fontSize: 12, fontWeight: 700, marginTop: 2 }} /></div>
                    <div><label style={{ fontSize: 9, color: '#d43030', fontWeight: 700 }}>P2 Amount</label><input type="number" value={p2Amt || ''} onChange={e => setGD(gn, { p2Amt: +e.target.value || 0 })} placeholder="0" style={{ ...I, borderColor: 'rgba(212,48,48,.3)', color: '#d43030', fontSize: 12, fontWeight: 700, marginTop: 2 }} /></div>
                  </div>
                  <div style={{ background: '#1a1a1a', borderRadius: 8, padding: '10px 12px', border: '1px solid rgba(255,255,255,.08)' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#888078', marginBottom: 6 }}>DISBURSEMENT TRACKER</div>
                    {[['Pilot', pilotD, 'pilotDisbursed', '#00c86e'], ['P1', p1D, 'p1Disbursed', '#e08800'], ['P2', p2D, 'p2Disbursed', '#d43030']].map(([label, val, key, c]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><span style={{ fontSize: 9, color: c, fontWeight: 700, width: 30 }}>{label}</span><input type="number" value={val || ''} onChange={e => setGD(gn, { [key]: +e.target.value || 0 })} placeholder="0" style={{ ...I, flex: 1, padding: '4px 8px', fontSize: 11, color: c, borderColor: c + '30' }} /></div>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#00c86e' }}>Disbursed: {fm(totalD)}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: remain >= 0 ? '#888078' : '#d43030' }}>Remaining: {fm(remain)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#888078', marginBottom: 6 }}>% OF LTM REFERENCE</div>
                  {[1, 2, 3, 4, 5].map(p => (
                    <div key={p} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 10px', marginBottom: 3, background: gb.c === p ? 'rgba(255,107,53,.12)' : 'rgba(255,255,255,.03)', borderRadius: 6, border: gb.c === p ? '1px solid rgba(255,107,53,.3)' : '1px solid transparent' }}><span style={{ fontSize: 12, fontWeight: 800, color: gb.c === p ? '#ff6b35' : '#f2ede8' }}>{p}%</span><span style={{ fontSize: 12, fontWeight: 600, color: gb.c === p ? '#ff6b35' : '#aaa' }}>{fm(tr * p / 100)}</span></div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#888078', marginBottom: 6 }}>RISK COMMITTEE DECISION</div>
                  <select value={dec} onChange={e => setDc(gn, e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '2px solid ' + decColor(dec) + '50', background: decBg(dec), color: decColor(dec), fontSize: 13, fontWeight: 800, cursor: 'pointer', outline: 'none', width: '100%', marginBottom: 6 }}><option value="Pending">Pending</option>{DECS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <textarea value={rats[gn] || ''} onChange={e => setRt(gn, e.target.value)} placeholder="Rationale, conditions, comments..." rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid rgba(255,255,255,.12)', background: '#1e1e1e', color: '#f2ede8', fontSize: 12, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {!Object.keys(grps).length && <div style={{ ...C, textAlign: 'center', padding: 40 }}><p style={{ color: '#888078' }}>No venues match.</p></div>}
    </div>
  );
}

/* ════ ANALYTICS ════ */
function AnalyticsView({ venues, grps, aView, setAView, setCFilt, setTab, globalDisb, grpDisb, disbModeFor }) {
  const tRev = venues.reduce((s, x) => s + x.rev, 0);

  // Group data using actual selected disbursal
  const gd = Object.entries(grps).map(([gn, vl], i) => {
    const r = vl.reduce((s, x) => s + x.rev, 0);
    const wM = r > 0 ? vl.reduce((s, x) => s + (x.mz || 0) * x.rev, 0) / r : 0;
    const gdData = grpDisb[gn] || {};
    const selAmt = getDisb(vl, gdData.mode || globalDisb, gdData.customAmt || 0);
    return { name: gn.length > 22 ? gn.substring(0, 22) + '..' : gn, full: gn, revenue: r, mezza: wM, disb: selAmt, disbType: gdData.mode || globalDisb, color: CC[i % 10] };
  }).sort((a, b) => b.disb - a.disb);

  const totalDisb = gd.reduce((s, d) => s + d.disb, 0);

  // Grade distribution
  const gradeD = BANDS.map(b => { const vs = venues.filter(x => x.mz >= b.min && x.mz <= b.max); return { grade: b.g, count: vs.length, revenue: vs.reduce((s, x) => s + x.rev, 0), color: sc(b.min) }; }).filter(d => d.count > 0);

  // Monthly = sum of lending amounts (la) by approval month from dt field
  const monthlyMap = {};
  venues.forEach(v => {
    if (!v.dt || !v.la) return;
    const key = v.dt.substring(0, 7); // YYYY-MM
    monthlyMap[key] = (monthlyMap[key] || 0) + v.la;
  });
  const monthKeys = Object.keys(monthlyMap).sort();
  const monthlyData = monthKeys.map(k => {
    const [y, m] = k.split('-');
    const label = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(m)] + '-' + y.substring(2);
    return { month: label, approved: monthlyMap[k] };
  });

  const clickG = d => { if (d?.full) { setCFilt({ t: 'group', v: d.full }); setTab('portfolio'); } };
  const clickGr = d => { if (d?.grade) { setCFilt({ t: 'grade', v: d.grade }); setTab('portfolio'); } };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        {[['group', 'By Group'], ['grade', 'By Grade'], ['monthly', 'Monthly Approvals']].map(([v, l]) => <button key={v} onClick={() => setAView(v)} style={bW(aView === v)}>{l}</button>)}
      </div>

      {aView === 'group' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={C}>
              <div style={CL}>Disbursal Share by Group (actual selected amounts)</div>
              <div style={{ fontSize: 10, color: '#888078', marginBottom: 8 }}>Total: {fm(totalDisb)} — each group uses its selected disbursal type</div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart><Pie data={gd.filter(d => d.disb > 0)} dataKey="disb" nameKey="name" cx="50%" cy="50%" outerRadius={110} onClick={clickG} style={{ cursor: 'pointer' }}>{gd.filter(d => d.disb > 0).map((d, i) => <Cell key={i} fill={d.color} stroke="#161616" strokeWidth={2} />)}</Pie><Tooltip formatter={v => 'AED ' + (v / 1e6).toFixed(2) + 'M'} contentStyle={tt} /><Legend wrapperStyle={{ fontSize: 10, color: '#f2ede8' }} /></PieChart>
              </ResponsiveContainer>
            </div>
            <div style={C}>
              <div style={CL}>LTM Revenue by Group</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gd} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" /><XAxis type="number" tick={{ fill: '#888078', fontSize: 10 }} tickFormatter={v => (v / 1e6).toFixed(0) + 'M'} /><YAxis type="category" dataKey="name" tick={{ fill: '#f2ede8', fontSize: 9 }} width={120} /><Tooltip formatter={v => 'AED ' + (v / 1e6).toFixed(2) + 'M'} contentStyle={tt} /><Bar dataKey="revenue" radius={[0, 6, 6, 0]} onClick={(_, i) => clickG(gd[i])} style={{ cursor: 'pointer' }}>{gd.map((d, i) => <Cell key={i} fill={d.color} />)}</Bar></BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Breakdown table */}
          <div style={C}>
            <div style={CL}>Group Disbursal Breakdown</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Group', 'Revenue', 'Mezza', 'Type', 'Disbursal', '% of Rev'].map(h => <th key={h} style={{ fontSize: 10, fontWeight: 700, color: '#888078', padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,.08)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>{gd.map((d, i) => (
                <tr key={i} onClick={() => clickG(d)} style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <td style={{ padding: '8px', fontSize: 13, color: '#f2ede8', fontWeight: 600 }}><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: d.color, marginRight: 8 }} />{d.full}</td>
                  <td style={{ padding: '8px', fontSize: 12, color: '#f2ede8' }}>{fm(d.revenue)}</td>
                  <td style={{ padding: '8px' }}><Bdg s={d.mezza} /></td>
                  <td style={{ padding: '8px', fontSize: 11, color: '#ff6b35', fontWeight: 600 }}>{d.disbType}</td>
                  <td style={{ padding: '8px', fontSize: 13, color: '#ff6b35', fontWeight: 800 }}>{fm(d.disb)}</td>
                  <td style={{ padding: '8px', fontSize: 11, color: '#888078' }}>{d.revenue > 0 ? pt(d.disb, d.revenue) : '—'}</td>
                </tr>
              ))}</tbody>
              <tfoot><tr style={{ borderTop: '2px solid rgba(255,255,255,.08)' }}>
                <td style={{ padding: '8px', color: '#ff6b35', fontWeight: 900, fontSize: 13 }}>TOTAL</td>
                <td style={{ padding: '8px', color: '#ff6b35', fontWeight: 700 }}>{fm(tRev)}</td>
                <td colSpan={2} />
                <td style={{ padding: '8px', color: '#ff6b35', fontWeight: 900, fontSize: 14 }}>{fm(totalDisb)}</td>
                <td style={{ padding: '8px', color: '#888078' }}>{tRev > 0 ? pt(totalDisb, tRev) : ''}</td>
              </tr></tfoot>
            </table>
          </div>
        </div>
      )}

      {aView === 'grade' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={C}><div style={CL}>Venues by Grade — click to filter</div>
            <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={gradeD} dataKey="count" nameKey="grade" cx="50%" cy="50%" outerRadius={110} onClick={clickGr} style={{ cursor: 'pointer' }} label={({ grade, count }) => grade + ': ' + count}>{gradeD.map((d, i) => <Cell key={i} fill={d.color} stroke="#161616" strokeWidth={2} />)}</Pie><Tooltip contentStyle={tt} /></PieChart></ResponsiveContainer>
          </div>
          <div style={C}><div style={CL}>Revenue by Grade</div>
            <ResponsiveContainer width="100%" height={300}><BarChart data={gradeD}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" /><XAxis dataKey="grade" tick={{ fill: '#f2ede8', fontSize: 12 }} /><YAxis tick={{ fill: '#888078', fontSize: 10 }} tickFormatter={v => (v / 1e6).toFixed(0) + 'M'} /><Tooltip formatter={v => 'AED ' + (v / 1e6).toFixed(2) + 'M'} contentStyle={tt} /><Bar dataKey="revenue" radius={[6, 6, 0, 0]} onClick={(_, i) => clickGr(gradeD[i])} style={{ cursor: 'pointer' }}>{gradeD.map((d, i) => <Cell key={i} fill={d.color} />)}</Bar></BarChart></ResponsiveContainer>
          </div>
        </div>
      )}

      {aView === 'monthly' && (
        <div>
          <div style={C}>
            <div style={CL}>Approved Lending by Month of Approval</div>
            <div style={{ fontSize: 11, color: '#888078', marginBottom: 12 }}>Sum of maximum approved lending limits, grouped by the date each case was logged</div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" /><XAxis dataKey="month" tick={{ fill: '#f2ede8', fontSize: 11 }} /><YAxis tick={{ fill: '#888078', fontSize: 10 }} tickFormatter={v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : (v / 1e3).toFixed(0) + 'K'} /><Tooltip formatter={v => 'AED ' + v.toLocaleString()} contentStyle={tt} /><Bar dataKey="approved" fill="#ff6b35" radius={[6, 6, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
          {/* Monthly totals table */}
          <div style={{ ...C, marginTop: 16 }}>
            <div style={CL}>Monthly Breakdown</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Month', 'Approved Lending', 'Venues Approved'].map(h => <th key={h} style={{ fontSize: 10, fontWeight: 700, color: '#888078', padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,.08)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>{monthKeys.map(k => {
                const count = venues.filter(v => v.dt?.startsWith(k) && v.la > 0).length;
                const [y, m] = k.split('-');
                const label = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(m)] + ' ' + y;
                return (
                  <tr key={k} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                    <td style={{ padding: '8px', fontSize: 13, color: '#f2ede8', fontWeight: 600 }}>{label}</td>
                    <td style={{ padding: '8px', fontSize: 14, color: '#ff6b35', fontWeight: 800 }}>{fm(monthlyMap[k])}</td>
                    <td style={{ padding: '8px', fontSize: 12, color: '#888078' }}>{count} venue{count !== 1 ? 's' : ''}</td>
                  </tr>
                );
              })}</tbody>
              <tfoot><tr style={{ borderTop: '2px solid rgba(255,255,255,.08)' }}>
                <td style={{ padding: '8px', color: '#ff6b35', fontWeight: 900 }}>TOTAL</td>
                <td style={{ padding: '8px', color: '#ff6b35', fontWeight: 900, fontSize: 14 }}>{fm(Object.values(monthlyMap).reduce((s, v) => s + v, 0))}</td>
                <td style={{ padding: '8px', color: '#888078' }}>{venues.filter(v => v.la > 0).length} venues</td>
              </tr></tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════ TRACKER / PIPELINE ════ */
function TrackerView({ venues, decs, rats, tracker, setTk, disbModeFor, grpDisb }) {
  const grps = {};
  venues.forEach(x => { if (!grps[x.gn]) grps[x.gn] = []; grps[x.gn].push(x); });

  const rows = Object.entries(grps).map(([gn, vl]) => {
    const tr = vl.reduce((s, x) => s + (x.rev || 0), 0);
    const wM = tr > 0 ? vl.reduce((s, x) => s + (x.mz || 0) * (x.rev || 0), 0) / tr : 0;
    const isSingle = vl.length === 1;
    const displayName = isSingle ? vl[0].vn : gn;
    const tk = tracker[gn] || {};
    const dec = decs[gn] || 'Pending';
    const la = vl.reduce((s, x) => s + (x.la || 0), 0);
    const pilotAmt = vl.reduce((s, x) => s + (x.pi || 0), 0);
    const p1Amt = vl.reduce((s, x) => s + (x.p1 || 0), 0);
    return { gn, displayName, isSingle, venueCount: vl.length, wM, dec, la, pilotAmt, p1Amt, tr, tk };
  });

  const totalLA = rows.reduce((s, r) => s + r.la, 0);
  const totalPilot = rows.reduce((s, r) => s + (r.tk.pilotAmt || r.pilotAmt || 0), 0);
  const totalP1 = rows.reduce((s, r) => s + (r.tk.p1Amt || r.p1Amt || 0), 0);
  const disbursedCount = rows.filter(r => (r.tk.status || '').includes('Disbursed')).length;

  const TH = { fontSize: 10, fontWeight: 700, color: '#888078', padding: '10px 8px', textAlign: 'left', borderBottom: '2px solid rgba(255,107,53,.2)', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' };
  const TD = { padding: '10px 8px', color: '#f2ede8', fontSize: 12, verticalAlign: 'middle', borderBottom: '1px solid rgba(255,255,255,.04)' };
  const inp = { padding: '6px 8px', borderRadius: 5, border: '1px solid rgba(255,255,255,.12)', background: '#1e1e1e', color: '#f2ede8', fontSize: 11, outline: 'none', width: '100%', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        <div style={C}><div style={CL}>TOTAL CASES</div><div style={{ fontSize: 28, fontWeight: 900, color: '#f2ede8' }}>{rows.length}</div></div>
        <div style={C}><div style={CL}>TOTAL LENDING</div><div style={{ fontSize: 28, fontWeight: 900, color: '#ff6b35' }}>{fm(totalLA)}</div></div>
        <div style={C}><div style={CL}>TOTAL PILOT</div><div style={{ fontSize: 28, fontWeight: 900, color: '#00c86e' }}>{fm(totalPilot)}</div></div>
        <div style={C}><div style={CL}>DISBURSED</div><div style={{ fontSize: 28, fontWeight: 900, color: '#2ecc71' }}>{disbursedCount} / {rows.length}</div></div>
      </div>

      <div style={{ ...C, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '2px solid rgba(255,107,53,.2)', background: 'linear-gradient(90deg,rgba(255,107,53,.06),transparent)' }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: 2 }}>Deal Tracker / Pipeline</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
            <thead>
              <tr style={{ background: '#1a1a1a' }}>
                <th style={TH}>Case / Group</th>
                <th style={TH}>Mezza</th>
                <th style={TH}>Committee</th>
                <th style={TH}>Lending Limit</th>
                <th style={TH}>Case Status</th>
                <th style={TH}>Pilot Amt</th>
                <th style={TH}>Pilot Date</th>
                <th style={TH}>P1 Amt</th>
                <th style={TH}>P1 Date</th>
                <th style={TH}>P2 Date</th>
                <th style={TH}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const tk = r.tk;
                const sColor = statusColor(tk.status);
                return (
                  <tr key={r.gn}>
                    <td style={{ ...TD, minWidth: 180 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#f2ede8' }}>{r.displayName}</div>
                      {!r.isSingle && <div style={{ fontSize: 10, color: '#888078' }}>{r.venueCount} venues · {fm(r.tr)}</div>}
                    </td>
                    <td style={TD}><Bdg s={r.wM} big /></td>
                    <td style={TD}>
                      <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: decBg(r.dec), color: decColor(r.dec), border: '1px solid ' + decColor(r.dec) + '30' }}>{r.dec}</span>
                    </td>
                    <td style={{ ...TD, fontWeight: 700, color: '#ff6b35', fontSize: 13 }}>{r.la ? fm(r.la) : 'N/A'}</td>
                    <td style={TD}>
                      <select value={tk.status || ''} onChange={e => setTk(r.gn, { status: e.target.value })} style={{ ...inp, color: sColor, borderColor: sColor + '40', fontWeight: 700 }}>
                        <option value="">Select status...</option>
                        {CASE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={TD}>
                      <input type="number" value={tk.pilotAmt || ''} onChange={e => setTk(r.gn, { pilotAmt: +e.target.value || 0 })} placeholder={r.pilotAmt ? String(r.pilotAmt) : '0'} style={{ ...inp, color: '#00c86e' }} />
                    </td>
                    <td style={TD}>
                      <input type="date" value={tk.pilotDate || ''} onChange={e => setTk(r.gn, { pilotDate: e.target.value })} style={inp} />
                    </td>
                    <td style={TD}>
                      <input type="number" value={tk.p1Amt || ''} onChange={e => setTk(r.gn, { p1Amt: +e.target.value || 0 })} placeholder={r.p1Amt ? String(r.p1Amt) : '0'} style={{ ...inp, color: '#e08800' }} />
                    </td>
                    <td style={TD}>
                      <input type="date" value={tk.p1Date || ''} onChange={e => setTk(r.gn, { p1Date: e.target.value })} style={inp} />
                    </td>
                    <td style={TD}>
                      <input type="date" value={tk.p2Date || ''} onChange={e => setTk(r.gn, { p2Date: e.target.value })} style={inp} />
                    </td>
                    <td style={TD}>
                      <input value={tk.notes || ''} onChange={e => setTk(r.gn, { notes: e.target.value })} placeholder="Notes..." style={{ ...inp, minWidth: 120 }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid rgba(255,107,53,.2)', background: 'rgba(255,107,53,.04)' }}>
                <td style={{ ...TD, fontWeight: 900, color: '#ff6b35', fontSize: 13 }}>TOTAL ({rows.length})</td>
                <td style={TD} />
                <td style={TD} />
                <td style={{ ...TD, fontWeight: 900, color: '#ff6b35', fontSize: 14 }}>{fm(totalLA)}</td>
                <td style={TD} />
                <td style={{ ...TD, fontWeight: 700, color: '#00c86e' }}>{fm(totalPilot)}</td>
                <td style={TD} />
                <td style={{ ...TD, fontWeight: 700, color: '#e08800' }}>{fm(totalP1)}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
