'use client';

import { useState, useEffect } from 'react';
import { data, type Expense, type TeamMember } from '@/lib/data';

interface CalculatorProps {
  defaultAmount?: number;
  className?: string;
}

export function SavingsCalculator({
  defaultAmount = data.calculatorConfig.defaultAmount,
  className = '',
}: CalculatorProps) {
  const {
    expenses: EXPENSES,
    teamMembers: TEAM_MEMBERS,
    calculatorConfig,
  } = data;
  const [amount, setAmount] = useState(defaultAmount);
  const [mode, setMode] = useState<'expenses' | 'team'>('expenses');
  const bankRate = calculatorConfig.bankRate;
  const zeroRate = calculatorConfig.zeroRate;

  const yearlyBankReturn = (amount * bankRate) / 100;
  const yearlyZeroReturn = (amount * zeroRate) / 100;
  const yearlyDifference = yearlyZeroReturn - yearlyBankReturn;
  const monthlyDifference = yearlyDifference / 12;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value);
  };

  // Calculate what can be covered with the extra yield
  const getCoveredExpenses = () => {
    let remaining = monthlyDifference;
    const covered: Expense[] = [];

    for (const expense of EXPENSES) {
      if (remaining >= expense.cost) {
        covered.push(expense);
        remaining -= expense.cost;
      }
    }

    return { covered, remaining };
  };

  // Get comprehensive team hiring options
  const getTeamHiringOptions = () => {
    const yearlyExtra = yearlyDifference;

    // Find all individually affordable roles
    const affordableRoles = TEAM_MEMBERS.filter(
      (m) => m.salary <= yearlyExtra,
    ).sort((a, b) => b.salary - a.salary);

    // Calculate optimal team combinations
    const teamCombinations: Array<{
      members: TeamMember[];
      totalCost: number;
      remainingBudget: number;
      description: string;
    }> = [];

    // Single highest role
    if (affordableRoles.length > 0) {
      const highestRole = affordableRoles[0];
      teamCombinations.push({
        members: [highestRole],
        totalCost: highestRole.salary,
        remainingBudget: yearlyExtra - highestRole.salary,
        description: 'Best Individual Hire',
      });
    }

    // Multiple junior roles combination
    const juniorRoles = TEAM_MEMBERS.filter((m) => m.salary <= 60000);
    let juniorBudget = yearlyExtra;
    const juniorTeam: TeamMember[] = [];
    for (const role of juniorRoles) {
      if (juniorBudget >= role.salary) {
        juniorTeam.push(role);
        juniorBudget -= role.salary;
        if (juniorTeam.length >= 3) break; // Max 3 for display
      }
    }
    if (juniorTeam.length > 1) {
      teamCombinations.push({
        members: juniorTeam,
        totalCost: juniorTeam.reduce((sum, m) => sum + m.salary, 0),
        remainingBudget:
          yearlyExtra - juniorTeam.reduce((sum, m) => sum + m.salary, 0),
        description: 'Maximum Headcount',
      });
    }

    // Balanced team (mix of seniorities)
    const balancedTeam: TeamMember[] = [];
    let balancedBudget = yearlyExtra;

    // Try to get one from each tier
    const seniorRole = TEAM_MEMBERS.find(
      (m) => m.salary >= 120000 && m.salary <= balancedBudget,
    );
    if (seniorRole) {
      balancedTeam.push(seniorRole);
      balancedBudget -= seniorRole.salary;
    }

    const midRole = TEAM_MEMBERS.find(
      (m) =>
        m.salary >= 70000 && m.salary <= 100000 && m.salary <= balancedBudget,
    );
    if (midRole) {
      balancedTeam.push(midRole);
      balancedBudget -= midRole.salary;
    }

    const juniorRole = TEAM_MEMBERS.find(
      (m) => m.salary <= 60000 && m.salary <= balancedBudget,
    );
    if (juniorRole) {
      balancedTeam.push(juniorRole);
      balancedBudget -= juniorRole.salary;
    }

    if (balancedTeam.length > 1) {
      teamCombinations.push({
        members: balancedTeam,
        totalCost: balancedTeam.reduce((sum, m) => sum + m.salary, 0),
        remainingBudget:
          yearlyExtra - balancedTeam.reduce((sum, m) => sum + m.salary, 0),
        description: 'Balanced Team',
      });
    }

    // Find next milestone (what they're close to affording)
    const nextMilestone = TEAM_MEMBERS.filter(
      (m) => m.salary > yearlyExtra,
    ).sort((a, b) => a.salary - b.salary)[0];

    return {
      affordableRoles,
      teamCombinations,
      nextMilestone,
      percentageToNext: nextMilestone
        ? (yearlyExtra / nextMilestone.salary) * 100
        : 100,
    };
  };

  const { covered: coveredExpenses, remaining: remainingBudget } =
    getCoveredExpenses();
  const teamOptions = getTeamHiringOptions();

  useEffect(() => {
    setAmount(defaultAmount);
  }, [defaultAmount]);

  return (
    <div className={`bg-white border border-[#101010]/10 ${className}`}>
      <div className="p-6 space-y-6">
        {/* Amount Slider */}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-2">
            💰 Idle Cash Amount
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={calculatorConfig.minAmount}
              max={calculatorConfig.maxAmount}
              step={calculatorConfig.step}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 accent-primary-blue"
            />
            <div className="min-w-[120px] text-right">
              <span className="tabular-nums text-[20px] font-medium text-primary-blue">
                {formatCompactCurrency(amount)}
              </span>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-[#101010]/40">
            <span>{formatCompactCurrency(calculatorConfig.minAmount)}</span>
            <span>{formatCompactCurrency(calculatorConfig.maxAmount)}</span>
          </div>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-bg-cream rounded-md">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#101010]/50">
              Bank ({bankRate}%)
            </div>
            <div className="mt-1 tabular-nums text-[16px] font-medium text-[#101010]/60">
              {formatCompactCurrency(yearlyBankReturn)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#101010]/50">
              Zero ({zeroRate}%)
            </div>
            <div className="mt-1 tabular-nums text-[16px] font-medium text-primary-blue">
              {formatCompactCurrency(yearlyZeroReturn)}
            </div>
          </div>
          <div className="text-center bg-primary-blue/10 rounded-md p-2 -m-2">
            <div className="text-[10px] uppercase tracking-[0.14em] text-primary-blue font-medium">
              Extra 🎉
            </div>
            <div className="mt-1 tabular-nums text-[16px] font-bold text-primary-blue">
              +{formatCompactCurrency(yearlyDifference)}
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-bg-cream rounded-md">
          <button
            onClick={() => setMode('expenses')}
            className={`flex-1 py-2 px-3 text-[13px] font-medium rounded transition-all ${
              mode === 'expenses'
                ? 'bg-white text-primary-blue shadow-sm'
                : 'text-[#101010]/60 hover:text-[#101010]'
            }`}
          >
            💳 Cover Expenses
          </button>
          <button
            onClick={() => setMode('team')}
            className={`flex-1 py-2 px-3 text-[13px] font-medium rounded transition-all ${
              mode === 'team'
                ? 'bg-white text-primary-blue shadow-sm'
                : 'text-[#101010]/60 hover:text-[#101010]'
            }`}
          >
            👥 Build Your Team
          </button>
        </div>

        {/* Results */}
        {mode === 'expenses' ? (
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
              Your Extra {formatCompactCurrency(monthlyDifference)}/mo Covers:
            </p>

            {coveredExpenses.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {coveredExpenses.slice(0, 6).map((expense) => (
                    <div
                      key={expense.name}
                      className="flex items-center gap-2 p-2 bg-primary-blue/5 border border-primary-blue/20 rounded-md"
                    >
                      <span className="text-[18px]">{expense.icon}</span>
                      <div className="flex-1">
                        <div className="text-[12px] font-medium text-[#101010]">
                          {expense.name}
                        </div>
                        <div className="text-[11px] text-[#101010]/60">
                          {formatCompactCurrency(expense.cost)}/mo
                        </div>
                      </div>
                      <span className="text-primary-blue text-[14px]">✓</span>
                    </div>
                  ))}
                </div>

                {coveredExpenses.length > 6 && (
                  <p className="text-[11px] text-[#101010]/60 text-center">
                    +{coveredExpenses.length - 6} more expenses covered
                  </p>
                )}

                {remainingBudget > 500 && (
                  <div className="p-3 bg-gradient-to-r from-[#10B981]/10 to-primary-blue/10 border border-[#10B981]/30 rounded-md">
                    <p className="text-[16px] font-medium text-[#10B981]">
                      Plus {formatCompactCurrency(remainingBudget)}/mo left
                      over! 🎊
                    </p>
                    <p className="text-[12px] text-[#101010]/70 mt-1">
                      That's extra runway or pure profit
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-[13px] text-[#101010]/60">
                Increase your idle cash to start covering expenses
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
              Your Extra {formatCompactCurrency(yearlyDifference)}/yr Can Fund:
            </p>

            {teamOptions.teamCombinations.length > 0 ? (
              <>
                {/* Show different hiring strategies */}
                {teamOptions.teamCombinations.map((combo, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-r from-primary-blue/5 to-primary-blue/10 border border-primary-blue/20 rounded-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-medium text-primary-blue">
                        {combo.description}
                      </span>
                      {combo.remainingBudget > 10000 && (
                        <span className="text-[10px] text-[#101010]/60">
                          +{formatCompactCurrency(combo.remainingBudget)} left
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {combo.members.map((member, memberIdx) => (
                        <div
                          key={memberIdx}
                          className="flex items-center gap-2"
                        >
                          <span className="text-[20px]">{member.icon}</span>
                          <div className="flex-1">
                            <div className="text-[13px] font-medium text-[#101010]">
                              {member.role}
                            </div>
                            <div className="text-[11px] text-[#101010]/60">
                              {formatCompactCurrency(member.salary)}/yr
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {combo.members.length > 1 && (
                      <div className="mt-3 pt-3 border-t border-primary-blue/10">
                        <div className="text-[11px] text-[#101010]/70">
                          Total team cost:{' '}
                          {formatCompactCurrency(combo.totalCost)}/yr
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Show how many individual roles they can afford */}
                {teamOptions.affordableRoles.length > 3 && (
                  <div className="p-3 bg-[#101010]/5 rounded-md">
                    <p className="text-[12px] text-[#101010]/70">
                      🎯 You can afford{' '}
                      <strong>{teamOptions.affordableRoles.length}</strong>{' '}
                      different roles individually
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {teamOptions.affordableRoles.slice(0, 8).map((role) => (
                        <span
                          key={role.role}
                          className="text-[16px]"
                          title={role.role}
                        >
                          {role.icon}
                        </span>
                      ))}
                      {teamOptions.affordableRoles.length > 8 && (
                        <span className="text-[11px] text-[#101010]/60">
                          +{teamOptions.affordableRoles.length - 8}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Next milestone */}
                {teamOptions.nextMilestone &&
                  teamOptions.percentageToNext < 90 && (
                    <div className="p-3 bg-[#FFA500]/10 border border-[#FFA500]/20 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-medium text-[#101010]">
                          Next: {teamOptions.nextMilestone.role}
                        </span>
                        <span className="text-[11px] text-[#101010]/60">
                          {Math.round(teamOptions.percentageToNext)}% there
                        </span>
                      </div>
                      <div className="h-2 bg-[#101010]/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FFA500] to-primary-blue transition-all duration-500"
                          style={{ width: `${teamOptions.percentageToNext}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-[#101010]/60">
                        Need{' '}
                        {formatCompactCurrency(
                          teamOptions.nextMilestone.salary - yearlyDifference,
                        )}{' '}
                        more/yr
                      </p>
                    </div>
                  )}
              </>
            ) : (
              <div className="p-4 bg-[#101010]/5 rounded-md">
                <p className="text-[13px] text-[#101010]/60">
                  💡 Increase your idle cash to start building your team
                </p>
                {teamOptions.nextMilestone && (
                  <div className="mt-3">
                    <p className="text-[12px] text-[#101010]/70">
                      With{' '}
                      {formatCompactCurrency(
                        teamOptions.nextMilestone.salary / 0.04,
                      )}{' '}
                      idle, you could hire a {teamOptions.nextMilestone.role}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Fun milestone messages */}
            {yearlyDifference >= 500000 && (
              <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-md animate-pulse-slow">
                <p className="text-[13px] text-[#10B981] font-medium">
                  🚀 Holy moly! You could build an entire department with just
                  yield!
                </p>
              </div>
            )}

            {yearlyDifference >= 200000 && yearlyDifference < 500000 && (
              <div className="p-3 bg-primary-blue/10 border border-primary-blue/30 rounded-md">
                <p className="text-[13px] text-primary-blue font-medium">
                  ✨ You're in founder salary territory! Your yield = a senior
                  hire!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
