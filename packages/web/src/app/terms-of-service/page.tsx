import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions – DeFi Protection Security Guarantee',
  description:
    'Review the terms and conditions for the DeFi Protection Security Guarantee provided through 0.finance.',
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 prose prose-slate dark:prose-invert">
      <h1>Terms and Conditions (DeFi Protection Security Guarantee)</h1>
      <p>Last updated: July 26, 2024</p>

      <p>
        These Security Services Guarantee Terms & Conditions (this "Contract")
        applies to you only if you have purchased security services with the
        optional Security Services Guarantee contract through 0.finance. This
        Contract is for your sole benefit with no third party beneficiaries and
        is not assignable by you.
      </p>

      <h2>Security Services Guarantee</h2>
      <p>
        In the event of a Hack (defined below) due to an error in alerting the
        security of your account and your identified wallet(s) or smart
        contract(s) with deposits into an approved DeFi protocol ("Wallet(s)"),
        we agree to reimburse you up to the Maximum Reimbursement amount
        (defined below) for the loss or theft of your deposit from your Wallet,
        subject to the terms, conditions, and limitations set forth below (the
        "Security Services Guarantee").
      </p>

      <h3>Definition of Hack</h3>
      <p>
        For purposes of this Contract, "Hack" means any incident that exploits
        smart contract vulnerabilities in the DeFi protocol(s) ("Protocol")
        identified in your purchase confirmation ("Confirmation") that renders
        the DeFi Protocol's liabilities to you irredeemable (a "loss of funds",
        or a "Hack").
      </p>

      <h3>Covered Protocols and Blockchains</h3>
      <p>
        Protection is valid only for <strong>Morpho vaults</strong> accessed
        through this interface and on the Ethereum, Arbitrum, Avalanche, Base,
        BSC, Fantom, Gnosis, Mantle, Optimism, and Polygon blockchains
        ("Blockchain").
      </p>
      <p>
        <strong>Insurance and Security:</strong> Insurance coverage (up to $1M)
        is provided by Chainproof, a licensed insurer. Smart contract security
        audits are performed by Quantstamp.{' '}
        <a href="/legal/insurance-terms" className="text-[#1B29FF] underline">
          View full insurance terms
        </a>
      </p>

      <h3>Reimbursement Amount</h3>
      <p>
        Under our Security Services Guarantee, we will reimburse you for the
        lesser of (i) the amount of funds lost in the Hack, including any
        accrued interest or yield, less any liabilities that you owe to the DeFi
        protocol or other users of the DeFi protocol, or (ii) your chosen
        Maximum Reimbursement amount (each in USD) ("Damages"). In no event will
        our liability for Damages exceed $1,000,000 in the aggregate across any
        one Protocol.
      </p>

      <h3>Valuation Methodology</h3>
      <p>
        The valuation of the funds (or tokens in general, including NFTs) lost
        at the time of the Hack will be calculated in USD terms based on data
        from multiple sources:
      </p>
      <ul>
        <li>
          For fungible tokens: median of the last 30-day average UTC closing USD
          price based on data from CoinMarketCap, CoinGecko, and OnChainFX
        </li>
        <li>
          For non-fungible tokens: median of the 30-day average UTC closing
          collection floor price based on data from CoinMarketCap, CoinGecko,
          and DeepNFTValue
        </li>
        <li>
          For all other tokens: valuation conducted at our sole discretion
        </li>
      </ul>

      <h3>Purchase Limits</h3>
      <p>
        You may only purchase a Security Services Guarantee through one Wallet
        per Protocol; however, you may increase your Wallet's Maximum
        Reimbursement amount at any time, up to a maximum of $1,000,000. Any
        violation of these terms may result in the immediate cancellation of any
        or all of your Contracts, and any of our obligations of reimbursement
        will be void.
      </p>

      <h3>Processing Fee</h3>
      <p>
        A case review and processing fee of 5% of your chosen Maximum
        Reimbursement amount ("Processing Fee") will automatically be withheld
        from your payment. Should the Processing Fee exceed the Damages, no case
        will be processed and no payment will be made.
      </p>

      <h2>Qualification</h2>
      <p>To qualify for the Security Guarantee, you must have:</p>
      <ol>
        <li>
          Identified the Blockchain, Wallet, and Protocol for which the Security
          Services Guarantee will apply;
        </li>
        <li>
          Purchased a valid Security Services Guarantee for the identified
          Wallet(s) corresponding to an applicable Protocol on an approved
          Blockchain prior to a Hack;
        </li>
        <li>
          Provided notice of loss or Damages to us within 7 calendar days from
          the date of discovery; and
        </li>
        <li>Complied with all of the terms and conditions of this Contract.</li>
      </ol>
      <p>
        In the event of a Hack, you may be required to file a police report upon
        our reasonable request. Failure to do so may void or terminate your
        Security Guarantee.
      </p>

      <h2>Limitations</h2>
      <p>
        The Security Guarantee does not apply to, and no payment will be made
        for, Damages arising from the following circumstances:
      </p>
      <ul>
        <li>
          Damages incurred by you before your Security Guarantee went into
          effect or after the expiration of the Security Guarantee;
        </li>
        <li>Any oracle failure, manipulation, or malfunction;</li>
        <li>Any attack on the blockchain layer;</li>
        <li>
          Any attack, such as "frontend attacks", whose root cause do not
          involve the exploit of previously unknown smart contract
          vulnerabilities;
        </li>
        <li>
          Any attack involving externally owned address(es) with privileged
          roles in the DeFi protocol;
        </li>
        <li>
          Any attack initiated by a special class(es) of users with privilege(s)
          to manage digital assets or tokens;
        </li>
        <li>
          Attacks enabled by bugs in third-party software or third-party
          libraries including compilers;
        </li>
        <li>
          The manipulation or exploitation of changes to cryptocurrencies or
          protocols via voting (generally known as "governance attacks");
        </li>
        <li>
          Social engineering or phishing schemes that result in you giving away
          your passwords, keys, wallet, or similar information;
        </li>
        <li>Costs incurred through bug-bounty submissions;</li>
        <li>
          Damages arising from excessive token transfer approvals beyond the
          minimum approval required to use the DeFi protocol;
        </li>
        <li>
          Fraudulent claims of Damages based on a material misrepresentation of
          the facts;
        </li>
        <li>Damages caused by your violation of this Contract;</li>
        <li>
          Your failure to comply with any applicable law or ordinance, or your
          violation of law, criminal acts, or misdemeanors; or
        </li>
        <li>
          Damages or attacks that occurred on any blockchain that is not an
          approved Blockchain.
        </li>
      </ul>

      <h3>Secondary Coverage</h3>
      <p>
        Our liability under this Contract is secondary to any insurance coverage
        or other asset protection that you may carry, and the Maximum Damages
        may be reduced by any amounts you recover or are owed or receive under
        any applicable coverage or protection. You agree to notify us promptly
        of any such applicable coverage or protection in the event of a Hack.
      </p>

      <h3>Limitation of Liability</h3>
      <p>
        In no event will we be liable to you (or any third party) for any
        consequential, special, indirect, incidental, punitive, or exemplary
        damages, nor for any loss of profits, revenue, use or corruption of
        software or data, costs of substitute goods or services, interruption,
        delay, or outages arising out of or relating to a Hack or this Contract.
      </p>

      <h3>Root Cause Liability</h3>
      <p>
        Our liability under this contract is limited to the DeFi protocol that
        is identified as the root cause of the loss of funds. If a Hack affects
        multiple protocols in a dependency chain, reimbursement is determined
        based on which specific protocol's vulnerability was exploited.
      </p>

      <h2>Payment & Fees</h2>
      <p>
        Our Security Guarantee fee is nonrefundable. If you fail to make any
        payment when due for any reason, we may immediately suspend or terminate
        your Security Guarantee contract and we reserve the right, in our sole
        discretion, to deny any reimbursement incurred or due when your account
        is suspended or terminated.
      </p>
      <p>
        Purchase of our Security Guarantee is not mandatory for your use of our
        services; by declining our Security Guarantee, you assume all deposit
        risk and agree to not hold us liable for any lost, stolen, or damaged
        deposits.
      </p>
      <p>
        Payment of any fees under this Contract must be made in full when due.
        You are responsible for notifying us of any changes in your billing
        account information. If you fail to make any payment when due, we may
        immediately and without notice suspend or terminate your Security
        Guarantee and deny any Damages incurred or due when your account is
        suspended or terminated.
      </p>

      <h2>Term & Termination</h2>
      <p>
        The term of your Contract begins on the date of purchase and lasts until
        the date identified in your Confirmation. You may terminate your
        Contract by either: (i) providing us with written notice of termination
        prior to the start of your next term; or (ii) terminating your security
        monitoring services.
      </p>
      <p>
        We may immediately, and without notice, terminate your Contract in its
        entirety, or terminate its applicability to any specific deposit, for
        your violation of this Contract, including for your failure to make any
        payment when due. We may terminate any Contract for convenience by
        providing you with seven (7) days written notice prior to the start of
        your next term.
      </p>

      <h2>Reporting a Hack & Damages</h2>
      <p>
        You should notify us of any Hack or Damages as soon as reasonably
        practicable, and in any event within 24 hours of discovery, by
        contacting us at{' '}
        <a href="mailto:support@0.finance">support@0.finance</a>. You should
        include in your notice details describing the transaction(s) where the
        Hack occurred, plus any other relevant information about the Hack from
        other sources.
      </p>
      <p>
        In the event of a Hack, you must take all appropriate and reasonable
        actions to protect your deposit in order to reduce or limit the amount
        of expected or ongoing Damages. You acknowledge that time is of the
        essence and agree to cooperate with us in our investigation of any Hack,
        including but not limited to providing all materials or documentation
        reasonably requested.
      </p>
      <p>
        Any claimed Damages must be supported by sufficient documentation (e.g.,
        logs or records, account statements, police reports) which you must
        provide to us within seven (7) calendar days as part of our
        investigation process. Prior to us making any payment to you under this
        Contract, you may be required by us to file a police, securities, or
        similar authority report describing the circumstances of the Hack and
        provide us with a copy of the filed report.
      </p>

      <h2>Jurisdiction</h2>
      <p>
        You agree that this Contract is created under and pursuant to the laws
        of the United States, and you agree that you are entering into this
        Contract within the United States. By accepting this Contract, you
        consent to the jurisdiction of courts located within the United States
        in any and all suits, actions, or similar proceedings made pursuant to
        this Contract.
      </p>

      <h3>Restricted Jurisdictions</h3>
      <p>
        This service is not offered to persons or entities who reside in, are
        citizens of, are located in, are incorporated in, or have a registered
        office or principal place of business in any restricted jurisdiction or
        country subject to any sanctions or restrictions pursuant to any
        applicable law, including Afghanistan, the Crimea region, Cuba, Donetsk,
        Iran, Luhansk, Myanmar (Burma), North Korea, Russia, Syria, or any other
        country to which the United States, the United Kingdom, the European
        Union or any other jurisdictions embargoes goods or imposes similar
        sanctions (collectively, the "Restricted Jurisdictions") or any person
        owned, controlled, located in or organized under the laws of any
        jurisdiction under embargo or connected or affiliated with any such
        person (collectively, "Restricted Persons").
      </p>
      <p>
        There are no exceptions. If you are a blocked person or a restricted
        person, then do not use or attempt to use this service. Use of any
        technology or mechanism, such as a virtual private network ("VPN") to
        circumvent the restrictions set forth herein is prohibited.
      </p>

      <h3>Eligible Jurisdictions</h3>
      <p>
        The Security Services Guarantee is only offered to residents of United
        States, Canada, Mexico, Great Britain, and territories of the
        aforementioned jurisdictions.
      </p>
      <p>
        By using this service, you represent that (1) you are not a Restricted
        Person; and (2) you (including, if applicable, your individual owners,
        representatives, employees, or any other person with access to your
        account) will not coordinate, conduct or control (including by, in
        substance or effect, making decisions with respect to) your use of this
        service from any Restricted Jurisdiction.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about these Terms, please email us at&nbsp;
        <a href="mailto:support@0.finance">support@0.finance</a>.
      </p>

      <hr />
      <p className="text-sm">
        © {new Date().getFullYear()} Different AI&nbsp;Inc. All rights
        reserved.
      </p>
    </main>
  );
}
