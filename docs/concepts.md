# Product concepts

How monitoring, intelligence, and proposed actions serve people within a clear scope.

Canonical URL: https://ekko.zone/docs/concepts/
Reviewed: 2026-09-06
Availability: Product concepts and scope; not a release-availability statement

## Monitoring has a scope

Monitoring brings relevant onchain changes to a person's attention. Coverage is the scope that person or Team has chosen; it is not a promise to see every asset, protocol, or risk.

A Team is a provider, such as a protocol team or wallet provider. Through WalletAlert, a provider serves subscribers within its declared protocol. The provider should explain that boundary clearly. Intelligence within that coverage serves the subscriber's interests, including when a useful response would reduce the provider's revenue.

## Two wallet relationships

**Provider Wallets** come through WalletAlert and belong to the provider subscriber experience.

**UserWallets** are wallets a provider supplies separately. They belong to **User Wallet Groups**, whose monitoring scope comes from **Alert Groups**. Notifications about these wallets use **webhooks only**. They do not use WalletAlert or Individual delivery channels.

## Intelligence answers questions

Intelligence is an agent's investigation delivered as a report. Findings answer specific questions and should be read with their evidence. **N/A (no data found)** means evidence was not found; it does not mean the subject is safe.

## People control transactions

Ekko reads, proposes, and prepares. The person decides whether to proceed and executes a transaction in their wallet or chosen application. Ekko does not sign, submit, or execute transactions on their behalf. A notification, wallet registration, or monitoring permission does not grant transaction authority.

## Relationships stay separate

A provider subscriber can receive value entirely through the provider. They do not need a direct Individual account. Choosing to use Ekko directly creates a separate Individual relationship: identities, subscriptions, permissions, and data are not linked or transferred, even when the wallet address is the same.

These are product boundaries. They do not establish which features are enabled in a particular release.
