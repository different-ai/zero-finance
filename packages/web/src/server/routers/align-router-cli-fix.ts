// This file shows how to fix the align-router.ts for CLI compatibility
// The main issue: Every procedure is calling getUser() which only works with cookies
// The fix: Use ctx.user.id from the context instead

// Example fix for getCustomerStatus (line 102):
/*
OLD:
  getCustomerStatus: protectedProcedure.query(async ({ ctx }) => {
    const userFromPrivy = await getUser();
    if (!userFromPrivy?.id) {

NEW:
  getCustomerStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    if (!userId) {
*/

// The problem is that EVERY procedure in align-router.ts needs this fix
// There are 13+ occurrences of getUser() that all need to be replaced

// Quick fix for testing - just fix getCustomerStatus:
export const getCustomerStatusFixed = `
  getCustomerStatus: protectedProcedure.query(async ({ ctx }) => {
    // Use the user from context instead of calling getUser()
    const userId = ctx.user.id;
    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Get user from DB
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, userId),
    });

    // Rest of the implementation stays the same...
  })
`;
