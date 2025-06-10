export enum Permission {
    ViewDistricts = 'view:districts',
    EditDistricts = 'edit:districts',
    AdminAccess = 'admin:access',
}
  
export const groupPermissions: Record<string, Permission[]> = {
    Admin: [Permission.AdminAccess, Permission.ViewDistricts, Permission.EditDistricts],
    QA: [Permission.ViewDistricts],
};
  