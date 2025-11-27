// Export from domain modules
export * from './users';
export * from './workspaces';
export * from './workspace-features';
export * from './admins';
export * from './bridge-transactions';
export * from './user-safes';

// Re-export everything else from main schema, excluding what we've already exported above
export {
  // Invoice tables
  userWalletsTable,
  userProfilesTable,
  userRequestsTable,
  invoiceTemplates,
  userInvoicePreferences,
  userProfilesRelations,
  userWalletsRelations,

  // Invoice types
  type InvoiceRole,
  type InvoiceStatus,
  type UserWallet,
  type NewUserWallet,
  type UserProfile,
  type NewUserProfile,
  type UserRequest,
  type NewUserRequest,
  type InvoiceTemplate,
  type NewInvoiceTemplate,
  type UserInvoicePreferences,
  type NewUserInvoicePreferences,

  // NOTE: Safe tables are now exported from ./user-safes.ts

  // Banking tables
  userFundingSources,
  userDestinationBankAccounts,
  offrampTransfers,
  onrampTransfers,
  allocationStrategies,
  userFundingSourcesRelations,
  userDestinationBankAccountsRelations,
  offrampTransfersRelations,
  onrampTransfersRelations,
  allocationStrategiesRelations,
  type UserFundingSource,
  type NewUserFundingSource,
  type UserDestinationBankAccount,
  type NewUserDestinationBankAccount,
  type OfframpTransfer,
  type NewOfframpTransfer,
  type OnrampTransfer,
  type NewOnrampTransfer,
  type AllocationStrategy,
  type NewAllocationStrategy,

  // Earn tables
  earnDeposits,
  earnWithdrawals,
  earnVaultApySnapshots,
  incomingDeposits,
  autoEarnConfigs,
  type EarnDeposit,
  type NewEarnDeposit,
  type EarnWithdrawal,
  type NewEarnWithdrawal,
  type EarnVaultApySnapshot,
  type NewEarnVaultApySnapshot,
  type IncomingDeposit,
  type NewIncomingDeposit,

  // Chat tables
  chats,
  chatMessages,
  chatsRelations,
  chatMessagesRelations,
  type ChatDB,
  type NewChatDB,
  type ChatMessageDB,
  type NewChatMessageDB,

  // Classification
  userClassificationSettings,
  userClassificationSettingsRelations,
  type UserClassificationSetting,
  type NewUserClassificationSetting,

  // Companies
  companies,
  companyMembers,
  sharedCompanyData,
  companyClients,
  companyInviteLinks,
  companiesRelations,
  companyMembersRelations,
  sharedCompanyDataRelations,
  companyInviteLinksRelations,
  type Company,
  type NewCompany,
  type CompanyMember,
  type NewCompanyMember,
  type SharedCompanyData,
  type NewSharedCompanyData,
  type CompanyClient,
  type NewCompanyClient,
  type CompanyInviteLink,
  type NewCompanyInviteLink,

  // Platform
  platformTotals,
  type PlatformTotal,
  type NewPlatformTotal,

  // Features
  userFeatures,
  type UserFeature,
  type NewUserFeature,
} from '../schema';
