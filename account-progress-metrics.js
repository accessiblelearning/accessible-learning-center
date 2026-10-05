/* Shared display calculations. No data access, persistence or account authorization. */
((root) => {
  const validMetric=(value,max)=>typeof value==='number' && Number.isFinite(value) && value>=0 && value<=max;
  root.ALCTypingProgressSummary=(sessions,path)=>{
    const rows=sessions.filter(s=>s.path===path && /^\d{4}-\d{2}-\d{2}$/.test(s.date) && Number.isFinite(Date.parse(s.date))).map(s=>({
      ...s,wpm:validMetric(s.wpm,500)?s.wpm:null,accuracy:validMetric(s.accuracy,100)?s.accuracy:null
    })).sort((a,b)=>a.date.localeCompare(b.date));
    const first=rows[0]||null,latest=rows.at(-1)||null;
    const best=key=>{const values=rows.filter(s=>s[key]!==null).map(s=>s[key]);return values.length?Math.max(...values):null;};
    const change=key=>rows.length>1 && first[key]!==null && latest[key]!==null?Math.round((latest[key]-first[key])*10)/10:null;
    return {rows,first,latest,bestWpm:best('wpm'),bestAccuracy:best('accuracy'),speedChange:change('wpm'),accuracyChange:change('accuracy')};
  };
})(globalThis);
