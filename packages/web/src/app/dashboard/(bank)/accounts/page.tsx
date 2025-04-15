import { PlusCircle, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { accounts } from "@/lib/mock-data";
import { shortenAddress } from "@/app/dashboard/(bank)/lib/utils";
// Assuming formatCurrency and formatIBAN are in shared utils
import { formatCurrency, formatIBAN } from "@hypr/shared/src/utils";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-[#2038E5]/60">Manage your bank accounts and balances</p>
        </div>
        <Button className="bg-[#2038E5] hover:bg-[#2038E5]/90 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </div>

      <div className="grid gap-6">
        {accounts.map((account) => {
          const isCrypto = account.type === 'crypto';
          
          return (
            <div key={account.id} className="border rounded-xl border-[#2038E5]/10 bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#2038E5]/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#2038E5]/10 flex items-center justify-center">
                      {isCrypto ? 
                        <Wallet className="h-5 w-5 text-[#2038E5]" /> : 
                        <CreditCard className="h-5 w-5 text-[#2038E5]" />
                      }
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{account.name}</h2>
                      <p className="text-sm text-[#2038E5]/60">
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(account.balance, account.currency)}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isCrypto ? (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-[#2038E5]/80 mb-1">Wallet Address</h3>
                        <p className="text-[#2038E5] bg-[#f5f7ff] p-2 rounded border border-[#2038E5]/20 font-mono text-sm">
                          {shortenAddress(account.walletAddress || "", 16)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#2038E5]/80 mb-1">Blockchain</h3>
                        <p className="text-[#2038E5]">{account.blockchain}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-[#2038E5]/80 mb-1">Account Number</h3>
                        <p className="text-[#2038E5]">{account.accountNumber}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#2038E5]/80 mb-1">IBAN</h3>
                        <p className="text-[#2038E5] bg-[#f5f7ff] p-2 rounded border border-[#2038E5]/20 font-mono text-sm">
                          {account.iban ? formatIBAN(account.iban) : "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="text-sm font-medium text-[#2038E5]/80 mb-1">Created on</h3>
                    <p className="text-[#2038E5]">
                      {/* Assuming date formatting will be handled elsewhere or added later */}
                      {/* {account.createdAt.toLocaleDateString()} */}
                      Placeholder Date
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#2038E5]/80 mb-1">Last update</h3>
                    <p className="text-[#2038E5]">
                      {/* Assuming date formatting will be handled elsewhere or added later */}
                      {/* {account.updatedAt.toLocaleDateString()} */}
                      Placeholder Date
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <Button variant="outline" className="border-[#2038E5]/20 text-[#2038E5] hover:bg-[#2038E5]/10 hover:text-[#2038E5] hover:border-[#2038E5]/30">
                    View Transactions
                  </Button>
                  <Button variant="outline" className="border-[#2038E5]/20 text-[#2038E5] hover:bg-[#2038E5]/10 hover:text-[#2038E5] hover:border-[#2038E5]/30">
                    Manage Account
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}