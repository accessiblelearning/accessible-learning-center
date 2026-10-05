// Isolated fictional design data. No fetch, credentials, browser progress or persistent storage.
(() => {
  const samples = [
    {id:'sample-alex',name:'Alex Sample',status:'active',progress:['Both hands: 8 of 50 lessons','Left hand only: 3 of 50 lessons','Right hand only: 1 of 50 lessons','Topic Missions: 2 completed','Command Practice: no synced results','Assessed courses: imported history, not a verified certificate','Private Braille: integration unavailable']},
    {id:'sample-jordan',name:'Jordan Example',status:'suspended',progress:['Both hands: 2 of 50 lessons','Left hand only: 0 of 50 lessons','Right hand only: 6 of 50 lessons','Topic Missions: 1 completed','Command Practice: 4 fictional practice records']}
  ];
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
    get('sample-reason').value='';get('sample-action-result').textContent='';get('sample-heading').focus();
  }
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
