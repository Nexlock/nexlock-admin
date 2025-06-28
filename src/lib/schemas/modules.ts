import { z } from "zod";

export const LockerResponseSchema = z.object({
  id: z.string(),
  lockerId: z.string(),
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().transform((val) => new Date(val)),
});

export const ModuleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  deviceId: z.string(),
  description: z.string().nullable(),
  location: z.string().nullable(),
  adminId: z.string().nullable(),
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().transform((val) => new Date(val)),
  lockers: z.array(LockerResponseSchema).optional(),
});

export const UpdateModuleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
});

export type LockerResponse = z.infer<typeof LockerResponseSchema>;
export type ModuleResponse = z.infer<typeof ModuleResponseSchema>;
export type UpdateModuleRequest = z.infer<typeof UpdateModuleSchema>;
