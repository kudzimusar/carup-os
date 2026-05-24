CREATE UNIQUE INDEX IF NOT EXISTS uniq_block_height ON blockchain_ledger(block_height);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_escrow_id ON escrow_transactions(id);
