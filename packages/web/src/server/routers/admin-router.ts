import { z } from "zod";
import { router, protectedProcedure } from "../create-router";
import { userService } from "@/lib/user-service";
import { TRPCError } from "@trpc/server";

// Create a validation schema for the admin token
const adminTokenSchema = z.string().min(1);

/**
 * Validates if the given token matches the admin token from environment
 * @param token Token to validate
 */
function validateAdminToken(token: string): boolean {
  const adminToken = process.env.ADMIN_SECRET_TOKEN;
  
  if (!adminToken) {
    console.error("ADMIN_SECRET_TOKEN not set in environment variables");
    return false;
  }
  
  return token === adminToken;
}

/**
 * Router for admin operations
 */
export const adminRouter = router({
  /**
   * List all users in the system
   */
  listUsers: protectedProcedure
    .input(z.object({
      adminToken: adminTokenSchema,
    }))
    .query(async ({ input }) => {
      // Validate admin token
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid admin token",
        });
      }
      
      // Get users
      return await userService.listUsers();
    }),
  
  /**
   * Delete a user and all associated data
   */
  deleteUser: protectedProcedure
    .input(z.object({
      adminToken: adminTokenSchema,
      privyDid: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      // Validate admin token
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid admin token",
        });
      }
      
      // Delete user
      const result = await userService.deleteUser(input.privyDid);
      
      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.message,
        });
      }
      
      return result;
    }),
}); 