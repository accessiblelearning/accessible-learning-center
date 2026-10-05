// Isolated fictional design data. No fetch, credentials, browser progress or persistent storage.
(() => {
  const samples = [
    {id:'sample-alex',name:'Alex Sample',status:'active',progress:['Both hands: 8 of 50 lessons','Left hand only: 3 of 50 lessons','Right hand only: 1 of 50 lessons','Topic Missions: 2 completed','Command Practice: no synced results','Assessed courses: imported history, not a verified certificate','Private Braille: integration unavailable']},
    {id:'sample-jordan',name:'Jordan Example',status:'suspended',progress:['Both hands: 2 of 50 lessons','Left hand only: 0 of 50 lessons','Right hand only: 6 of 50 lessons','Topic Missions: 1 completed','Command Practice: 4 fictional practice records']}
  ];
  const sampleSessions = {
    'sample-alex': [
      {date:'2026-09-27',path:'both',lesson:4,mode:'Guided',wpm:16,accuracy:93},
      {date:'2026-09-29',path:'both',lesson:6,mode:'Guided',wpm:18,accuracy:95},
      {date:'2026-10-02',path:'both',lesson:8,mode:'Guided',wpm:22,accuracy:96},
      {date:'2026-10-04',path:'both',lesson:8,mode:'Guided',wpm:21,accuracy:98},
      {date:'2026-09-28',path:'left',lesson:1,mode:'Guided',wpm:6,accuracy:87},
      {date:'2026-10-01',path:'left',lesson:2,mode:'Guided',wpm:8,accuracy:91},
      {date:'2026-10-04',path:'left',lesson:3,mode:'Guided',wpm:10,accuracy:94},
      {date:'2026-10-03',path:'right',lesson:1,mode:'Guided',wpm:5,accuracy:90}
    ],
    'sample-jordan': [
      {date:'2026-10-01',path:'both',lesson:1,mode:'Guided',wpm:12,accuracy:94},
      {date:'2026-10-04',path:'both',lesson:2,mode:'Guided',wpm:14,accuracy:96},
      {date:'2026-09-28',path:'right',lesson:4,mode:'Guided',wpm:9,accuracy:91},
      {date:'2026-10-02',path:'right',lesson:5,mode:'Guided',wpm:11,accuracy:94},
      {date:'2026-10-04',path:'right',lesson:6,mode:'Guided',wpm:12,accuracy:96}
    ]
  };
  const get=id=>document.getElementById(id); let selected; const audit=[];
  function renderList(){
    const rows=samples.filter(x=>x.name.toLowerCase().includes(get('sample-search').value.toLowerCase()));
    get('sample-accounts').replaceChildren();
    rows.forEach(record=>{const button=document.createElement('button');button.type='button';button.textContent='Review '+record.name;button.addEventListener('click',()=>show(record));get('sample-accounts').append(button);});
    get('sample-count').textContent=rows.length+' fictional accounts found.';
  }
  function show(record){
    selected=record;get('sample-details').hidden=false;get('sample-heading').textContent=record.name+' — sample progress';
    get('sample-account-status').textContent='Sample status: '+record.status;get('sample-status').textContent=(record.status==='active'?'Suspend':'Restore')+' sample account';
    get('sample-progress').replaceChildren(...record.progress.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    get('sample-path').value='both';renderTyping();
    get('sample-reason').value='';get('sample-action-result').textContent='';get('sample-heading').focus();
  }
  const pathNames={both:'Both hands',left:'Left hand only',right:'Right hand only'};
  const dateLabel=date=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));
  const metric=(value,unit)=>value===null || value===undefined?'Not recorded':value+unit;
  const change=(name,value,unit)=>value===null?name+' change is not available.':value===0?name+' is unchanged.':name+' '+(value>0?'increased':'decreased')+' by '+Math.abs(value)+' '+unit+'.';
  function renderTyping(){
    const path=get('sample-path').value;
    const summary=globalThis.ALCTypingProgressSummary(sampleSessions[selected.id],path);
    get('sample-metrics').replaceChildren();get('sample-history-rows').replaceChildren();
    const hasRows=summary.rows.length>0;
    get('sample-metrics').hidden=!hasRows;get('sample-history-region').hidden=!hasRows;get('sample-comparison-note').hidden=summary.rows.length<2;
    if(!hasRows){get('sample-trend').textContent=pathNames[path]+': no sample sessions recorded. Speed and accuracy are unavailable.';return;}
    const latest=summary.latest;
    for(const [label,value] of [['Latest speed',metric(latest.wpm,' WPM')],['Latest accuracy',metric(latest.accuracy,'%')],['Best speed',metric(summary.bestWpm,' WPM')],['Best accuracy',metric(summary.bestAccuracy,'%')]]){
      const box=document.createElement('div'),term=document.createElement('dt'),description=document.createElement('dd');term.textContent=label;description.textContent=value;box.append(term,description);get('sample-metrics').append(box);
    }
    const trend=summary.rows.length>1?'From '+dateLabel(summary.first.date)+' to '+dateLabel(latest.date)+': '+change('Speed',summary.speedChange,'WPM')+' '+change('Accuracy',summary.accuracyChange,'percentage points'):'One session recorded; another session is needed to show a change.';
    get('sample-trend').textContent=pathNames[path]+'. Latest sample: '+metric(latest.wpm,' WPM')+', accuracy '+metric(latest.accuracy,'%')+'. '+trend;
    for(const session of [...summary.rows].reverse()){
      const row=document.createElement('tr'),date=document.createElement('th');date.scope='row';date.textContent=dateLabel(session.date);row.append(date);
      for(const value of ['Lesson '+session.lesson+' · '+session.mode,metric(session.wpm,' WPM'),metric(session.accuracy,'%')]){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}
      get('sample-history-rows').append(row);
    }
  }
  get('sample-path').addEventListener('change',renderTyping);
  get('sample-search').addEventListener('input',renderList);
  get('sample-status').addEventListener('click',()=>{
    const reason=get('sample-reason').value.trim();
    if(reason.length<5){get('sample-action-result').textContent='Enter a fictional reason of at least five characters.';get('sample-reason').focus();return;}
    selected.status=selected.status==='active'?'suspended':'active';
    audit.push(selected.name+': '+selected.status+'. Sample reason: '+reason);
    get('sample-account-status').textContent='Sample status: '+selected.status;get('sample-status').textContent=(selected.status==='active'?'Suspend':'Restore')+' sample account';
    get('sample-action-result').textContent='Sample changed. No real account was modified.';
    get('sample-audit').replaceChildren(...audit.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  });
  renderList();
})();
