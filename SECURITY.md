# SECURITY.md - Security Requirements & Status

## 🔒 Current Security Posture

### ✅ Implemented
- Clawdbot gateway binds to localhost only (127.0.0.1) — not exposed to internet
- Auth profiles file has restrictive permissions (600)
- SSH key-based authentication (AWS default)
- **Self-healing monitor** — checks every 5 minutes, auto-restarts if crashed
- **Auto-start on reboot** — Clawdbot starts automatically after system restart
- **Daily backups** — 4am EST, keeps last 7 days
- **Secrets audit** — weekly scan for exposed credentials
- **.gitignore protection** — prevents accidental secret commits

### ⚠️ Run Security Hardening
Run `sudo bash scripts/security-hardening.sh` to enable:
- [ ] Firewall (UFW)
- [ ] Fail2ban (brute-force protection)
- [ ] SSH hardening

---

## 🛡️ Security Requirements

### 1. Network Security
- [ ] Enable UFW firewall — allow only SSH (22) and necessary ports
- [ ] Install Fail2ban — auto-block repeated failed login attempts
- [ ] Consider VPN or SSH tunneling for remote access

### 2. Authentication & Access
- [ ] Disable SSH password authentication (key-only)
- [ ] Disable root SSH login
- [ ] Use strong, unique API keys for all services
- [ ] Rotate API keys quarterly

### 3. Data Protection
- [ ] Encrypt sensitive files at rest
- [ ] Use environment variables for secrets (not hardcoded)
- [ ] Regular backups of critical data
- [ ] Secure deletion of old credentials

### 4. Monitoring & Alerting
- [ ] Log all authentication attempts
- [ ] Alert on suspicious activity
- [ ] Monitor disk space (✅ already set up)
- [ ] Monitor for unauthorized access

### 5. Application Security
- [ ] Keep Clawdbot and dependencies updated
- [ ] Review n8n webhook security (authentication)
- [ ] Audit MCP server access permissions
- [ ] Review Supabase RLS policies

---

## 🔑 Credential Inventory

| Service | Location | Last Rotated |
|---------|----------|--------------|
| Anthropic API | auth-profiles.json | ? |
| Supabase | auth-profiles.json | ? |
| n8n | MCP config | ? |
| Vercel | MCP config | ? |
| GitHub (gh) | gh auth | ? |
| Telegram Bot | gateway config | ? |
| Google OAuth (n8n) | n8n credentials | ? |

---

## 📋 Security Checklist (Run Monthly)

```bash
# Check for unauthorized SSH keys
cat ~/.ssh/authorized_keys

# Check active connections
ss -tulnp

# Check failed login attempts
sudo grep "Failed password" /var/log/auth.log | tail -20

# Check listening services
sudo netstat -tlnp

# Verify file permissions on sensitive files
ls -la ~/.clawdbot/agents/main/agent/auth-profiles.json

# Check for world-readable sensitive files
find ~ -name "*.env" -o -name "*secret*" -o -name "*password*" 2>/dev/null
```

---

## 🚨 Incident Response

If you suspect a breach:
1. **Rotate all API keys immediately**
2. Check `~/.ssh/authorized_keys` for unknown keys
3. Review recent login history: `last -20`
4. Check running processes: `ps aux`
5. Review Clawdbot logs for unusual activity
6. Contact me immediately

---

*Security is ongoing. Review this document monthly.*
