---
layout: post
title:  "So Who Really Pays for Equalization?"
date:   2026-07-18 15:30:00 +0200
---

## Introduction

Equalization has long been a contentious issue in Canadian politics, and with fresh independence movements brewing in Quebec and Alberta, we should recognize that it's one of the most misunderstood. The program is frequently cited as a transfer of wealth from Canada's "have" Provinces, to the "have nots". In Quebec's case, this was to the tune of 13.6 billion dollars in the 2025/2026 fiscal year. Alberta, a long-serving member of the "have" community (since 1966!), received nothing. However, there are some improtant nuances that are missed in this narrative.

I won't be explaining the details of Equalization, as many have done so in great detail. I recommend [this policy brief][link-policy-brief] from former Deputy Finance Minister Louis Lévesque for a solid explanation of the program and a modern overview of the debate surrounding it. All I will do is point out that while the transfers are handed out to Provincial governments, the money for Equalization comes from the the Federal government's general revenue. This is an important distinction for two reasons:

1. The money is coming from individuals and corporations. Someone earning $100k in Quebec pays the same in Federal taxes as someone earning $100k in Alberta
1. Some of that Federal revenue is generated in the "have not" Provinces themselves

By looking solely at the payments, and ignoring the funding, we exaggerate the true scale and "unfairness" of the program. Moreover, we must consider which taxes have been levied to pay for it in the first place. Flipping the argument on its head, if we were to cancel the Equalization program tomorrow, what tax cuts would we enjoy in its absence, or what other programs would see more funds allocated in its place? As we will see, the distribution of costs and benefits vary by the choice of alternative policy.

Despite Equalization payments of some form being [constitutionally enshrined][link-constitution], I will examine several options the Federal government could adopt by re-allocating the entire cost of the Equalization program. Under each alternative policy, I will determine who benefits from and pays for Equalization by retroactively applying the policy change. The benefit of equalization is then calculated by the amount received by a Province, minus the amount they would have received under an alternative policy. For a tax policy, the tax savings they would have received under the alternative policy is subtracted instead.

\begin{equation}
BENEFIT_{Equalization} = INFLOW_{Equalization} - INFLOW_{Alternative}
\end{equation}

The policy alternatives I will consider are:

1. Increasing spend on other programs

    &nbsp;&nbsp;&nbsp; i) Per-capita transfer programs

    &nbsp;&nbsp;&nbsp; ii) Increasing old age security
2. Lowering taxes

    &nbsp;&nbsp;&nbsp; i) A flat tax credit to all tax payers

    &nbsp;&nbsp;&nbsp; ii) Decreasing taxes on the top income tax bracket

    &nbsp;&nbsp;&nbsp; iii) Decreasing corporate income tax

I will only consider the year 2022, since this was the only year for which I could find data across all dimensions. All dollar amounts are adjusted to 2026 CAD per CPI. The Territories are included for completeness (and since my family would get mad at me otherwise). However, they receive funds through Territorial Formula Financing, which is not being cancelled under these hyopthetical scenarios. This means they look like "have" Provinces, but in reality they rake in billions from the Feds.

I should also note that I did not have access to granular personal income tax data, so my analysis is limited to crude estimates of the impacts of certain policy decisions. The results should be interpreted as toy models illustrating the effects of certain "categories" of policy, such as reducing taxes on higher income earners, or increasing spending on seniors. They should not be taken as authoritative conclusions regarding the the benefits and costs of Equalization.

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

This is where it starts to get interesting. It may not seem logical to re-allocate a Federal-Provincial transfer payment to seniors, but every dollar spent in one place is a dollar lost in another. In practice, a full re-allocation of Equalization to OAS (by means of a flat percent increase across income levels) would represent a 75% increase in spend, which might be a little far fetched. I've also ignored the fact that OAS is a taxable benefit, so the Federal government would see clawbacks on this spend, and that clawback would not be equally distributed across the country. Also note that Nunavut OAS data is grouped in with NWT, so I've combined their populations as well.

Considering this alternative, we see a very different distribution in the net benefits of Equalization. Most of the have-nots are worse off than under the per-capita model, reflecting their older populations. Manitoba is the exception, which sees larger benefits from Equalization as compared to the enlarged OAS spending scenario, owing to its young population. The big loser here is Newfoundland and Labrador, whose aging population brings in disproportionately high levels of OAS. Alberta, comparatively rich but relatively young, does not see as much burden from Equalization.

<iframe
    src="{{ '/assets/html/map_federal_net_change_per_capita_2026_oas_even_increase_2022.html' | relative_url }}"
    title="Equalization net benefit per capita map under OAS increase replacement model"
    loading="lazy"
    style="width: 100%; height: 475px; border: 0;"
></iframe>

## 3. Lowering taxes

### 3.1 A flat tax credit to all tax payers

Rather than handing out money on a per capita basis, the government could instead give tax credits to all taxpayers. This is modeled as a flat credit, regardless of income level. The results aren't too far from the per-capita model, with slight variations between provinces mostly representative of the number of children residing there.

<iframe
    src="{{ '/assets/html/map_federal_net_change_per_capita_2026_tax_filers_flat_transfer_2022.html' | relative_url }}"
    title="Equalization net benefit per capita map under flat tax credit replacement model"
    loading="lazy"
    style="width: 100%; height: 475px; border: 0;"
></iframe>

### 3.2 Decreasing taxes on the top income tax bracket

Due to the lack of granular data, this alternative only considers reducing the taxes paid by those in the top income bracket, not the rates of the top tax bracket itself. This may result in some perverse situations such as lower or even negative marginal rates at the top of the income ladder. Notwithstanding these limitations, the results still illustrate the burden of Equalization if we consider it paid for by taxes on the highest earning Canadians.

Here the costs shift immensely to Alberta, a Province rich in high incomes. Trailing behind are BC and Ontario. The costs drop off considerably in the other Provinces, indicating that their realtively few high flyers do not contribute much to federal coffers. All the have-nots see substantial gains vs the per-capita model, reflecting their lack of high earners.

<iframe
    src="{{ '/assets/html/map_federal_net_change_per_capita_2026_personal_top_bracket_tax_2022.html' | relative_url }}"
    title="Equalization net benefit per capita map under top income tax bracket decrease replacement model"
    loading="lazy"
    style="width: 100%; height: 475px; border: 0;"
></iframe>

### 3.3 Decreasing corporate income tax

If we instead consider Equalization paid for by our nation's businesses, a different picture emerges. Here, BC, Alberta, and Ontario share roughly equal burdens. Newfoundland and Labrador, far from the coprorate centre of gravity, sees only a modest cost. Once again, Quebec sees gains vs the per-capita model, but less than under the high-income tax cut alternative. The maritimes and Manitoba see benefits roughly equal to the previous model.

<iframe
    src="{{ '/assets/html/map_federal_net_change_per_capita_2026_corporate_income_tax_2022.html' | relative_url }}"
    title="Equalization net benefit per capita map under corporate income tax decrease replacement model"
    loading="lazy"
    style="width: 100%; height: 475px; border: 0;"
></iframe>

## 4. Conclusion

Judging economics of Equalization is not as simple as looking at the outflow of money from the Federal government. Since the program is paid for out of general revenue, any discussion on the costs and benefits to Provinces must be accompanied by an arumgent for how that money would be spent or saved instead. The answer to the question of who pays for Equalization depends on this alternative we choose.

Summarizing the costs and benefits per capita under all models, with Provinces ordered by their raw equalization payments:

| Province                  | Raw Equalization | Per capita transfer | OAS Increase | Flat Tax Credit | High Income | Corporate Income |
| ------------------------- | ---------------- | ------------------- | ------------ | --------------- | ----------- | ---------------- |
| Prince Edward Island      | 3194             | 2604                | 2504         | 2593            | 2914        | 2941             |
| New Brunswick             | 3098             | 2507                | 2330         | 2483            | 2883        | 2856             |
| Nova Scotia               | 2493             | 1902                | 1758         | 1888            | 2192        | 2198             |
| Manitoba                  | 2117             | 1526                | 1566         | 1557            | 1772        | 1761             |
| Quebec                    | 1664             | 1073                | 970          | 1053            | 1240        | 1119             |
| Alberta                   | 0                | \-591               | \-455        | \-566           | \-812       | \-646            |
| British Columbia          | 0                | \-591               | \-588        | \-596           | \-671       | \-670            |
| Newfoundland and Labrador | 0                | \-591               | \-809        | \-627           | \-320       | \-189            |
| Northwest Territories     | 0                | \-591               | \-231        | \-528           | \-320       | \-428            |
| Nunavut                   | 0                | \-591               | \-231        | \-413           | \-202       | \-94             |
| Ontario                   | 0                | \-591               | \-553        | \-587           | \-689       | \-661            |
| Saskatchewan              | 0                | \-591               | \-570        | \-566           | \-349       | \-491            |
| Yukon                     | 0                | \-591               | \-464        | \-540           | \-290       | \-362            |

You can find all the data and code used in this analysis [here][link-equalization]

[link-equalization]: https://github.com/leif-blake/equalization
