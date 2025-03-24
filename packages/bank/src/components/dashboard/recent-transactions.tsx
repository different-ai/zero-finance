import { ArrowDown, ArrowUp, ArrowUpDown, CreditCard, ArrowDownLeft, Landmark, Percent } from "lucide-react";
import { Transaction } from "@/src/types/account";
import { formatCurrency, formatDate } from "@/src/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4" />;
      case "withdrawal":
        return <ArrowUp className="h-4 w-4" />;
      case "transfer":
        return <ArrowUpDown className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "tax":
        return <Landmark className="h-4 w-4" />;
      case "yield":
        return <Percent className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (transaction: Transaction) => {
    switch (transaction.type) {
      case "deposit":
        return "bg-[#2038E5]/10 text-[#2038E5]";
      case "withdrawal":
        return "bg-[#FF4500]/10 text-[#FF4500]";
      case "transfer":
        return "bg-[#2038E5]/10 text-[#2038E5]/60";
      case "payment":
        return "bg-[#2038E5]/10 text-[#2038E5]/60";
      case "tax":
        return "bg-[#FFC940]/20 text-[#FFC940]";
      case "yield":
        return "bg-[#29D788]/10 text-[#29D788]";
      default:
        return "bg-[#2038E5]/10 text-[#2038E5]/60";
    }
  };

  const getAmountColor = (amount: number, type: string) => {
    if (type === "yield") return "text-[#29D788] font-medium";
    if (type === "tax") return "text-[#FFC940] font-medium";
    return amount < 0 ? "text-[#2038E5]/80 font-medium" : "text-[#2038E5] font-medium";
  };

  const getBadgeForType = (transaction: Transaction) => {
    switch (transaction.type) {
      case "deposit":
        return <span className="ml-2 px-1.5 py-0.5 bg-[#2038E5]/10 text-[#2038E5] text-xs rounded">IBAN</span>;
      case "tax":
        return <span className="ml-2 px-1.5 py-0.5 bg-[#FFC940]/10 text-[#FFC940] text-xs rounded">Automatic</span>;
      case "payment":
        return <span className="ml-2 px-1.5 py-0.5 bg-[#2038E5]/5 text-[#2038E5]/70 text-xs rounded">Card</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-[#2038E5]/80">Account Statement</p>
        <button className="px-3 h-7 text-xs text-[#2038E5] hover:bg-accent hover:text-accent-foreground rounded-md">
          View All
        </button>
      </div>
      
      <div className="border rounded-lg overflow-hidden border-[#2038E5]/10">
        {transactions.map((transaction, index) => (
          <div 
            key={transaction.id}
            className={`${index % 2 === 1 ? 'bg-[#f5f7ff]' : 'bg-white'} 
              ${index !== transactions.length - 1 ? 'border-b border-[#2038E5]/10' : ''}`}
          >
            <div className="p-3 flex items-center">
              <div className={`h-8 w-8 rounded-full ${getTransactionColor(transaction)} flex items-center justify-center mr-3`}>
                {getTransactionIcon(transaction)}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="text-sm font-medium">{transaction.description}</p>
                  {getBadgeForType(transaction)}
                </div>
                <p className="text-xs text-[#2038E5]/60">{formatDate(transaction.date)}</p>
              </div>
              <div className={getAmountColor(transaction.amount, transaction.type)}>
                {formatCurrency(transaction.amount, transaction.currency)}
              </div>
            </div>
            
            {transaction.type === "deposit" && transaction.counterparty && (
              <div className="px-3 py-2 bg-white border-t border-[#2038E5]/10">
                <div className="flex items-center pl-11">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-xs text-[#2038E5]/60">
                        From: {transaction.counterparty.name} • Reference: {transaction.reference || 'N/A'}
                      </p>
                    </div>
                    {transaction.counterparty.iban && (
                      <div className="mt-1 text-xs bg-[#f5f7ff] p-1.5 rounded border border-[#2038E5]/20 font-mono">
                        {transaction.counterparty.iban}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}