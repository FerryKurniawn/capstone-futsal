# Risk Register - Reservasi Lapangan Futsal

Skor = Probabilitas (1-5) x Dampak (1-5).

| No | Risiko | Probabilitas | Dampak | Skor | Mitigasi |
|----|--------|:-----------:|:------:|:----:|----------|
| 1 | Brute-force SSH | 4 | 4 | 16 | SSH key-only (`PasswordAuthentication no`), fail2ban, UFW hanya membuka port 22/80/443 |
| 2 | SQL Injection pada form booking | 3 | 5 | 15 | Parameterized query (`$1, $2, ...`) pada `pg`, validasi input di route |
| 3 | VPS mati karena saldo/billing habis | 3 | 5 | 15 | Top-up saldo sebelum masa penilaian, cek status VPS berkala |
| 4 | Satu container app mati | 3 | 3 | 9 | `restart: unless-stopped`; Nginx otomatis mengalihkan request ke container lain |
| 5 | Data terhapus tidak sengaja | 2 | 5 | 10 | Backup manual `pg_dump`, volume Docker `pgdata` |
| 6 | Kebocoran kredensial DB/Grafana | 2 | 5 | 10 | Password di `.env` (masuk `.gitignore`), port Prometheus/Grafana hanya bind ke 127.0.0.1 |
