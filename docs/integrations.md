# Developer integrations

Evaluate an integration against its audience, coverage, consent, and delivery contract.

Canonical URL: https://ekko.zone/docs/integrations/
Reviewed: 2026-09-06
Availability: Product concepts and scope; not a release-availability statement

Start with the user relationship and intended benefit. An integration should bring useful onchain context to a person or help a Team understand the activity it monitors.

## Installation and API availability

This library does not yet publish a verified WalletAlert installation package, public authentication tutorial, or executable API reference. Contact [support](mailto:support@ekko.zone?subject=Integration%20evaluation) to confirm the supported release and installation path before integrating.

A visual demo establishes neither an installation contract nor production readiness. Do not turn illustrative script attributes into a production setup. API or webhook examples will be published here when their release path and behavior have been verified.

## Establish the boundary

| Integration question        | What to establish                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| Who receives value?         | A provider subscriber, a Team monitoring UserWallets, or a direct Individual             |
| What is monitored?          | Declared protocol for WalletAlert; Alert Group scope for separately supplied UserWallets |
| What authorizes access?     | The supported authentication and explicit consent flow for that release                  |
| What proves delivery?       | The documented channel, observable result, and failure states                            |
| What controls transactions? | The person executes in their wallet or chosen application                                |

Separately supplied UserWallets use webhooks only. They do not acquire WalletAlert or consumer delivery as a fallback. A provider subscriber and a direct Individual remain separate identities, even when a wallet address matches.

## Evaluate the result

Use the [delivery proof model](https://ekko.zone/docs/delivery-proof-model/) to define what the notification should achieve and which observations could support that conclusion. Distinguish channel acceptance, delivery evidence, and a person's subsequent action; one does not automatically establish the next.

The [developer overview](https://ekko.zone/developers) is an evaluation entry point. This documentation is the maintained location for technical guidance as supported interfaces become available.
