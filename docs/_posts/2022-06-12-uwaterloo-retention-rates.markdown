---
layout: post
title:  "UWaterloo Engineering Retention Rates"
date:   2021-06-12 12:00:00 -0400
---

University retention rates are hard to come by, and as elaborated on by UW’s Professor Bill Anderson, they are often a [misleading and incomplete metric](https://profbillanderson.com/2018/09/21/engineering-failure-rates-redux/). However, I was recently shown some data on retention from a friend at another engineering school, and was interested to see how Waterloo’s retention roughly compared.

I followed a similar methodology as Prof. Anderson in his [blog post](https://profbillanderson.com/2020/02/22/graduation-rates-revisited/) comparing retention at various engineering schools in Ontario, but instead comparing UWaterloo programs. Essentially, I calculated the retention rate by taking the number of degrees awarded for a particular undergraduate program, and dividing it by the number of 1A students in that program five years prior.

This methodology has many shortcomings. Among others, it does not account for transfers to other programs, transfers between programs or schools, or delayed graduation. Assuming that the flow of students in and out of classes is relatively static, that last one shouldn’t be too much of an issue, but as you can see below the calculated retention is wildly erratic year over year, particularly for some of the smaller cohorts. In the case of Geological engineering, it even goes above 1.

Anyway, I thought I’d share my findings and present them as-is. You can find the source code and data [here](https://github.com/leif-blake/uwaterloo_stats).

<iframe src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fplotly.com%2F%7El_blake%2F1.embed%3Fautosize%3Dtrue&amp;display_name=Plotly&amp;url=https%3A%2F%2Fchart-studio.plotly.com%2F%7El_blake%2F1%2F&amp;image=https%3A%2F%2Fchart-studio.plotly.com%2Fstatic%2Fwebapp%2Fimages%2Fplotly-logo.8d56a320dbb8.png&amp;key=a19fcc184b9711e1b4764040d3dc5c07&amp;type=text%2Fhtml&amp;schema=plotly" allowfullscreen="" frameborder="0" height="400" width="600" title="Retention Rates for Selected programs | scatter chart made by L_blake | plotly" class="em n fe dz bh" scrolling="no"></iframe>

Data sources: [graduation](https://uwaterloo.ca/institutional-analysis-planning/university-data-and-statistics/student-data/degrees-granted-0), [enrolment](https://uwaterloo.ca/institutional-analysis-planning/university-data-and-statistics/student-data/student-headcounts) (accessed June 2022)
