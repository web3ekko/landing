# Troubleshooting

Identify the affected relationship and collect useful evidence for a documentation or notification question.

Canonical URL: https://ekko.zone/docs/troubleshooting/
Reviewed: 2026-09-06
Availability: Product concepts and scope; not a release-availability statement

## A setup guide or command is missing

The current library explains concepts and evaluation boundaries. It does not yet contain verified setup tutorials or executable API examples. Ask [support](mailto:support@ekko.zone) for the supported path for your release instead of guessing an endpoint or installing a package from an illustrative example.

## Provider alerts are absent from a direct account

Provider subscriber and direct Individual relationships are separate. Matching wallet addresses do not link identities, permissions, data, or subscriptions. Contact the provider for its subscriber experience; describe a direct Individual issue separately.

## A notification seems absent or late

Record the observed event and time, the affected wallet or group, the expected channel, and the result you can actually observe. Confirm the monitoring scope with the Team or provider responsible for it. For separately supplied UserWallets, the delivery route is webhooks only.

Do not treat the absence of a notification as proof that no relevant event occurred. Use the [delivery proof model](https://ekko.zone/docs/delivery-proof-model/) to separate observations from assumptions. Recovery controls depend on the release; support can confirm the available steps.

## A report has no data

**N/A (no data found)** means the investigation did not find evidence for that question. It does not establish safety, trustworthiness, or a favorable result.

## Report a documentation problem

Send [support](mailto:support@ekko.zone?subject=Documentation%20issue) the page URL, the step or statement in question, and the observed result. Do not include private keys, authentication tokens, or wallet recovery phrases. Every page includes its review date and a Markdown download to make the relevant text easy to identify.
