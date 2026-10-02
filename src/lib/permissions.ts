export type TeamRole = 'OWNER' | 'MANAGER' | 'EDITOR' | 'SUPPORT'

export type Permission =
  | 'properties.create'
  | 'properties.update'
  | 'properties.delete'
  | 'page_settings.update'
  | 'locations.manage'
  | 'reviews.moderate'
  | 'inquiries.manage'
  | 'agents.manage'
  | 'users.view'
  | 'users.role_change'
  | 'team.manage'
  | 'activity_logs.view'

export const ROLE_PERMISSIONS: Record<TeamRole, Permission[]> = {
  OWNER: [
    'properties.create',
    'properties.update',
    'properties.delete',
    'page_settings.update',
    'locations.manage',
    'reviews.moderate',
    'inquiries.manage',
    'agents.manage',
    'users.view',
    'users.role_change',
    'team.manage',
    'activity_logs.view',
  ],
  MANAGER: [
    'properties.create',
    'properties.update',
    'properties.delete',
    'page_settings.update',
    'locations.manage',
    'reviews.moderate',
    'inquiries.manage',
    'agents.manage',
    'users.view',
    'activity_logs.view',
  ],
  EDITOR: [
    'properties.create',
    'properties.update',
  ],
  SUPPORT: [
    'reviews.moderate',
    'inquiries.manage',
  ],
}

/**
 * Checks if a given team role has a specific permission.
 */
export function can(role: TeamRole | null | undefined, permission: Permission): boolean {
  if (!role) return false
  const permissions = ROLE_PERMISSIONS[role]
  return permissions ? permissions.includes(permission) : false
}

export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  'properties.create': 'Create new rental properties and upload media',
  'properties.update': 'Edit existing property listings, pricing, and details',
  'properties.delete': 'Permanently delete properties and associated storage media',
  'page_settings.update': 'Customize public Rentals page layout, filters, and SEO',
  'locations.manage': 'Add, edit, reorder, and delete Kanpur working areas',
  'reviews.moderate': 'Approve, reject, edit, or delete customer property reviews',
  'inquiries.manage': 'View, contact, and update customer inquiry statuses',
  'agents.manage': 'Manage rental specialist agent profiles and details',
  'users.view': 'View registered tenant and user profiles',
  'users.role_change': 'Promote or demote user roles between ADMIN and TENANT',
  'team.manage': 'Invite, edit, change roles, and remove admin team members',
  'activity_logs.view': 'Inspect immutable system audit trail and activity history',
}
