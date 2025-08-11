// At line 102, replace the getCustomerStatus implementation:
  getCustomerStatus: protectedProcedure.query(async ({ ctx }) => {
    // Use the user from context (set by auth middleware) instead of calling getUser()
    const userId = ctx.user.id;
    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Rest of the implementation continues...
