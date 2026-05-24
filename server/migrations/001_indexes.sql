CREATE INDEX IF NOT EXISTS idx_history_logs_vin_date ON history_logs(vin, log_date);
CREATE INDEX IF NOT EXISTS idx_parts_ledger_vin_status ON parts_ledger(vin, status);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON escrow_transactions(status);
CREATE INDEX IF NOT EXISTS idx_blockchain_height ON blockchain_ledger(block_height);
CREATE INDEX IF NOT EXISTS idx_commissions_escrow_id ON commissions_ledger(escrow_id);
