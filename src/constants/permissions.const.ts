export const ROLES = {
  DISTRIBUTOR: 'DISTRIBUTOR',
  RETAILER: 'RETAILER',
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * Single master permissions array containing all definitions and role assignments.
 */
export const PERMISSIONS = [
  // 1. Dashboard
  {
    code: 'DASHBOARD_VIEW',
    description: 'View dashboard',
    module: 'Dashboard',
    roles: [ROLES.DISTRIBUTOR, ROLES.RETAILER],
  },
  {
    code: 'DASHBOARD_VIEW_REPORTS',
    description: 'View business summary and reports',
    module: 'Dashboard',
    roles: [ROLES.DISTRIBUTOR],
  },

  // 2. User management
  {
    code: 'USER_CREATE',
    description: 'Create new user accounts',
    module: 'User management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'USER_VIEW',
    description: 'View user details',
    module: 'User management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'USER_UPDATE',
    description: 'Update user information',
    module: 'User management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'USER_DELETE',
    description: 'Deactivate user accounts',
    module: 'User management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'USER_CHANGE_ROLE',
    description: 'Assign or change user roles',
    module: 'User management',
    roles: [ROLES.DISTRIBUTOR],
  },

  // 3. Retailer management
  {
    code: 'RETAILER_CREATE',
    description: 'Register new retailers',
    module: 'Retailer management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'RETAILER_VIEW',
    description: 'View retailer details',
    module: 'Retailer management',
    roles: [ROLES.DISTRIBUTOR, ROLES.RETAILER],
  },
  {
    code: 'RETAILER_VIEW_ALL',
    description: 'View all registered retailers',
    module: 'Retailer management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'RETAILER_UPDATE',
    description: 'Update retailer information',
    module: 'Retailer management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'RETAILER_DELETE',
    description: 'Deactivate retailer accounts',
    module: 'Retailer management',
    roles: [ROLES.DISTRIBUTOR],
  },

  // 4. Product management
  {
    code: 'PRODUCT_CREATE',
    description: 'Add new milk and dairy products',
    module: 'Product management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'PRODUCT_VIEW',
    description: 'View available products',
    module: 'Product management',
    roles: [ROLES.DISTRIBUTOR, ROLES.RETAILER],
  },
  {
    code: 'PRODUCT_UPDATE',
    description: 'Update product details',
    module: 'Product management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'PRODUCT_UPDATE_PRICE',
    description: 'Change product selling prices',
    module: 'Product management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'PRODUCT_DELETE',
    description: 'Deactivate products',
    module: 'Product management',
    roles: [ROLES.DISTRIBUTOR],
  },

  // 5. Order management
  {
    code: 'ORDER_CREATE',
    description: 'Create new orders',
    module: 'Order management',
    roles: [ROLES.DISTRIBUTOR, ROLES.RETAILER],
  },
  {
    code: 'ORDER_VIEW',
    description: 'View individual order details',
    module: 'Order management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ORDER_VIEW_ALL',
    description: 'View orders from all retailers',
    module: 'Order management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ORDER_VIEW_OWN',
    description: 'View own orders',
    module: 'Order management',
    roles: [ROLES.RETAILER],
  },
  {
    code: 'ORDER_UPDATE',
    description: 'Update order details',
    module: 'Order management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ORDER_CANCEL',
    description: 'Cancel orders',
    module: 'Order management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ORDER_UPDATE_OWN',
    description: 'Modify own eligible orders',
    module: 'Order management',
    roles: [ROLES.RETAILER],
  },

  // 6. Payment management
  {
    code: 'PAYMENT_CREATE',
    description: 'Record payments from retailers',
    module: 'Payment management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'PAYMENT_VIEW',
    description: 'View individual payment details',
    module: 'Payment management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'PAYMENT_VIEW_ALL',
    description: 'View all retailer payments',
    module: 'Payment management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'PAYMENT_VIEW_OWN',
    description: 'View own payment history',
    module: 'Payment management',
    roles: [ROLES.RETAILER],
  },
  {
    code: 'PAYMENT_UPDATE',
    description: 'Update payment records',
    module: 'Payment management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'PAYMENT_REFUND',
    description: 'Process or record refunds',
    module: 'Payment management',
    roles: [ROLES.DISTRIBUTOR],
  },

  // 7. Outstanding balance
  {
    code: 'BALANCE_VIEW_ALL',
    description: 'View all retailer outstanding balances',
    module: 'Outstanding balance',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'BALANCE_VIEW_OWN',
    description: 'View own outstanding balance',
    module: 'Outstanding balance',
    roles: [ROLES.RETAILER],
  },
  {
    code: 'BALANCE_ADJUST',
    description: 'Make manual balance adjustments',
    module: 'Outstanding balance',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'BALANCE_VIEW_HISTORY',
    description: 'View applicable balance history',
    module: 'Outstanding balance',
    roles: [ROLES.DISTRIBUTOR, ROLES.RETAILER],
  },

  // 8. Inventory management
  {
    code: 'INVENTORY_VIEW',
    description: 'View inventory',
    module: 'Inventory management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'INVENTORY_UPDATE',
    description: 'Update inventory quantities',
    module: 'Inventory management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'INVENTORY_ADJUST',
    description: 'Make manual inventory adjustments',
    module: 'Inventory management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'INVENTORY_VIEW_HISTORY',
    description: 'View inventory transaction history',
    module: 'Inventory management',
    roles: [ROLES.DISTRIBUTOR],
  },

  // 9. Reports and analytics
  {
    code: 'REPORT_SALES_VIEW',
    description: 'View sales reports',
    module: 'Reports and analytics',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'REPORT_PAYMENT_VIEW',
    description: 'View payment reports',
    module: 'Reports and analytics',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'REPORT_OUTSTANDING_VIEW',
    description: 'View outstanding balance reports',
    module: 'Reports and analytics',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'REPORT_EXPORT',
    description: 'Export business reports',
    module: 'Reports and analytics',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ANALYTICS_VIEW',
    description: 'View business analytics',
    module: 'Reports and analytics',
    roles: [ROLES.DISTRIBUTOR],
  },

  // 10. Routes and visits
  {
    code: 'ROUTE_CREATE',
    description: 'Create delivery routes',
    module: 'Routes and visits',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ROUTE_VIEW',
    description: 'View delivery routes',
    module: 'Routes and visits',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ROUTE_UPDATE',
    description: 'Update delivery routes',
    module: 'Routes and visits',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ROUTE_DELETE',
    description: 'Deactivate delivery routes',
    module: 'Routes and visits',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'VISIT_CREATE',
    description: 'Record retailer visits',
    module: 'Routes and visits',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'VISIT_VIEW',
    description: 'View retailer visit history',
    module: 'Routes and visits',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'VISIT_UPDATE',
    description: 'Update visit records',
    module: 'Routes and visits',
    roles: [ROLES.DISTRIBUTOR],
  },

  // 11. Notifications
  {
    code: 'NOTIFICATION_CREATE',
    description: 'Create and send business notifications',
    module: 'Notifications',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'NOTIFICATION_VIEW',
    description: 'View applicable notifications',
    module: 'Notifications',
    roles: [ROLES.DISTRIBUTOR, ROLES.RETAILER],
  },
  {
    code: 'NOTIFICATION_DELETE',
    description: 'Delete notifications',
    module: 'Notifications',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'NOTIFICATION_MANAGE',
    description: 'Manage notification settings',
    module: 'Notifications',
    roles: [ROLES.DISTRIBUTOR],
  },

  // 12. System management
  {
    code: 'ROLE_VIEW',
    description: 'View available roles',
    module: 'System management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ROLE_CREATE',
    description: 'Create new roles',
    module: 'System management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ROLE_UPDATE',
    description: 'Update role information',
    module: 'System management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ROLE_DELETE',
    description: 'Deactivate roles',
    module: 'System management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'PERMISSION_VIEW',
    description: 'View permission catalogue',
    module: 'System management',
    roles: [ROLES.DISTRIBUTOR],
  },
  {
    code: 'ROLE_PERMISSION_MANAGE',
    description: 'Assign and revoke permissions',
    module: 'System management',
    roles: [ROLES.DISTRIBUTOR],
  },
] as const;

export type PermissionCode = (typeof PERMISSIONS)[number]['code'];

// All permission codes
export const PERMISSION_CATALOGUE = Object.fromEntries(PERMISSIONS.map((p) => [p.code, p.code])) as { [K in PermissionCode]: K }
// Filtered directly from PERMISSIONS objects without hardcoding strings
export const RETAILER_PERMISSION_CODES: PermissionCode[] = PERMISSIONS.filter(
  (p) => (p.roles as readonly string[]).includes(ROLES.RETAILER)
).map((p) => p.code);

export const DISTRIBUTOR_PERMISSION_CODES: PermissionCode[] =
  PERMISSIONS.filter((p) =>
    (p.roles as readonly string[]).includes(ROLES.DISTRIBUTOR)
  ).map((p) => p.code);
