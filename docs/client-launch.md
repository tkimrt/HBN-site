# hbnnet.com Launch — Client DNS Checklist

Every step needed to put the new site live on **hbnnet.com** with contact-form
email delivered to **admin@hbnnet.com**. All client-side changes are ordinary
DNS records added at **Network Solutions** — their nameservers, mailboxes and
existing email records are not touched.

**The site today:** https://green-river-09a1ee50f.7.azurestaticapps.net
(fully working: articles, events, admin behind a password, contact form storing
enquiries; email currently delivers to RealTorch only, pending Part 1).

---

## Before the meeting (us, ~5 minutes)

1. **Resend dashboard** → https://resend.com/domains → **Add Domain** →
   `send.hbnnet.com`. Copy the three records it shows into the table in
   Part 1 below (MX value, SPF value, DKIM value — the DKIM key is unique
   per account and only appears here).
2. Confirm the client can sign in to **Network Solutions** during the call.
   If the login can't be found, reschedule — nothing here is worth rushing
   on a live business domain.

---

## Part 1 — Email (3 records)

Purpose: lets the website send email *as* `send.hbnnet.com`, which unlocks
delivery to admin@hbnnet.com (and anyone else).

At Network Solutions → hbnnet.com → **Advanced DNS**, add:

| # | Type | Host field | Value | Priority |
|---|------|-----------|-------|----------|
| 1 | MX  | `send` | `feedback-smtp.<region>.amazonses.com` *(from Resend)* | 10 |
| 2 | TXT | `send` | `v=spf1 include:amazonses.com ~all` | — |
| 3 | TXT | `resend._domainkey.send` | `p=MIGf…` *(long DKIM key from Resend)* | — |

**The two traps:**
- Network Solutions appends `.hbnnet.com` automatically. Enter host **`send`**,
  never `send.hbnnet.com` — that silently becomes `send.hbnnet.com.hbnnet.com`
  and verification fails. Same for `resend._domainkey.send`.
- The DKIM value is very long. Copy it completely — a clipped key fails
  verification with no useful error.

**Then:** Resend dashboard → the domain → **Verify**. Usually green within
minutes. Once verified, we flip two settings on the host (no client action):
`CONTACT_FROM → Home Builders Network <website@send.hbnnet.com>` and
`CONTACT_TO → admin@hbnnet.com`, and send a live test the client should see
arrive during the call. First messages may land in spam until the subdomain
builds reputation — that is normal.

---

## Part 2 — Website (hbnnet.com → the new site)

Purpose: points the domain at the new site. **This is the switchover moment**
— the records being replaced are what serve the old site today.

### 2a. www (the main record)

Replace the existing `www` A record (currently `205.149.143.100`) with:

| Type | Host field | Value |
|------|-----------|-------|
| CNAME | `www` | `green-river-09a1ee50f.7.azurestaticapps.net` |

After it's saved, **we** finish the link on our side (Azure requires the
record to exist before it validates):

    az staticwebapp hostname set -n hbn-website -g hbn-website --hostname www.hbnnet.com

Azure then issues the HTTPS certificate itself — allow ~15 minutes. (The old
site never had a working certificate; this fixes that.)

### 2b. The bare domain (hbnnet.com)

Already pre-registered on our side. Two records:

| Type | Host field | Value |
|------|-----------|-------|
| TXT | `@` | `_zuaqtrlps0luegqe21qe775tyhysydo` |
| A | `@` | *IP shown in Azure once the TXT validates (replaces `205.149.143.100`)* |

If the A-record IP isn't available during the call, use Network Solutions'
**domain forwarding** to send `hbnnet.com → https://www.hbnnet.com` instead —
this matches exactly what the domain does today (it already redirects to www),
and can be swapped for the A record later without the client.

### Propagation

DNS changes take minutes to a few hours to reach everyone. During that window
some visitors see the old site, some the new — normal, not a fault. The old
site keeps serving until the records flip, so there is no downtime.

---

## Network Solutions walkthrough (the actual clicks)

**Once:** networksolutions.com → Login → Account Manager → **My Domain Names**
→ hbnnet.com → **Manage** → **Change Where Domain Points → Advanced DNS**.
Every record below lives on that one page; each section has an
**Edit … Records** button and finishes with **Continue → Save Changes**.

1. **TXT section** — add two rows: `send` = the SPF value, and
   `resend._domainkey.send` = the DKIM key. **Add rows — never edit the
   existing `v=spf1 include:spf.pwhosts.com` row** (that is their live email).
2. **MX section** — new row: Host `send`, Priority 10, server
   `feedback-smtp.<region>.amazonses.com`. **Stop-sign:** if the MX editor has
   no Host/Alias column, do NOT save — a root MX would siphon real inbound
   mail. Leave it for a NetSol support chat ("add an MX for the subdomain
   send.hbnnet.com") and carry on.
3. **A records section** — delete the `www` row (205.149.143.100); NetSol
   won't take a CNAME while an A exists for the same host.
4. **CNAME section** — Alias `www`, choose "Other Host", value
   `green-river-09a1ee50f.7.azurestaticapps.net`, TTL 7200.
5. **TXT section** — one more row: `@` = the Azure validation token above.
6. **Apex** — edit the `@` A record to Azure's IP once shown; otherwise
   **Web Forwarding** hbnnet.com → https://www.hbnnet.com for now.

Host fields always take the short name (`send`, `www`, `@`) — the UI appends
`.hbnnet.com` itself.

---

## What does NOT change (say this up front)

- **Nameservers stay at Network Solutions** (`ns39/ns40.worldnic.com`)
- **Email keeps working exactly as today** — the MX, SPF and mailboxes for
  admin@hbnnet.com are untouched; everything new lives on `send.…`, a
  subdomain that doesn't exist yet
- Nothing is deleted; every changed record is written down and reversible

## Rollback

Restore `www` and `@` A records to `205.149.143.100` → the old site is back
as-is. Removing the three `send` records switches email back to the test
setup. Nothing in Part 1 or 2 can affect their existing mailbox either way.

---

## After the meeting (us, no client needed)

- [ ] Flip `CONTACT_FROM` / `CONTACT_TO` on Azure; live email test to admin@
- [ ] Confirm both hostnames show **Validated** + certificate in Azure
- [ ] Point the daily keep-alive ping at `https://www.hbnnet.com`
- [ ] `wrangler login`, sweep late enquiries from the old Cloudflare database,
      then retire the old Worker, D1 and R2
- [x] Supabase Pro decided ($25/mo — no idle-pause, daily backups; upgrade in
      the Supabase org's Billing page, then confirm the plan shows on the project)
- [ ] Hand over the admin sign-in (`/admin`) and walk the client through
      publishing an article
