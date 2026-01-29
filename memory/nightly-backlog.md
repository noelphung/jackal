# Nightly Build Backlog

*Priority order - pick from top. Update as items complete.*

## Quick Wins (Tonight's Candidates)

### 0. Code Quality Sprint
- [x] Remove 154 console.log statements (production cleanup) — PR #1
- [ ] Add proper error boundaries to components
- [x] Fix npm audit vulnerabilities (9 → 5, remaining need breaking vite upgrade)

## High Priority (Revenue Impact)

### 1. Analytics Dashboard Improvements
- [ ] Add conversion rate tracking (calls → appointments)
- [ ] Add daily/weekly/monthly comparison charts
- [ ] Export analytics to PDF/CSV

### 2. Lead Management Enhancements
- [ ] Bulk lead status update
- [ ] Smart lead scoring based on call outcomes
- [ ] Duplicate detection on import

### 3. Calling Features
- [ ] Call script templates with variables ({{lead.name}}, {{lead.company}})
- [ ] Quick voicemail drop
- [ ] Call-back scheduling with calendar integration

## Medium Priority (UX/Efficiency)

### 4. UI/UX Polish
- [ ] Dark mode support
- [ ] Mobile responsive improvements
- [ ] Keyboard shortcut cheat sheet modal

### 5. Integrations
- [ ] GHL webhook for real-time sync
- [ ] Calendar integration for appointment booking
- [ ] Email follow-up templates

### 6. Performance
- [ ] Lazy loading for large lead lists
- [ ] Optimize Supabase queries
- [ ] Add loading skeletons

## Low Priority (Nice to Have)

### 7. Admin Features
- [ ] Team performance leaderboard
- [ ] Call monitoring/whisper mode
- [ ] Custom disposition statuses

### 8. Reporting
- [ ] Automated daily email reports
- [ ] Call outcome trends
- [ ] Best time to call analysis

---

## Completed
*Move items here when done*

---

## Notes for Jackal
- Always create feature branch: `jackal/feature-name`
- Run `npm run lint` before committing
- Write tests if adding new utilities
- Keep PRs focused - one feature per PR
- Update this file when starting/completing work
