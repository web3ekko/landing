# Teams

Choose between serving provider subscribers and monitoring separately supplied wallets.

Canonical URL: https://ekko.zone/docs/guides/teams/
Reviewed: 2026-09-06
Availability: Product concepts and scope; not a release-availability statement

A Team uses Ekko to deliver useful context to its users, retain understandable notification records, and monitor relevant operational activity.

## Choose the relationship

| Job                                     | Scope                                    | Notification relationship      |
| --------------------------------------- | ---------------------------------------- | ------------------------------ |
| Serve users through WalletAlert         | The provider's declared protocol         | Provider subscriber experience |
| Monitor separately supplied UserWallets | User Wallet Groups bound to Alert Groups | Webhooks only                  |

WalletAlert coverage must not replace the Alert Group scope of separately supplied UserWallets. See [product concepts](https://ekko.zone/docs/concepts/) for the full distinction.

## Define a useful outcome

Describe the position, opportunity, or problem the user needs to understand. Identify why a timely response would benefit that user. More notifications or clicks alone do not establish success. A user deciding not to transact can be a useful outcome.

The [delivery proof model](https://ekko.zone/docs/delivery-proof-model/) helps distinguish the trigger, affected cohort, expected notification, possible response, and impact.

## Setup availability

A verified Team setup-to-notification tutorial is not yet published in this library. Ask [support](mailto:support@ekko.zone?subject=Team%20setup) for the supported setup path for your release. Include the relationship above and the monitoring outcome you need. Do not infer production readiness from a demo.
