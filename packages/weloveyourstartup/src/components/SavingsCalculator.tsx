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
    <div className={`bg-black border-2 border-[#00FF00] ${className}`}>
      <div className="p-6 space-y-6">
        {/* Amount Slider */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#00FF00] mb-3 font-mono font-bold">
            [ INPUT: IDLE_CASH_AMOUNT ]
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={calculatorConfig.minAmount}
              max={calculatorConfig.maxAmount}
              step={calculatorConfig.step}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 accent-[#00FFFF]"
            />
            <div className="min-w-[120px] text-right">
              <span className="tabular-nums text-xl font-black text-[#00FFFF] font-mono">
                {formatCompactCurrency(amount)}
              </span>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-[#00FF00]/60 font-mono">
            <span>{formatCompactCurrency(calculatorConfig.minAmount)}</span>
            <span>{formatCompactCurrency(calculatorConfig.maxAmount)}</span>
          </div>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-black border border-[#00FF00]/30">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-wider text-[#FF0000] font-mono font-bold">
              [ BANK: {bankRate}% APY ]
            </div>
            <div className="mt-1 tabular-nums text-[16px] font-medium text-[#FF0000]/80 font-mono">
              {formatCompactCurrency(yearlyBankReturn)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-wider text-[#00FFFF] font-mono font-bold">
              [ ZERO: {zeroRate}% APY ]
            </div>
            <div className="mt-1 tabular-nums text-[16px] font-medium text-[#00FFFF] font-mono">
              {formatCompactCurrency(yearlyZeroReturn)}
            </div>
          </div>
          <div className="text-center bg-[#FFFF00]/10 border border-[#FFFF00] p-2 -m-2">
            <div className="text-[11px] uppercase tracking-wider text-[#FFFF00] font-medium font-mono font-bold">
              [ DELTA: ANNUAL ]
            </div>
            <div className="mt-1 tabular-nums text-[16px] font-bold text-[#FFFF00] font-mono">
              +{formatCompactCurrency(yearlyDifference)}
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-black border border-[#00FF00]/30">
          <button
            onClick={() => setMode('expenses')}
            className={`flex-1 py-2 px-3 text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
              mode === 'expenses'
                ? 'bg-[#00FF00] text-black border-2 border-[#00FF00]'
                : 'text-[#00FF00] hover:bg-[#00FF00]/10 border-2 border-transparent'
            }`}
          >
            [ MODE: EXPENSES ]
          </button>
          <button
            onClick={() => setMode('team')}
            className={`flex-1 py-2 px-3 text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
              mode === 'team'
                ? 'bg-[#00FF00] text-black border-2 border-[#00FF00]'
                : 'text-[#00FF00] hover:bg-[#00FF00]/10 border-2 border-transparent'
            }`}
          >
            [ MODE: TEAM_BUILD ]
          </button>
        </div>

        {/* Results */}
        {mode === 'expenses' ? (
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wider text-[#00FFFF] font-mono font-bold">
              [ OUTPUT: MONTHLY_COVERAGE = {formatCompactCurrency(monthlyDifference)}/MO ]
            </p>

            {coveredExpenses.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {coveredExpenses.slice(0, 6).map((expense) => (
                    <div
                      key={expense.name}
                      className="flex items-center gap-2 p-2 bg-black border border-[#00FFFF]/30"
                    >
                      <span className="text-[18px]">{expense.icon}</span>
                      <div className="flex-1">
                        <div className="text-[11px] font-bold text-white uppercase font-mono">
                          {expense.name.toUpperCase().replace(/\s+/g, '_')}
                        </div>
                        <div className="text-[10px] text-[#00FFFF]/70 font-mono">
                          {formatCompactCurrency(expense.cost)}/MO
                        </div>
                      </div>
                      <span className="text-[#00FF00] text-[11px] font-mono font-bold">[OK]</span>
                    </div>
                  ))}
                </div>

                {coveredExpenses.length > 6 && (
                  <p className="text-[11px] text-[#00FF00]/80 text-center uppercase font-mono">
                    +{coveredExpenses.length - 6} ADDITIONAL_EXPENSES_COVERED
                  </p>
                )}

                {remainingBudget > 500 && (
                  <div className="p-3 bg-black border-2 border-[#FFFF00]">
                    <p className="text-[12px] font-bold text-[#FFFF00] uppercase font-mono">
                      {'>> SURPLUS: '}{formatCompactCurrency(remainingBudget)}/MO REMAINING
                    </p>
                    <p className="text-[11px] text-[#FFFF00]/70 mt-1 uppercase font-mono">
                      EXCESS_RUNWAY / PROFIT_MARGIN
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-[11px] text-[#FF0000] uppercase font-mono">
                [ ERROR: INSUFFICIENT_IDLE_CASH ]
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-wider text-[#00FFFF] font-mono font-bold">
              [ OUTPUT: ANNUAL_BUDGET = {formatCompactCurrency(yearlyDifference)}/YR ]
            </p>

            {teamOptions.teamCombinations.length > 0 ? (
              <>
                {/* Show different hiring strategies */}
                {teamOptions.teamCombinations.map((combo, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-black border-2 border-[#00FFFF]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-[#00FFFF] uppercase font-mono">
                        [ STRATEGY_{idx + 1}: {combo.description.toUpperCase().replace(/\s+/g, '_')} ]
                      </span>
                      {combo.remainingBudget > 10000 && (
                        <span className="text-[10px] text-[#00FF00] font-mono">
                          +{formatCompactCurrency(combo.remainingBudget)} SURPLUS
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
                            <div className="text-[11px] font-bold text-white uppercase font-mono">
                              MEMBER_{(memberIdx + 1).toString().padStart(2, '0')}: {member.role.toUpperCase().replace(/\s+/g, '_')}
                            </div>
                            <div className="text-[10px] text-[#00FFFF]/70 font-mono">
                              COST: {formatCompactCurrency(member.salary)}/YR
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {combo.members.length > 1 && (
                      <div className="mt-3 pt-3 border-t border-[#00FFFF]/30">
                        <div className="text-[11px] text-[#00FF00] uppercase font-mono">
                          TOTAL_TEAM_COST: {formatCompactCurrency(combo.totalCost)}/YR
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Show how many individual roles they can afford */}
                {teamOptions.affordableRoles.length > 3 && (
                  <div className="p-3 bg-black border border-[#00FF00]">
                    <p className="text-[11px] text-[#00FF00] uppercase font-mono font-bold">
                      [ INFO: AFFORDABLE_ROLES_COUNT = {teamOptions.affordableRoles.length} ]
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
                        <span className="text-[10px] text-[#00FF00]/70 font-mono">
                          +{teamOptions.affordableRoles.length - 8}_MORE
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Next milestone */}
                {teamOptions.nextMilestone &&
                  teamOptions.percentageToNext < 90 && (
                    <div className="p-3 bg-black border-2 border-[#FF00FF]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#FF00FF] uppercase font-mono">
                          NEXT_MILESTONE: {teamOptions.nextMilestone.role.toUpperCase().replace(/\s+/g, '_')}
                        </span>
                        <span className="text-[10px] text-[#FF00FF]/70 font-mono">
                          {Math.round(teamOptions.percentageToNext)}% PROGRESS
                        </span>
                      </div>
                      <div className="h-2 bg-[#FF00FF]/20 overflow-hidden">
                        <div
                          className="h-full bg-[#FF00FF] transition-all duration-500"
                          style={{ width: `${teamOptions.percentageToNext}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[10px] text-[#FF00FF]/70 uppercase font-mono">
                        REQUIRED_ADDITIONAL:{' '}
                        {formatCompactCurrency(
                          teamOptions.nextMilestone.salary - yearlyDifference,
                        )}/YR
                      </p>
                    </div>
                  )}
              </>
            ) : (
              <div className="p-4 bg-black border border-[#FF0000]">
                <p className="text-[11px] text-[#FF0000] uppercase font-mono">
                  [ WARNING: INSUFFICIENT_BUDGET_FOR_TEAM ]
                </p>
                {teamOptions.nextMilestone && (
                  <div className="mt-3">
                    <p className="text-[10px] text-[#FF0000]/70 uppercase font-mono">
                      REQUIRED_IDLE:{' '}
                      {formatCompactCurrency(
                        teamOptions.nextMilestone.salary / 0.04,
                      )}{' '}
                      FOR {teamOptions.nextMilestone.role.toUpperCase().replace(/\s+/g, '_')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Fun milestone messages */}
            {yearlyDifference >= 500000 && (
              <div className="p-3 bg-black border-2 border-[#00FF00]">
                <p className="text-[11px] text-[#00FF00] font-bold uppercase font-mono">
                  {'>> ALERT: DEPARTMENT_SCALE_FUNDING_ACHIEVED'}
                </p>
              </div>
            )}

            {yearlyDifference >= 200000 && yearlyDifference < 500000 && (
              <div className="p-3 bg-black border-2 border-[#00FFFF]">
                <p className="text-[11px] text-[#00FFFF] font-bold uppercase font-mono">
                  {'>> STATUS: SENIOR_HIRE_BUDGET_AVAILABLE'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
