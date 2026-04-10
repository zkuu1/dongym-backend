# Fix User API Response to Include Memberships

## Steps:
- [x] 1. Update src/dto/users/user.dto.ts: Fix toUsersData to map memberships and hide password
- [ ] 2. Clear Redis cache: redis-cli del "users:all"
- [ ] 3. Test GET /user endpoint (admin auth) - verify memberships included
- [ ] 4. Complete

