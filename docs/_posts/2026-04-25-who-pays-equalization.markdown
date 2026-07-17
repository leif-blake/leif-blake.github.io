---
layout: post
title:  "So Who Really Pays for Equalization?"
date:   2026-04-25 17:00:00 +0200
---

## Introduction

Equalization has long been a contentious issue in Canadian politics, and with fresh independence movements brewing in Quebec and Alberta, we must also be wary that it's one the most misunderstood. The program is frequently cited as a transfer of wealth from Canada's "have" Provinces, to the "have nots". In Quebec's case, this was to the tune of 13.6 billion dollars in the 2025/2026 fiscal year. Alberta, a long-serving member of the "have" community (since 1966!), received nothing.

I won't be explaining the details of Equalization, as many have done so in great detail. I recommend [this policy brief][link-policy-brief] from former Deputy Finance Minister Louis Lévesque for a solid explanantion of the program and a modern overview of the debate surrounding it. All I will do is point out that while the transfers are handed out to Provincial governments, the money for Equalization comes from the the Federal government's general revenue. This is an important distinction for two reasons:

1. The money is coming from individuals and corporations. Someone earning $100k in Quebec pays the same in Federal taxes as someone earning $100k in Alberta
1. Some of that Federal revenue is generated in the "have not" Provinces themselves

By looking soley at the payments, and ignoring the funding, we exagerate the true scale and "unfairness" of the program. Moreover, we must consider what taxes have been levied to pay for it in the first place. Flipping the argument on its head, if we were to cancel the Equalization program tomorrow, what tax cuts would we enjoy in its absence, or what other programs would see more funds allocated in its place? In such a scenario, I will evaluate who benefits from and pays for the program by retroactively applying this policy change, and evaluating the per capita inflow of Equalization vs the alternative, all else being equal.

\begin{equation}
BENEFIT_{Equalization} = INFLOW_{Equalization} - \Delta INFLOW_{Alternative}
\end{equation}

Despite Equalization payments of some form being [constitutionally enshrined][link-constitution], I will examine several options the Federal government could adopt after cancelling the program wholesale. Under each scenario, 

1. Increasing spend on other programs

    &nbsp;&nbsp;&nbsp; i) Per-capita transfer programs

    &nbsp;&nbsp;&nbsp; ii) Increasing old age security
2. Lowering taxes

    &nbsp;&nbsp;&nbsp; i) A flat tax credit to all tax payers

    &nbsp;&nbsp;&nbsp; ii) Decreasing the top income tax bracket

    &nbsp;&nbsp;&nbsp; iii) Decreasing corporate income tax

I will only consider the year 2022, since this was the only year for which I could find data across all dimensions. All dollar amounts are adjusted to 2026 CAD per CPI. The Territories are included for completeness (and since my family would get mad at me otherwise). However, they receive funds through Territorial Formula Financing, which is not being cancelled under these hyopthetical scenarios. This means they look like "have" Provinces, but in reality they rake in billions from the Feds.

Now let's dive in!

[link-policy-brief]: https://www.schoolofpublicpolicy.sk.ca/documents/research/policy-briefs/equalisation-policy-paper_final.pdf
[link-constitution]: https://laws-lois.justice.gc.ca/eng/const/page-13.html#h-56

## 1. The baseline of Equalization in 2022

The classic representation of Equalization is in dollars received per capita. This tells us the "gross" benefit of Equalization, but doesn't indicate who bears the costs or the net benefit to the "have not" Provinces. In 2022, 5 out of 10 Provinces received Equalization payments.

<iframe
    src="{{ '/assets/html/map_raw_equalization_per_capita_2022.html' | relative_url }}"
    title="Raw Equalization per capita map"
    loading="lazy"
    style="width: 100%; height: 475px; border: 0;"
></iframe>

## 2. Increasing spend on other programs


### 2.1 Per-capita transfer programs

Canada has three major federal-provincial transfer programs, only one of which (Equalization) is not simply a function of each Province's population. So why not simply re-alocate the Equalization money to these programs? Under this regime, all the Provinces who did not receive Equalization would benefit equally, to the tune of $590.77 per capita. By this logic, Equalization cost on net $590.77 for the citizens of "have" Provinces in 2022. The net benefit of Equalization is also reduced by this amount for each of the have not Provinces.

<iframe
    src="{{ '/assets/html/map_federal_net_change_per_capita_2026_population_flat_transfer_2022.html' | relative_url }}"
    title="Equalization net benefit per capita map under flat transfer replacement model"
    loading="lazy"
    style="width: 100%; height: 475px; border: 0;"
></iframe>

### 2.2 Old age security

This is where it starts to get interesting. It may not seem logical to re-allocate a Federal-Provincial transfer payment to seniors, but every dollar spent in one place is a dollar lost in another. It could be argued that money spent on equalization is money denied to the oldest members of our scoiety. In practice however, a full re-allocation of Equalization to OAS would represent a 75% increase in spend, which might be a little far fetched. I've also ignored the fact that OAS is a taxable benfit, so the Federal government would see clawbacks on this spend, and that spend would not be equally distributed across the country.

In this hypothetical scenario, we see a very different distribution in the net benefits of Equalization. Most of the have-nots are better off than under the per-capita model, reflecting their older populations. Manitoba is the exception, which sees fewer benefits from Equalization as compared to the enlarged OAS spending scenario. The big loser in this scenario is Newfoundland and Labrador, whose aging population brings in disproportionately high levels of OAS. Alberta, comparatively rich but relevatively young, does not see as much burden from Equalization.

<iframe
    src="{{ '/assets/html/map_federal_net_change_per_capita_2026_oas_even_increase_2022.html' | relative_url }}"
    title="Equalization net benefit per capita map under OAS increase replacement model"
    loading="lazy"
    style="width: 100%; height: 475px; border: 0;"
></iframe>

## 3. Lowering taxes

### 3.1 A flat tax credit to all tax payers

Rather than handing out money on a per capita basis, the government could instead given 

### 3.2 Decreasing the top income tax bracket

### 3.3 Decreasing corporate income tax