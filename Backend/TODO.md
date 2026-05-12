# TODO - Superadmin/Schooladmin folder refactor

- [x] Create new module folders: `src/modules/auth/superadmin` and `src/modules/auth/schooladmin`

- [x] Move/copy Superadmin: controller/routes/model into new folders

- [x] Move/copy Schooladmin: controller/routes/service/model + driver.model + route.model into new folders

- [ ] Update all internal relative import paths inside moved files
- [x] Update `src/app.js` route registrations to import from new folders

- [x] Remove old folder references from `src/app.js` (no `/superadmin_ext` or `/schooladmin_ext` imports)

- [ ] Remove unused imports after refactor
- [x] Ensure Super Admin login works (`POST /api/superadmin/login`)

- [ ] Ensure School Admin login works (`POST /api/schooladmin/login`)
- [ ] Ensure protected routes still authorize correctly by role
- [ ] Delete old `*_ext` directories only after successful server run

