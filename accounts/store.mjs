// D1 adapter. No migrations or schema creation happen while serving requests.
export function accountStore(db) {
  const query=(sql,...args)=>db.prepare(sql).bind(...args);
  return {
    identity:(issuer,subject)=>query('SELECT id, display_name, role, status, pilot_allowed FROM accounts WHERE issuer = ? AND subject = ?',issuer,subject).first(),
    account:id=>query('SELECT id, display_name, role, status, pilot_allowed FROM accounts WHERE id = ?',id).first(),
    async list(search) {
      // instr treats wildcard characters literally and the query is parameterized.
      return (await query('SELECT id, display_name, role, status FROM accounts WHERE instr(lower(display_name), lower(?)) > 0 ORDER BY display_name, id LIMIT 50',search).all()).results;
    },
    async progress(id) { return (await query('SELECT area, curriculum_id, activity_id, path, verification, payload, created_at FROM account_progress WHERE account_id = ? ORDER BY created_at DESC, record_key LIMIT 200',id).all()).results; },
    async insert(id,rows,verification) {
      return db.batch(rows.map(({key,record})=>query('INSERT OR IGNORE INTO account_progress (account_id, record_key, area, curriculum_id, activity_id, path, verification, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',id,key,record.area,record.curriculumId,record.activityId,record.path,verification,JSON.stringify(record))));
    },
    async status(actor,target,status,reason) {
      // D1 batch is transactional: an audit failure also rolls back the status change.
      return db.batch([
        query('UPDATE accounts SET status = ? WHERE id = ? AND role = \'learner\'',status,target),
        query('INSERT INTO account_audit (id, actor_id, target_id, action, reason) VALUES (?, ?, ?, ?, ?)',crypto.randomUUID(),actor,target,status==='suspended'?'suspend':'restore',reason)
      ]);
    }
  };
}
